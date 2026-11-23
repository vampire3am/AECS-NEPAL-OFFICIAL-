import { createHmac, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requestSchema, isAllowedOrigin } from "@/lib/validation";
export async function POST(request: NextRequest) {
  if (
    !isAllowedOrigin(
      request.headers.get("origin"),
      request.url,
      process.env.NEXT_PUBLIC_SITE_URL,
    )
  )
    return NextResponse.json(
      { error: "Please send this request from the AECS website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json(
      { error: "JSON request required." },
      { status: 415 },
    );
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 8192)
    return NextResponse.json(
      { error: "Your request is too long." },
      { status: 413 },
    );
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "The request could not be read." },
      { status: 400 },
    );
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  const data = parsed.data;
  if (data.preferredDate) {
    const date = new Date(data.preferredDate + "T00:00:00Z");
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kathmandu",
    });
    if (
      Number.isNaN(date.valueOf()) ||
      date.toISOString().slice(0, 10) !== data.preferredDate ||
      data.preferredDate < today
    )
      return NextResponse.json(
        { error: "Choose a valid date from today onward." },
        { status: 400 },
      );
  }
  try {
    const secret = process.env.RATE_LIMIT_SECRET;
    if (!secret) throw new Error("Rate limit secret missing");
    const ip =
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "local";
    const bucket = Math.floor(Date.now() / 600000);
    const key = createHmac("sha256", secret)
      .update(`${ip}:${bucket}`)
      .digest("hex");
    const sql = db();
    const reference = "AECS-" + randomBytes(5).toString("hex").toUpperCase();
    const rows =
      await sql`WITH rate AS (INSERT INTO request_limits(key,count,expires_at) VALUES(${key},1,now()+interval '20 minutes') ON CONFLICT(key) DO UPDATE SET count=request_limits.count+1 RETURNING count), saved AS (INSERT INTO enquiries(request_id,reference,name,phone,email,service,destination,meeting_mode,preferred_date,note) SELECT ${data.requestId},${reference},${data.name},${data.phone},${data.email},${data.service},${data.destination},${data.mode},${data.preferredDate || null}::date,${data.note} FROM rate WHERE count<=5 ON CONFLICT(request_id) DO UPDATE SET request_id=EXCLUDED.request_id RETURNING reference) SELECT reference FROM saved`;
    if (!rows.length)
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait ten minutes or call the front desk.",
        },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    return NextResponse.json(
      {
        reference: rows[0].reference,
        message:
          "Your request is saved. AECS will contact you to confirm a time.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("AECS enquiry persistence failed");
    return NextResponse.json(
      {
        error:
          "Your request was not saved. Please retry, or contact the front desk directly.",
      },
      { status: 503 },
    );
  }
}

