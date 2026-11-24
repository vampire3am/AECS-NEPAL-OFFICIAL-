import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  workspaceActor,
  failure,
  allowed,
  limitMutation,
  profile,
} from "@/lib/workspace";
import { actionSchema, isStaffOnly } from "@/lib/workspace-validation";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const actor = await workspaceActor();
    if (!actor) return failure("Please sign in with a verified email.", 401);
    const sql = db();
    const target = request.nextUrl.searchParams.get("student");
    if (target && !actor.staff)
      return failure("Staff authorisation required.", 403);
    if (actor.staff && !target) {
      const students =
        await sql`SELECT p.user_id,p.name,p.email,p.created_at,(SELECT count(*)::int FROM applications a WHERE a.user_id=p.user_id) AS applications,(SELECT max(created_at) FROM workspace_messages m WHERE m.user_id=p.user_id) AS last_message FROM student_profiles p ORDER BY p.created_at DESC LIMIT 100`;
      return NextResponse.json(
        { staff: true, students },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const id = actor.staff && target ? target : actor.id;
    const [
      people,
      plans,
      applications,
      tasks,
      documents,
      messages,
      appointments,
      events,
    ] = await Promise.all([
      sql`SELECT user_id,name,email,phone FROM student_profiles WHERE user_id=${id}`,
      sql`SELECT * FROM study_plans WHERE user_id=${id}`,
      sql`SELECT * FROM applications WHERE user_id=${id} ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT id,user_id,title,owner,due_date::text,completed,created_at FROM workspace_tasks WHERE user_id=${id} ORDER BY completed,due_date NULLS LAST,created_at DESC LIMIT 100`,
      sql`SELECT id,name,content_type,size_bytes,status,feedback,created_at,reviewed_at FROM student_documents WHERE user_id=${id} AND status NOT IN ('uploading','failed') ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT id,sender_role,body,created_at FROM (SELECT id,sender_role,body,created_at FROM workspace_messages WHERE user_id=${id} ORDER BY created_at DESC LIMIT 100) recent ORDER BY created_at`,
      sql`SELECT id,user_id,requested_date::text,meeting_mode,note,status,starts_at,staff_note,created_at FROM appointments WHERE user_id=${id} ORDER BY created_at DESC LIMIT 50`,
      sql`SELECT id,application_id,stage,next_action,waiting_on,created_at FROM application_events WHERE user_id=${id} ORDER BY created_at DESC LIMIT 500`,
    ]);
    if (actor.staff && !people.length)
      return failure("Student not found.", 404);
    return NextResponse.json(
      {
        staff: actor.staff,
        user: people[0] || {
          user_id: actor.id,
          name: actor.name,
          email: actor.email,
          phone: "",
        },
        plan: plans[0] || null,
        applications,
        tasks,
        documents,
        messages,
        appointments,
        events,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return failure(
      "Your workspace is temporarily unavailable. Please retry.",
      503,
    );
  }
}
export async function POST(request: NextRequest) {
  if (!allowed(request)) return failure("Invalid request origin.", 403);
  try {
    const actor = await workspaceActor();
    if (!actor) return failure("Please sign in with a verified email.", 401);
    if (!request.headers.get("content-type")?.includes("application/json"))
      return failure("Send a JSON request.", 415);
    const raw = await request.text();
    if (raw.length > 12000) return failure("Request too large.", 413);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return failure("Invalid JSON.");
    }
    const result = actionSchema.safeParse(body);
    if (!result.success) return failure("Check the form fields and try again.");
    const a = result.data;
    const target = request.nextUrl.searchParams.get("student");
    if ((target || isStaffOnly(a.action)) && !actor.staff)
      return failure("Staff authorisation required.", 403);
    if (actor.staff && !target) return failure("Select a student first.");
    if (!(await limitMutation(actor.id)))
      return failure("Too many changes. Please wait ten minutes.", 429);
    const id = actor.staff && target ? target : actor.id;
    const sql = db();
    if (actor.staff) {
      const rows =
        await sql`SELECT user_id FROM student_profiles WHERE user_id=${id}`;
      if (!rows.length) return failure("Student not found.", 404);
    } else await profile(actor);
    let rows;
    switch (a.action) {
      case "profile":
        rows =
          await sql`UPDATE student_profiles SET name=${a.name},phone=${a.phone},updated_at=now() WHERE user_id=${id} RETURNING user_id AS id`;
        break;
      case "plan":
        rows =
          await sql`INSERT INTO study_plans(user_id,level,interest,destination,timing,tuition,living,other,shortlist) VALUES(${id},${a.level},${a.interest},${a.destination},${a.timing},${a.tuition},${a.living},${a.other},${JSON.stringify(a.shortlist)}::jsonb) ON CONFLICT(user_id) DO UPDATE SET level=excluded.level,interest=excluded.interest,destination=excluded.destination,timing=excluded.timing,tuition=excluded.tuition,living=excluded.living,other=excluded.other,shortlist=excluded.shortlist,updated_at=now() RETURNING user_id AS id`;
        break;
      case "message":
        rows =
          await sql`INSERT INTO workspace_messages(user_id,sender_id,sender_role,body) VALUES(${id},${actor.id},${actor.staff ? "staff" : "student"},${a.body}) RETURNING id`;
        break;
      case "appointment": {
        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kathmandu",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        if (
          a.date < today ||
          a.date >
            new Date(Date.now() + 366 * 86400000).toISOString().slice(0, 10)
        )
          return failure("Choose a date within the next year.");
        rows =
          await sql`INSERT INTO appointments(user_id,requested_date,meeting_mode,note) VALUES(${id},${a.date},${a.mode},${a.note}) RETURNING id`;
        break;
      }
      case "task-toggle":
        rows =
          await sql`UPDATE workspace_tasks SET completed=${a.completed} WHERE id=${a.id} AND user_id=${id} AND (${actor.staff} OR owner='Student') RETURNING id`;
        break;
      case "application":
        rows =
          await sql`WITH added AS (INSERT INTO applications(user_id,institution,course,destination,intake) VALUES(${id},${a.institution},${a.course},${a.destination},${a.intake}) RETURNING *), event AS (INSERT INTO application_events(application_id,user_id,stage,next_action,waiting_on) SELECT id,user_id,stage,next_action,waiting_on FROM added) SELECT id FROM added`;
        break;
      case "application-update":
        rows =
          await sql`WITH updated AS (UPDATE applications SET stage=${a.stage},next_action=${a.nextAction},waiting_on=${a.waitingOn},updated_at=now() WHERE id=${a.id} AND user_id=${id} RETURNING *), event AS (INSERT INTO application_events(application_id,user_id,stage,next_action,waiting_on) SELECT id,user_id,stage,next_action,waiting_on FROM updated) SELECT id FROM updated`;
        break;
      case "task":
        rows =
          await sql`INSERT INTO workspace_tasks(user_id,title,owner,due_date) VALUES(${id},${a.title},${a.owner},${a.dueDate || null}) RETURNING id`;
        break;
      case "document-review":
        rows =
          await sql`UPDATE student_documents SET status=${a.status},feedback=${a.feedback},reviewed_at=now() WHERE id=${a.id} AND user_id=${id} AND status IN ('Uploaded','Reviewed','Changes requested') RETURNING id`;
        break;
      case "appointment-update":
        if (a.status === "Confirmed" && !a.startsAt)
          return failure("Set a confirmed meeting time.");
        rows =
          await sql`UPDATE appointments SET status=${a.status},starts_at=${a.startsAt || null},staff_note=${a.note} WHERE id=${a.id} AND user_id=${id} RETURNING id`;
        break;
    }
    if (!rows?.length)
      return failure(
        "This record is unavailable or cannot be changed by your account.",
        404,
      );
    await sql`INSERT INTO workspace_audit(actor_id,student_id,action,target_id) VALUES(${actor.id},${id},${a.action},${String(rows[0].id)})`;
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return failure(
      "The change could not be confirmed. Refresh your workspace before retrying.",
      503,
    );
  }
}
