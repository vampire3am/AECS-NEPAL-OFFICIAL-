"use client";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createAuthClient } from "@neon/auth/next";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  RefreshCw,
  LogOut,
  CheckCircle2,
  FileText,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import { destinations } from "@/lib/content";
import { stages, owners } from "@/lib/workspace-options";
type Plan = {
  level: string;
  interest: string;
  destination: string;
  timing: string;
  tuition: number | string;
  living: number | string;
  other: number | string;
  shortlist: string[];
};
type Application = {
  id: string;
  institution: string;
  course: string;
  destination: string;
  intake: string;
  stage: string;
  next_action: string;
  waiting_on: string;
  updated_at: string;
};
type Task = {
  id: string;
  title: string;
  owner: string;
  due_date: string | null;
  completed: boolean;
};
type Document = {
  id: string;
  name: string;
  size_bytes: number;
  status: string;
  feedback: string;
  created_at: string;
};
type Message = {
  id: string;
  sender_role: string;
  body: string;
  created_at: string;
};
type Appointment = {
  id: string;
  requested_date: string;
  meeting_mode: string;
  note: string;
  status: string;
  starts_at: string | null;
  staff_note: string;
};
type Student = {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  applications?: number;
};
type Data = {
  staff: boolean;
  students?: Student[];
  user?: Student;
  plan: Plan | null;
  applications: Application[];
  tasks: Task[];
  documents: Document[];
  messages: Message[];
  appointments: Appointment[];
  events: {
    id: string;
    application_id: string;
    stage: string;
    next_action: string;
    waiting_on: string;
    created_at: string;
  }[];
};
const auth = createAuthClient();
const emptyPlan: Plan = {
  level: "",
  interest: "",
  destination: "",
  timing: "",
  tuition: 0,
  living: 0,
  other: 0,
  shortlist: [],
};
function date(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    timeZone: "Asia/Kathmandu",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
function day(value: string) {
  return value.slice(0, 10);
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return <p className="workspace-empty">{children}</p>;
}
export function Workspace({ staff = false }: { staff?: boolean }) {
  const [data, setData] = useState<Data | null>(null),
    [selected, setSelected] = useState(""),
    [tab, setTab] = useState("Overview"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState("");
  const endpoint =
    "/api/workspace" +
    (staff && selected ? "?student=" + encodeURIComponent(selected) : "");
  const activeEndpoint = useRef<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    if (activeEndpoint.current !== endpoint) return;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(endpoint, {
        cache: "no-store",
        signal: controller.signal,
      });
      const body = await r.json();
      if (controller.signal.aborted) return;
      if (!r.ok) throw new Error(body.error);
      setData(body);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(
        e instanceof Error ? e.message : "Workspace unavailable. Please retry.",
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [endpoint]);
  useEffect(() => {
    activeEndpoint.current = endpoint;
    setData(null);
    void refresh();
    return () => {
      activeEndpoint.current = null;
      activeRequest.current?.abort();
    };
  }, [endpoint, refresh]);
  async function mutate(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      setNotice("Saved to your AECS workspace.");
      await refresh();
      return true;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save. Please retry.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function submit(
    e: FormEvent<HTMLFormElement>,
    action: string,
    extra: Record<string, unknown> = {},
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const ok = await mutate({ ...values, ...extra, action });
    if (
      ok &&
      ["message", "task", "application", "appointment"].includes(action)
    )
      form.reset();
  }
  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/workspace/documents", {
        method: "POST",
        body: new FormData(form),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error);
      setNotice("Document uploaded privately. Awaiting AECS review.");
      form.reset();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    setBusy(true);
    try {
      const r = await auth.signOut();
      if (r.error) throw new Error(r.error.message);
      window.location.assign("/");
    } catch {
      setError("Sign-out failed. Please retry.");
      setBusy(false);
    }
  }
  const tasks = data?.tasks || [],
    apps = data?.applications || [],
    docs = data?.documents || [],
    meetings = data?.appointments || [];
  return (
    <div className="workspace">
      <div className="workspace-title">
        <div>
          <h1>{staff ? "Student desk" : "My AECS"}</h1>
          <p>
            {staff
              ? "Keep every student’s next step clear."
              : "Your plans, your documents, your next step."}
          </p>
        </div>
        <div className="workspace-tools">
          <button
            className="button button-outline button-small"
            onClick={() => void refresh()}
            disabled={loading || busy}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            className="icon-button"
            aria-label="Sign out"
            onClick={() => void signOut()}
            disabled={busy}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      {staff && (
        <nav className="desk-nav" aria-label="Staff desk">
          <Link href="/staff">Enquiries</Link>
          <Link href="/staff/students" aria-current="page">
            Student workspaces
          </Link>
        </nav>
      )}
      {error && (
        <p className="form-status error" role="alert">
          {error}{" "}
          <button className="text-link" onClick={() => void refresh()}>
            Retry
          </button>
        </p>
      )}
      {notice && (
        <p className="form-status success" role="status">
          {notice}
        </p>
      )}
      {loading && !data && (
        <p role="status" className="workspace-empty">
          Opening your workspace…
        </p>
      )}
      {staff && !selected && data?.students && (
        <>
          <div className="student-list-heading">
            <h2>Students</h2>
            <Field label="Find a student">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name or email"
              />
            </Field>
          </div>
          <div className="student-list">
            {data.students
              .filter((s) =>
                (s.name + " " + s.email)
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((s) => (
                <button
                  key={s.user_id}
                  onClick={() => {
                    setSelected(s.user_id);
                    setTab("Overview");
                  }}
                >
                  <span>
                    <strong>{s.name || "New student"}</strong>
                    <small>{s.email}</small>
                  </span>
                  <span>
                    {s.applications || 0} applications <ArrowRight size={18} />
                  </span>
                </button>
              ))}
            {!data.students.length && (
              <Empty>
                Students will appear when they save their profile or plan,
                request an appointment, or send a message. No demonstration
                records are shown here.
              </Empty>
            )}
          </div>
          <p className="section-note">
            Showing the 100 most recently registered students. Messages and
            records are visible within each workspace.
          </p>
        </>
      )}
      {data?.user && (
        <>
          {staff && (
            <button
              className="text-link back-link"
              onClick={() => {
                setSelected("");
                setNotice("");
              }}
            >
              <ArrowLeft size={17} />
              All students
            </button>
          )}
          <div className="workspace-person">
            <strong>{data.user.name || "Welcome to AECS"}</strong>
            <span>{data.user.email}</span>
            {staff && data.user.phone && <span>{data.user.phone}</span>}
          </div>
          <nav className="workspace-tabs" aria-label="Workspace sections">
            {[
              "Overview",
              "Study plan",
              "Applications",
              "Documents",
              "Appointments",
              "Messages",
              "Profile",
            ].map((t) => (
              <button
                key={t}
                aria-current={t === tab ? "page" : undefined}
                onClick={() => {
                  setTab(t);
                  setNotice("");
                }}
              >
                {t}
              </button>
            ))}
          </nav>
          <div className="workspace-content" aria-busy={busy}>
            {tab === "Overview" && (
              <>
                <section className="workspace-welcome">
                  <div>
                    <h2>
                      {tasks.some((t) => !t.completed && t.owner === "Student")
                        ? "A few things to move forward."
                        : apps.length
                          ? "Your next steps, together."
                          : "Let’s start with your study plan."}
                    </h2>
                    <p>
                      {apps.length
                        ? "Updates here are entered by AECS. A stage records the team’s progress; official decisions come from the institution or relevant authority."
                        : "Tell us what you want to study and what matters to you. AECS can then work with you on a shortlist and the documents you need."}
                    </p>
                    <button
                      className="text-link"
                      onClick={() =>
                        setTab(apps.length ? "Applications" : "Study plan")
                      }
                    >
                      {apps.length ? "View applications" : "Open my study plan"}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="workspace-summary">
                    <span>
                      <FileText size={19} />
                      {apps.length}{" "}
                      {apps.length === 1 ? "application" : "applications"}
                    </span>
                    <span>
                      <CheckCircle2 size={19} />
                      {tasks.filter((t) => !t.completed).length} open tasks
                    </span>
                    <span>
                      <CalendarDays size={19} />
                      {
                        meetings.filter((m) =>
                          ["Requested", "Confirmed"].includes(m.status),
                        ).length
                      }{" "}
                      upcoming / requested
                    </span>
                  </div>
                </section>
                <section className="workspace-section">
                  <h2>Next actions</h2>
                  {tasks.length ? (
                    <ul className="task-list">
                      {tasks.map((t) => (
                        <li key={t.id}>
                          <label>
                            <input
                              type="checkbox"
                              checked={t.completed}
                              disabled={
                                busy || (!staff && t.owner !== "Student")
                              }
                              onChange={(e) =>
                                void mutate({
                                  action: "task-toggle",
                                  id: t.id,
                                  completed: e.target.checked,
                                })
                              }
                            />
                            <span className={t.completed ? "task-done" : ""}>
                              {t.title}
                              <small>
                                {t.owner}
                                {t.due_date
                                  ? " · Due " + day(t.due_date)
                                  : " · No deadline set"}
                              </small>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>
                      No tasks have been assigned yet. Send AECS a message to
                      agree your next steps.
                    </Empty>
                  )}
                  {staff && (
                    <details className="workspace-editor">
                      <summary>Add a task or document checklist item</summary>
                      <form
                        onSubmit={(e) => void submit(e, "task")}
                        className="workspace-form"
                      >
                        <Field label="Task">
                          <input name="title" required maxLength={300} />
                        </Field>
                        <div className="form-row">
                          <Field label="Waiting on">
                            <select name="owner">
                              {owners.map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Due date (optional)">
                            <input name="dueDate" type="date" />
                          </Field>
                        </div>
                        <button className="button button-small" disabled={busy}>
                          Add task
                        </button>
                      </form>
                    </details>
                  )}
                </section>
                <div className="workspace-shortcuts">
                  <button onClick={() => setTab("Documents")}>
                    <FileText />
                    <span>
                      Private documents
                      <small>Upload and check review feedback</small>
                    </span>
                    <ArrowRight />
                  </button>
                  <button onClick={() => setTab("Messages")}>
                    <MessageSquare />
                    <span>
                      Talk to AECS
                      <small>Keep your questions in one place</small>
                    </span>
                    <ArrowRight />
                  </button>
                </div>
              </>
            )}
            {tab === "Study plan" && (
              <PlanEditor
                key={selected + String(data.plan?.destination)}
                plan={data.plan}
                busy={busy}
                save={mutate}
              />
            )}
            {tab === "Applications" && (
              <section className="workspace-section">
                <h2>Your applications</h2>
                <p className="section-note">
                  AECS adds an application after agreeing the institution,
                  course and intake with you.
                </p>
                {!apps.length && (
                  <Empty>
                    No applications have been added yet. Save your study plan
                    and message AECS to start your shortlist.
                  </Empty>
                )}
                {apps.map((a) => (
                  <article className="application-record" key={a.id}>
                    <div className="record-heading">
                      <div>
                        <h3>{a.institution}</h3>
                        <p>{a.course}</p>
                      </div>
                      <span className="status-label">{a.stage}</span>
                    </div>
                    <p>
                      {a.destination} · {a.intake}
                    </p>
                    <div className="application-next">
                      <strong>Next action · Waiting on {a.waiting_on}</strong>
                      <p>
                        {a.next_action ||
                          "AECS has not set the next action yet."}
                      </p>
                    </div>
                    <small>Updated {date(a.updated_at)} NPT</small>
                    {data.events?.some((e) => e.application_id === a.id) && (
                      <details className="application-history">
                        <summary>Application history</summary>
                        <ol>
                          {data.events
                            .filter((e) => e.application_id === a.id)
                            .map((e) => (
                              <li key={e.id}>
                                <strong>{e.stage}</strong>
                                <small>
                                  {date(e.created_at)} NPT · Waiting on{" "}
                                  {e.waiting_on}
                                </small>
                                {e.next_action && <p>{e.next_action}</p>}
                              </li>
                            ))}
                        </ol>
                      </details>
                    )}
                    {staff && (
                      <details className="workspace-editor">
                        <summary>Update application</summary>
                        <form
                          className="workspace-form"
                          onSubmit={(e) =>
                            void submit(e, "application-update", { id: a.id })
                          }
                        >
                          <div className="form-row">
                            <Field label="Stage">
                              <select name="stage" defaultValue={a.stage}>
                                {stages.map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Waiting on">
                              <select
                                name="waitingOn"
                                defaultValue={a.waiting_on}
                              >
                                {owners.map((o) => (
                                  <option key={o}>{o}</option>
                                ))}
                              </select>
                            </Field>
                          </div>
                          <Field label="Next action">
                            <textarea
                              name="nextAction"
                              defaultValue={a.next_action}
                              maxLength={1000}
                            />
                          </Field>
                          <button
                            className="button button-small"
                            disabled={busy}
                          >
                            Save update
                          </button>
                        </form>
                      </details>
                    )}
                  </article>
                ))}
                {staff && (
                  <details className="workspace-editor">
                    <summary>Add an agreed application</summary>
                    <form
                      className="workspace-form"
                      onSubmit={(e) => void submit(e, "application")}
                    >
                      {[
                        ["institution", "Institution"],
                        ["course", "Course"],
                        ["destination", "Destination"],
                        ["intake", "Intake"],
                      ].map(([name, label]) => (
                        <Field key={name} label={label}>
                          <input
                            name={name}
                            required
                            maxLength={
                              name === "institution" || name === "course"
                                ? 200
                                : 100
                            }
                          />
                        </Field>
                      ))}
                      <button className="button button-small" disabled={busy}>
                        Add application
                      </button>
                    </form>
                  </details>
                )}
              </section>
            )}
            {tab === "Documents" && (
              <section className="workspace-section">
                <h2>Your documents, kept private.</h2>
                <p className="section-note">
                  Only your account and authorised AECS staff can download these
                  files. Upload documents requested by AECS. Do not upload
                  passwords, payment card details or unrelated records.
                </p>
                {!staff && (
                  <form
                    className="document-upload"
                    onSubmit={(e) => void upload(e)}
                  >
                    <Field label="Choose a document">
                      <input
                        name="file"
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        required
                      />
                    </Field>
                    <p>
                      PDF, JPG or PNG · Up to 3 MB each · 30 documents per
                      workspace
                    </p>
                    <button className="button button-small" disabled={busy}>
                      Upload privately
                    </button>
                  </form>
                )}
                {!docs.length && (
                  <Empty>
                    No documents uploaded yet. Your checklist appears under
                    Overview when AECS adds it.
                  </Empty>
                )}
                {docs.map((d) => (
                  <article className="document-record" key={d.id}>
                    <div className="record-heading">
                      <div>
                        <h3>{d.name}</h3>
                        <small>
                          {Math.ceil(d.size_bytes / 1024)} KB ·{" "}
                          {date(d.created_at)} NPT
                        </small>
                      </div>
                      <a
                        className="text-link"
                        href={"/api/workspace/documents/" + d.id}
                      >
                        <Download size={17} />
                        Download
                      </a>
                    </div>
                    <p>
                      <span className="status-label">{d.status}</span>
                    </p>
                    {d.feedback && (
                      <p className="staff-feedback">
                        AECS feedback: {d.feedback}
                      </p>
                    )}
                    {staff && (
                      <form
                        className="workspace-form"
                        onSubmit={(e) =>
                          void submit(e, "document-review", { id: d.id })
                        }
                      >
                        <Field label="Review status">
                          <select
                            name="status"
                            defaultValue={
                              d.status === "Changes requested"
                                ? "Changes requested"
                                : "Reviewed"
                            }
                          >
                            <option>Reviewed</option>
                            <option>Changes requested</option>
                          </select>
                        </Field>
                        <Field label="Feedback for student">
                          <textarea
                            name="feedback"
                            defaultValue={d.feedback}
                            maxLength={1000}
                          />
                        </Field>
                        <button
                          className="button button-outline button-small"
                          disabled={busy}
                        >
                          Save review
                        </button>
                      </form>
                    )}
                  </article>
                ))}
                <p className="section-note">
                  “Reviewed” means an AECS staff review. It does not certify
                  authenticity or institution acceptance. Files are not
                  automatically virus-scanned.
                </p>
              </section>
            )}
            {tab === "Appointments" && (
              <section className="workspace-section">
                <h2>Make time for your next step.</h2>
                <p className="section-note">
                  Requests need AECS confirmation. Confirmed times are shown in
                  Nepal time (NPT).
                </p>
                {!staff && (
                  <form
                    className="workspace-form"
                    onSubmit={(e) => void submit(e, "appointment")}
                  >
                    <div className="form-row">
                      <Field label="Preferred date">
                        <input
                          name="date"
                          type="date"
                          required
                          min={new Date().toLocaleDateString("en-CA", {
                            timeZone: "Asia/Kathmandu",
                          })}
                        />
                      </Field>
                      <Field label="How would you like to meet?">
                        <select name="mode">
                          <option>In person</option>
                          <option>Online</option>
                          <option>Phone</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="What would you like to discuss? (optional)">
                      <textarea name="note" maxLength={500} />
                    </Field>
                    <button className="button button-small" disabled={busy}>
                      Request appointment
                    </button>
                  </form>
                )}
                {!meetings.length && (
                  <Empty>No appointment requests yet.</Empty>
                )}
                {meetings.map((m) => (
                  <article className="appointment-record" key={m.id}>
                    <div className="record-heading">
                      <h3>
                        {day(m.requested_date)} · {m.meeting_mode}
                      </h3>
                      <span className="status-label">{m.status}</span>
                    </div>
                    {m.note && <p>{m.note}</p>}
                    {m.starts_at && (
                      <p>
                        <strong>{date(m.starts_at)} NPT</strong>
                      </p>
                    )}
                    {m.staff_note && <p>AECS: {m.staff_note}</p>}
                    {staff && (
                      <form
                        className="workspace-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const f = new FormData(e.currentTarget);
                          void mutate({
                            action: "appointment-update",
                            id: m.id,
                            status: f.get("status"),
                            startsAt: f.get("startsAt")
                              ? new Date(
                                  String(f.get("startsAt")) + "+05:45",
                                ).toISOString()
                              : "",
                            note: f.get("note"),
                          });
                        }}
                      >
                        <div className="form-row">
                          <Field label="Status">
                            <select
                              name="status"
                              defaultValue={
                                m.status === "Requested"
                                  ? "Confirmed"
                                  : m.status
                              }
                            >
                              {[
                                "Confirmed",
                                "Reschedule requested",
                                "Cancelled",
                                "Completed",
                              ].map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Meeting time (Nepal)">
                            <input
                              name="startsAt"
                              type="datetime-local"
                              defaultValue={
                                m.starts_at
                                  ? new Date(
                                      new Date(m.starts_at).getTime() +
                                        20700000,
                                    )
                                      .toISOString()
                                      .slice(0, 16)
                                  : ""
                              }
                            />
                          </Field>
                        </div>
                        <Field label="Confirmation or rescheduling details">
                          <textarea
                            name="note"
                            maxLength={1000}
                            defaultValue={m.staff_note}
                          />
                        </Field>
                        <button className="button button-small" disabled={busy}>
                          Save appointment update
                        </button>
                      </form>
                    )}
                  </article>
                ))}
              </section>
            )}
            {tab === "Messages" && (
              <section className="workspace-section">
                <h2>A conversation with AECS.</h2>
                <p className="section-note">
                  Messages are saved here. Use Refresh to check for replies. For
                  urgent help, call{" "}
                  <a href="tel:+9779704518337" className="text-link">
                    +977 970-451-8337
                  </a>
                  .
                </p>
                <div className="message-thread">
                  {!data.messages.length && (
                    <Empty>
                      No messages yet. Start with your study goals or a question
                      for the team.
                    </Empty>
                  )}
                  {data.messages.map((m) => (
                    <article
                      key={m.id}
                      className={
                        "workspace-message " +
                        (m.sender_role === "staff"
                          ? "from-staff"
                          : "from-student")
                      }
                    >
                      <strong>
                        {m.sender_role === "staff" ? "AECS team" : "Student"}
                      </strong>
                      <p>{m.body}</p>
                      <small>{date(m.created_at)} NPT</small>
                    </article>
                  ))}
                </div>
                <form
                  className="workspace-form"
                  onSubmit={(e) => void submit(e, "message")}
                >
                  <Field
                    label={staff ? "Reply to student" : "Your message to AECS"}
                  >
                    <textarea name="body" required maxLength={2000} rows={4} />
                  </Field>
                  <button className="button button-small" disabled={busy}>
                    Send message
                  </button>
                </form>
                <p className="section-note">
                  Showing the latest 100 messages. Messages appear in the
                  workspace; email notifications are not enabled.
                </p>
              </section>
            )}
            {tab === "Profile" && (
              <section className="workspace-section">
                <h2>Your details</h2>
                <form
                  className="workspace-form"
                  onSubmit={(e) => void submit(e, "profile")}
                >
                  <Field label="Full name">
                    <input
                      name="name"
                      required
                      maxLength={100}
                      defaultValue={data.user.name}
                    />
                  </Field>
                  <Field label="Phone (optional)">
                    <input
                      name="phone"
                      type="tel"
                      maxLength={40}
                      defaultValue={data.user.phone || ""}
                    />
                  </Field>
                  <Field label="Verified email">
                    <input type="email" value={data.user.email} readOnly />
                  </Field>
                  <button className="button button-small" disabled={busy}>
                    Save details
                  </button>
                </form>
                <p className="section-note">
                  For account corrections or a data deletion request, contact{" "}
                  <a href="mailto:info@aecsnepal.com" className="text-link">
                    info@aecsnepal.com
                  </a>
                  .
                </p>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
function PlanEditor({
  plan,
  busy,
  save,
}: {
  plan: Plan | null;
  busy: boolean;
  save: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<Plan>(plan || emptyPlan),
    [note, setNote] = useState("");
  function update(key: keyof Plan, value: string) {
    setDraft({ ...draft, [key]: value });
  }
  function importDraft() {
    try {
      const raw = JSON.parse(localStorage.getItem("aecs-plan-v1") || "null");
      const shortlist = JSON.parse(
        localStorage.getItem("aecs-shortlist") || "[]",
      );
      if (!raw && !shortlist.length) {
        setNote(
          "No plan is saved on this device yet. You can complete it here.",
        );
        return;
      }
      const safe = { ...emptyPlan };
      if (raw && typeof raw === "object") {
        for (const key of [
          "level",
          "interest",
          "destination",
          "timing",
        ] as const)
          if (typeof raw[key] === "string") safe[key] = raw[key].slice(0, 100);
        for (const key of ["tuition", "living", "other"] as const) {
          const value = Number(raw[key]);
          safe[key] =
            Number.isFinite(value) && value >= 0 ? Math.min(value, 1e9) : 0;
        }
      }
      setDraft({
        ...safe,
        shortlist: Array.isArray(shortlist)
          ? shortlist
              .filter(
                (s: unknown) =>
                  typeof s === "string" &&
                  destinations.some((d) => d.slug === s),
              )
              .slice(0, 3)
          : [],
      });
      setNote(
        "Browser draft copied here. Save it below to keep it in your account.",
      );
    } catch {
      setNote("The browser draft could not be read. Complete your plan below.");
    }
  }
  return (
    <section className="workspace-section">
      <div className="record-heading">
        <h2>A plan that fits you.</h2>
        <button className="text-link" type="button" onClick={importDraft}>
          Import this device’s draft
        </button>
      </div>
      <p className="section-note">
        Save your starting point for your counselling session. Budget figures
        are your own estimates in NPR, for the period you are planning.
      </p>
      {note && <p role="status">{note}</p>}
      <form
        className="workspace-form"
        onSubmit={(e) => {
          e.preventDefault();
          void save({
            action: "plan",
            ...draft,
            tuition: Number(draft.tuition) || 0,
            living: Number(draft.living) || 0,
            other: Number(draft.other) || 0,
          });
        }}
      >
        <div className="form-row">
          <Field label="Study level">
            <select
              value={draft.level}
              onChange={(e) => update("level", e.target.value)}
            >
              <option value="">Choose level</option>
              {[
                ...new Set([
                  draft.level,
                  "Undergraduate",
                  "Postgraduate",
                  "Diploma / vocational",
                  "Language programme",
                  "Not sure yet",
                ]),
              ]
                .filter(Boolean)
                .map((v) => (
                  <option key={v}>{v}</option>
                ))}
            </select>
          </Field>
          <Field label="Subject or interest">
            <input
              maxLength={200}
              value={draft.interest}
              onChange={(e) => update("interest", e.target.value)}
            />
          </Field>
        </div>
        <div className="form-row">
          <Field label="Preferred destination">
            <select
              value={draft.destination}
              onChange={(e) => update("destination", e.target.value)}
            >
              <option value="">Not sure yet</option>
              {destinations.map((d) => (
                <option key={d.slug}>{d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="When would you like to start?">
            <input
              maxLength={100}
              value={draft.timing}
              onChange={(e) => update("timing", e.target.value)}
              placeholder="For example: September 2027"
            />
          </Field>
        </div>
        <fieldset className="shortlist-fields">
          <legend>Your country shortlist (up to 3)</legend>
          {destinations.map((d) => (
            <label key={d.slug}>
              <input
                type="checkbox"
                checked={draft.shortlist.includes(d.slug)}
                disabled={
                  !draft.shortlist.includes(d.slug) &&
                  draft.shortlist.length >= 3
                }
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    shortlist: e.target.checked
                      ? [...draft.shortlist, d.slug]
                      : draft.shortlist.filter((s) => s !== d.slug),
                  })
                }
              />
              {d.name}
            </label>
          ))}
        </fieldset>
        <div className="form-row plan-costs">
          {[
            ["tuition", "Tuition (NPR)"],
            ["living", "Living costs (NPR)"],
            ["other", "Travel and other costs (NPR)"],
          ].map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type="number"
                min={0}
                max={1e9}
                step="any"
                value={String(draft[key as "tuition" | "living" | "other"])}
                onChange={(e) => update(key as keyof Plan, e.target.value)}
              />
            </Field>
          ))}
        </div>
        <p className="budget-total">
          Your estimate:{" "}
          <strong>
            NPR{" "}
            {(
              Number(draft.tuition) +
              Number(draft.living) +
              Number(draft.other)
            ).toLocaleString("en-NP")}
          </strong>
        </p>
        <button className="button" disabled={busy}>
          Save study plan
        </button>
      </form>
      <p className="section-note">
        Explore{" "}
        <Link href="/destinations" className="text-link">
          destination comparisons
        </Link>{" "}
        or use the{" "}
        <Link href="/plan" className="text-link">
          public planning worksheet
        </Link>{" "}
        before deciding.
      </p>
    </section>
  );
}
