import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { storage, documentBucket } from "@/lib/storage";
import { workspaceActor, failure } from "@/lib/workspace";
export const dynamic = "force-dynamic";
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await workspaceActor();
    if (!actor) return failure("Please sign in.", 401);
    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id))
      return failure("Document not found.", 404);
    const sql = db();
    const rows =
      await sql`SELECT object_key,name,content_type FROM student_documents WHERE id=${id} AND (user_id=${actor.id} OR ${actor.staff}) AND status IN ('Uploaded','Reviewed','Changes requested')`;
    if (!rows.length) return failure("Document not found.", 404);
    const doc = rows[0];
    const result = await storage().send(
      new GetObjectCommand({ Bucket: documentBucket, Key: doc.object_key }),
    );
    if (!result.Body) return failure("Document unavailable.", 404);
    const bytes = await result.Body.transformToByteArray();
    await sql`INSERT INTO workspace_audit(actor_id,student_id,action,target_id) SELECT ${actor.id},user_id,'document-download',id::text FROM student_documents WHERE id=${id}`;
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": doc.content_type,
        "Content-Disposition":
          "attachment; filename*=UTF-8''" + encodeURIComponent(doc.name),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return failure("Document unavailable. Please retry.", 503);
  }
}
