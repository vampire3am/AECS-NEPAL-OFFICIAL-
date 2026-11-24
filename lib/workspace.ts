import "server-only";
import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/validation";
export async function workspaceActor() {
  const { data } = await getAuth().getSession();
  const user = data?.user;
  if (!user || !user.emailVerified) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name || "",
    staff:
      user.email.toLowerCase() ===
      process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  };
}
export function failure(error: string, status = 400) {
  return NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}
export function allowed(request: NextRequest) {
  return isAllowedOrigin(
    request.headers.get("origin"),
    request.url,
    process.env.NEXT_PUBLIC_SITE_URL,
  );
}
export async function limitMutation(actorId: string) {
  const sql = db();
  const rows =
    await sql`INSERT INTO request_limits(key,count,expires_at) VALUES(${"workspace:" + actorId},1,now()+interval '10 minutes') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN request_limits.expires_at<now() THEN 1 ELSE request_limits.count+1 END,expires_at=CASE WHEN request_limits.expires_at<now() THEN now()+interval '10 minutes' ELSE request_limits.expires_at END RETURNING count`;
  return rows[0].count <= 60;
}
export async function profile(actor: {
  id: string;
  email: string;
  name: string;
}) {
  const sql = db();
  await sql`INSERT INTO student_profiles(user_id,email,name) VALUES(${actor.id},${actor.email},${actor.name}) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email`;
}
