import { NextRequest, NextResponse } from "next/server";
import { getStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAllowedOrigin } from "@/lib/validation";
import { z } from "zod";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    if (!(await getStaff()))
      return NextResponse.json(
        { error: "Staff authorisation required." },
        { status: 403 },
      );
    const filter = request.nextUrl.searchParams.get("status") || "all";
    if (!["all", "new", "contacted", "scheduled", "closed"].includes(filter))
      return NextResponse.json(
        { error: "Invalid status filter." },
        { status: 400 },
      );
    const rawPage = Number(request.nextUrl.searchParams.get("page") || 0);
    const page = Number.isFinite(rawPage)
      ? Math.min(10000, Math.max(0, Math.floor(rawPage)))
      : 0;
    const sql = db();
    const rows =
      await sql`SELECT id,reference,name,phone,email,service,destination,meeting_mode,preferred_date,note,status,created_at FROM enquiries WHERE (${filter}='all' OR status=${filter}) ORDER BY created_at DESC LIMIT 51 OFFSET ${page * 50}`;
    return NextResponse.json(
      { items: rows.slice(0, 50), hasMore: rows.length > 50 },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "The enquiry desk is temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function PATCH(request: NextRequest) {
  if (
    !isAllowedOrigin(
      request.headers.get("origin"),
      request.url,
      process.env.NEXT_PUBLIC_SITE_URL,
    )
  )
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  try {
    const staff = await getStaff();
    if (!staff)
      return NextResponse.json(
        { error: "Staff authorisation required." },
        { status: 403 },
      );
    const text = await request.text();
    if (text.length > 1024)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }
    const parsed = z
      .object({
        id: z.uuid(),
        status: z.enum(["new", "contacted", "scheduled", "closed"]),
      })
      .safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid status update." },
        { status: 400 },
      );
    const sql = db();
    const { id, status } = parsed.data;
    const rows =
      await sql`WITH updated AS (UPDATE enquiries SET status=${status},updated_at=now() WHERE id=${id} RETURNING id), audit AS (INSERT INTO staff_audit(actor,enquiry_id,action) SELECT ${staff.id},id,${"status:" + status} FROM updated) SELECT id FROM updated`;
    if (!rows.length)
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 },
      );
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "The status was not saved. Please try again." },
      { status: 503 },
    );
  }
}

