import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { storage, documentBucket } from "@/lib/storage";
import {
  workspaceActor,
  failure,
  allowed,
  limitMutation,
  profile,
} from "@/lib/workspace";
import { documentType } from "@/lib/workspace-validation";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  if (!allowed(request)) return failure("Invalid request origin.", 403);
  try {
    const actor = await workspaceActor();
    if (!actor) return failure("Please sign in with a verified email.", 401);
    if (actor.staff)
      return failure("Documents must be uploaded by the student account.", 403);
    if (Number(request.headers.get("content-length") || 0) > 3300000)
      return failure("Use a PDF, JPG or PNG up to 3 MB.", 413);
    if (!(await limitMutation(actor.id)))
      return failure("Too many uploads. Please try again later.", 429);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 3145728)
      return failure("Choose a PDF, JPG or PNG up to 3 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = documentType(bytes);
    if (!type || type !== file.type)
      return failure("The file content must match a PDF, JPG or PNG.");
    const name =
      file.name.replace(/[\/\\\x00-\x1f\x7f]/g, "_").slice(0, 150) ||
      "document";
    await profile(actor);
    const sql = db();
    const id = randomUUID(),
      key = actor.id + "/" + id;
    const rows =
      await sql`WITH reserved AS (UPDATE student_profiles SET document_count=document_count+1 WHERE user_id=${actor.id} AND document_count<30 RETURNING user_id) INSERT INTO student_documents(id,user_id,name,object_key,content_type,size_bytes) SELECT ${id},user_id,${name},${key},${type},${file.size} FROM reserved RETURNING id`;
    if (!rows.length)
      return failure(
        "Your workspace has reached its 30-document limit. Contact AECS.",
        409,
      );
    try {
      await storage().send(
        new PutObjectCommand({
          Bucket: documentBucket,
          Key: key,
          Body: bytes,
          ContentType: type,
          CacheControl: "private, no-store",
        }),
      );
      await sql`UPDATE student_documents SET status='Uploaded' WHERE id=${id} AND user_id=${actor.id}`;
      await sql`INSERT INTO workspace_audit(actor_id,student_id,action,target_id) VALUES(${actor.id},${actor.id},'document-upload',${id})`;
    } catch {
      await sql`WITH failed AS (UPDATE student_documents SET status='failed' WHERE id=${id} AND user_id=${actor.id} RETURNING user_id) UPDATE student_profiles SET document_count=GREATEST(0,document_count-1) WHERE user_id IN (SELECT user_id FROM failed)`;
      return failure("Your document was not saved. Please retry.", 503);
    }
    return NextResponse.json(
      { success: true },
      { status: 201, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return failure("Your document could not be uploaded. Please retry.", 503);
  }
}
