"use client";
import { useCallback, useEffect, useState } from "react";
import { createAuthClient } from "@neon/auth/next";
type Enquiry = {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  destination: string;
  meeting_mode: string;
  preferred_date: string | null;
  note: string;
  status: string;
  created_at: string;
};
export function StaffInbox({
  staffEmail,
  denied = false,
}: {
  staffEmail?: string;
  denied?: boolean;
}) {
  const [items, setItems] = useState<Enquiry[]>([]),
    [filter, setFilter] = useState("all"),
    [pending, setPending] = useState(true),
    [error, setError] = useState(""),
    [page, setPage] = useState(0),
    [hasMore, setHasMore] = useState(false),
    [updating, setUpdating] = useState("");
  const load = useCallback(async () => {
    if (denied) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(
        "/api/staff/enquiries?status=" + filter + "&page=" + page,
        { cache: "no-store" },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Enquiries could not be loaded.");
      setItems(result.items);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load enquiries.",
      );
    } finally {
      setPending(false);
    }
  }, [filter, page, denied]);
  useEffect(() => {
    void load();
  }, [load]);
  async function update(id: string, status: string) {
    setUpdating(id);
    setError("");
    try {
      const response = await fetch("/api/staff/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Status was not updated.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdating("");
    }
  }
  async function signOut() {
    await createAuthClient().signOut();
    window.location.assign("/staff/sign-in");
  }
  if (denied)
    return (
      <button className="button" style={{ marginTop: 25 }} onClick={signOut}>
        Sign out
      </button>
    );
  return (
    <>
      <div className="staff-top">
        <div>
          <h1>Enquiry desk.</h1>
          <p>{staffEmail}</p>
        </div>
        <button className="button button-outline" onClick={signOut}>
          Sign out
        </button>
      </div>
      <div className="filter-bar" style={{ marginTop: 35 }}>
        <div className="tabs" aria-label="Filter enquiry status">
          {["all", "new", "contacted", "scheduled", "closed"].map((s) => (
            <button
              key={s}
              aria-pressed={filter === s}
              onClick={() => {
                setFilter(s);
                setPage(0);
              }}
              style={{ textTransform: "capitalize" }}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          className="text-link"
          style={{ border: 0, background: "none" }}
          onClick={() => void load()}
        >
          Refresh inbox
        </button>
      </div>
      <p className="notice">
        Private customer information. Use it only to respond to the enquiry.
        Status changes are recorded in the staff audit log.
      </p>
      {error && (
        <p role="alert" className="form-status error">
          {error}
        </p>
      )}
      {pending ? (
        <p role="status">Loading enquiries…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h2>No enquiries here yet.</h2>
          <p>
            Saved requests will appear here. Try another status filter or
            refresh after a new request.
          </p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="staff-table">
            <thead>
              <tr>
                <th scope="col">Student & reference</th>
                <th scope="col">Contact</th>
                <th scope="col">Request</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <strong>{i.name}</strong>
                    <p>{i.reference}</p>
                    <p>
                      {new Date(i.created_at).toLocaleString("en-GB", {
                        timeZone: "Asia/Kathmandu",
                      })}{" "}
                      NPT
                    </p>
                  </td>
                  <td>
                    <a href={"tel:" + i.phone}>{i.phone}</a>
                    {i.email && (
                      <p>
                        <a href={"mailto:" + i.email}>{i.email}</a>
                      </p>
                    )}
                  </td>
                  <td>
                    <strong>{i.service}</strong>
                    <p>
                      {i.destination} · {i.meeting_mode}
                    </p>
                    {i.preferred_date && (
                      <p>Requested date: {i.preferred_date.slice(0, 10)}</p>
                    )}
                    {i.note && (
                      <p
                        style={{
                          whiteSpace: "pre-wrap",
                          maxWidth: 340,
                          marginTop: 10,
                        }}
                      >
                        {i.note}
                      </p>
                    )}
                  </td>
                  <td>
                    <label className="skip-link" htmlFor={"status-" + i.id}>
                      Status for {i.reference}
                    </label>
                    <select
                      id={"status-" + i.id}
                      aria-label={"Status for " + i.reference}
                      value={i.status}
                      disabled={updating === i.id}
                      onChange={(e) => void update(i.id, e.target.value)}
                    >
                      {["new", "contacted", "scheduled", "closed"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="hero-actions">
        <button
          className="button button-outline"
          disabled={page === 0 || pending}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous page
        </button>
        <span>Page {page + 1}</span>
        <button
          className="button button-outline"
          disabled={!hasMore || pending}
          onClick={() => setPage((p) => p + 1)}
        >
          Next page
        </button>
      </div>
    </>
  );
}

