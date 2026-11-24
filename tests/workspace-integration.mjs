// Run only against the isolated development branch, with the local server configured
// ADMIN_EMAIL=aecs-staff-test@example.invalid. Never runs as part of CI or production.
import fs from "node:fs";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
if (process.env.AECS_RUN_INTEGRATION !== "1")
  throw Error(
    "Set AECS_RUN_INTEGRATION=1 to run the development-only integration check.",
  );
const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((x) => x.includes("="))
    .map((x) => {
      const i = x.indexOf("=");
      return [x.slice(0, i), x.slice(i + 1)];
    }),
);
if (
  !env.DATABASE_URL.includes("ep-red-meadow-bioxlonz") ||
  env.ADMIN_EMAIL !== "aecs-staff-test@example.invalid"
)
  throw Error(
    "Refusing to run outside the isolated AECS development configuration.",
  );
const sql = neon(env.DATABASE_URL),
  base = "http://localhost:3000";
let checks = 0;
function check(actual, expected, label) {
  assert.equal(actual, expected, label);
  checks++;
  console.log("PASS " + label);
}
async function request(path, actor, body, method = "POST") {
  const headers = { Origin: base, ...(actor ? { Cookie: actor.cookie } : {}) };
  if (body && !(body instanceof FormData))
    headers["Content-Type"] = "application/json";
  const r = await fetch(base + path, {
    method: body ? method : "GET",
    headers,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  const result = r.headers.get("content-type")?.includes("application/json")
    ? await r.json()
    : await r.text();
  return { status: r.status, body: result, headers: r.headers };
}
async function account(name, email) {
  const password = randomBytes(24).toString("base64url");
  let r = await fetch(base + "/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({ name, email, password }),
  });
  let body = await r.json();
  if (!r.ok)
    throw Error(
      "Development auth fixture could not be created: " + JSON.stringify(body),
    );
  await sql`UPDATE neon_auth.user SET "emailVerified"=true WHERE id=${body.user.id} AND email=${email}`;
  r = await fetch(base + "/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({ email, password }),
  });
  body = await r.json();
  if (!r.ok) throw Error("Development sign-in failed");
  const cookie = r.headers
    .getSetCookie()
    .map((s) => s.split(";")[0])
    .join("; ");
  return { id: body.user.id, email, password, cookie };
}
const stamp = Date.now();
const a = await account(
  "Integration Student A",
  "aecs-a-" + stamp + "@example.invalid",
);
const b = await account(
  "Integration Student B",
  "aecs-b-" + stamp + "@example.invalid",
);
// A unique local staff address is configured before this script runs.
let staff;
if (fs.existsSync(".test-local/workspace-actors.json")) {
  staff = JSON.parse(
    fs.readFileSync(".test-local/workspace-actors.json", "utf8"),
  ).staff;
  const r = await fetch(base + "/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({ email: staff.email, password: staff.password }),
  });
  if (!r.ok) throw Error("Development staff fixture could not sign in");
  staff.cookie = r.headers
    .getSetCookie()
    .map((s) => s.split(";")[0])
    .join("; ");
} else staff = await account("Development AECS Staff", env.ADMIN_EMAIL);
fs.mkdirSync(".test-local", { recursive: true });
fs.writeFileSync(
  ".test-local/workspace-actors.json",
  JSON.stringify({ a, b, staff }),
);
check(
  (await request("/api/workspace")).status,
  401,
  "anonymous workspace denied",
);
check(
  (await request("/api/workspace", a)).status,
  200,
  "verified student session accepted",
);
check(
  (await request("/api/workspace?student=" + b.id, a)).status,
  403,
  "student cannot select another student",
);
check(
  (
    await request("/api/workspace", a, {
      action: "profile",
      name: "Integration Student A",
      phone: "Test only",
    })
  ).status,
  200,
  "profile saved",
);
check(
  (
    await request("/api/workspace", b, {
      action: "profile",
      name: "Integration Student B",
      phone: "",
    })
  ).status,
  200,
  "second independent profile saved",
);
check(
  (
    await request("/api/workspace", a, {
      action: "plan",
      level: "Postgraduate",
      interest: "Design",
      destination: "United Kingdom",
      timing: "September 2027",
      tuition: 100,
      living: 50,
      other: 10,
      shortlist: ["uk", "germany"],
    })
  ).status,
  200,
  "student plan persists",
);
check(
  (await request("/api/workspace", a)).body.plan.interest,
  "Design",
  "saved plan read from database",
);
check(
  (await request("/api/workspace", b)).body.plan,
  null,
  "second student cannot read first plan",
);
check(
  (
    await request("/api/workspace", a, {
      action: "application",
      institution: "Test institution",
      course: "Test course",
      destination: "UK",
      intake: "2027",
    })
  ).status,
  403,
  "student cannot create official application",
);
const target = "/api/workspace?student=" + a.id;
check(
  (
    await request(target, staff, {
      action: "application",
      institution: "Integration University",
      course: "Design",
      destination: "UK",
      intake: "September 2027",
    })
  ).status,
  200,
  "staff creates agreed application",
);
let workspace = (await request("/api/workspace", a)).body;
const app = workspace.applications[0];
check(
  (
    await request("/api/workspace", a, {
      action: "application-update",
      id: app.id,
      stage: "Offer received",
      nextAction: "Fake",
      waitingOn: "Institution",
    })
  ).status,
  403,
  "student cannot advance stage",
);
check(
  (
    await request(target, staff, {
      action: "application-update",
      id: app.id,
      stage: "Preparing documents",
      nextAction: "Upload transcript",
      waitingOn: "Student",
    })
  ).status,
  200,
  "staff updates real stage",
);
check(
  (
    await request(target, staff, {
      action: "task",
      title: "Upload transcript",
      owner: "Student",
      dueDate: "2027-01-01",
    })
  ).status,
  200,
  "staff creates document checklist",
);
check(
  (
    await request(target, staff, {
      action: "task",
      title: "Check course availability",
      owner: "AECS",
      dueDate: "",
    })
  ).status,
  200,
  "staff creates AECS task",
);
workspace = (await request("/api/workspace", a)).body;
check(
  workspace.events.filter((e) => e.application_id === app.id).length,
  2,
  "application history records real staff updates",
);
check(
  workspace.tasks.find((t) => t.owner === "Student").due_date,
  "2027-01-01",
  "calendar deadline retains original day",
);
check(
  (
    await request("/api/workspace", a, {
      action: "task-toggle",
      id: workspace.tasks.find((t) => t.owner === "Student").id,
      completed: true,
    })
  ).status,
  200,
  "student completes own task",
);
check(
  (
    await request("/api/workspace", a, {
      action: "task-toggle",
      id: workspace.tasks.find((t) => t.owner === "AECS").id,
      completed: true,
    })
  ).status,
  404,
  "student cannot complete staff task",
);
check(
  (
    await request("/api/workspace", b, {
      action: "task-toggle",
      id: workspace.tasks[0].id,
      completed: true,
    })
  ).status,
  404,
  "other student cannot change checklist",
);
check(
  (
    await request("/api/workspace", a, {
      action: "message",
      body: "Development test: please review my plan.",
    })
  ).status,
  200,
  "student message saved",
);
check(
  (
    await request(target, staff, {
      action: "message",
      body: "Development test reply: please upload your transcript.",
    })
  ).status,
  200,
  "staff reply saved",
);
check(
  (await request("/api/workspace", a)).body.messages.length,
  2,
  "student reads actual conversation",
);
check(
  (await request("/api/workspace", b)).body.messages.length,
  0,
  "conversation isolated from other student",
);
const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
check(
  (
    await request("/api/workspace", a, {
      action: "appointment",
      date,
      mode: "Online",
      note: "Development meeting request",
    })
  ).status,
  200,
  "appointment request saved",
);
const meeting = (await request("/api/workspace", a)).body.appointments[0];
check(
  (
    await request(target, staff, {
      action: "appointment-update",
      id: meeting.id,
      status: "Confirmed",
      startsAt: date + "T05:15:00Z",
      note: "10:00 Nepal time. Development fixture only.",
    })
  ).status,
  200,
  "staff confirms actual time",
);
const form = new FormData();
form.set(
  "file",
  new File(
    ["%PDF-1.4\nDevelopment fixture, no personal data.\n%%EOF"],
    "development-transcript.pdf",
    { type: "application/pdf" },
  ),
);
const upload = await request("/api/workspace/documents", a, form);
check(upload.status, 201, "document stored in private bucket");
const doc = (await request("/api/workspace", a)).body.documents[0];
check(
  (await request("/api/workspace/documents/" + doc.id)).status,
  401,
  "anonymous download denied",
);
check(
  (await request("/api/workspace/documents/" + doc.id, b)).status,
  404,
  "other student download denied",
);
const download = await request("/api/workspace/documents/" + doc.id, a);
check(download.status, 200, "owner can download document");
check(
  download.body.startsWith("%PDF-1.4"),
  true,
  "download matches uploaded bytes",
);
check(
  (await request("/api/workspace/documents/" + doc.id, staff)).status,
  200,
  "authorised staff can download",
);
check(
  (
    await request(target, staff, {
      action: "document-review",
      id: doc.id,
      status: "Changes requested",
      feedback: "Development test: send a clearer scan.",
    })
  ).status,
  200,
  "staff review feedback saved",
);
check(
  (await request("/api/workspace", a)).body.documents[0].feedback,
  "Development test: send a clearer scan.",
  "student sees review feedback",
);
const invalid = new FormData();
invalid.set(
  "file",
  new File(["<script>alert(1)</script>"], "pretend.pdf", {
    type: "application/pdf",
  }),
);
check(
  (await request("/api/workspace/documents", a, invalid)).status,
  400,
  "spoofed PDF rejected",
);
const cross = await fetch(base + "/api/workspace", {
  method: "POST",
  headers: {
    Origin: "https://untrusted.invalid",
    Cookie: a.cookie,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ action: "message", body: "blocked" }),
});
check(cross.status, 403, "cross-origin write rejected");
const audit =
  await sql`SELECT count(*)::int AS n FROM workspace_audit WHERE student_id=${a.id}`;
check(audit[0].n >= 12, true, "workspace actions recorded in audit trail");
const bare = await fetch(
  env.AWS_ENDPOINT_URL_S3 + "/student-documents/" + a.id + "/" + doc.id,
);
check(
  [401, 403].includes(bare.status),
  true,
  "bucket denies unsigned public read",
);
console.log(
  JSON.stringify(
    {
      passed: checks,
      environment: "isolated development branch",
      realCustomerData: false,
    },
    null,
    2,
  ),
);
