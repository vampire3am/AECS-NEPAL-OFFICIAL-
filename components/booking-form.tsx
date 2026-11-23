"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { destinations, business } from "@/lib/content";
const services = [
  "Study abroad counselling",
  "English preparation",
  "Exam booking",
  "Mock test",
  "Family consultation",
];
export function BookingForm({
  service,
  destination,
  note,
}: {
  service?: string;
  destination?: string;
  note?: string;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  const id = useRef<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError("");
    const f = new FormData(e.currentTarget);
    const payload = Object.fromEntries(f);
    if (!id.current) id.current = crypto.randomUUID();
    setPending(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          consent: f.get("consent") === "on",
          requestId: id.current,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Your request was not saved. Please try again.",
        );
      setReference(result.reference);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Your request was not saved. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  if (reference)
    return (
      <div className="success-panel" role="status">
        <CircleCheck size={38} />
        <h2>You’re on our list.</h2>
        <p>
          Your request is safely saved for the AECS team. We’ll contact you to
          discuss your questions and confirm a meeting time.
        </p>
        <p className="reference">{reference}</p>
        <p>
          Please keep this reference. Your requested appointment or exam slot is
          not confirmed yet.
        </p>
        <a
          className="button"
          href={
            business.whatsapp +
            "?text=" +
            encodeURIComponent(
              "Hi AECS, I have saved request " +
                reference +
                ". I would like to discuss it.",
            )
          }
          target="_blank"
          rel="noreferrer"
        >
          Continue in WhatsApp
        </a>
        <p className="section-note">
          WhatsApp is optional. Your saved request remains with AECS even if you
          close this page.
        </p>
        <Link href="/guides" className="text-link">
          Read a preparation guide
        </Link>
      </div>
    );
  return (
    <form className="booking-form" onSubmit={submit}>
      <div className="form-grid">
        <div className="field full-width">
          <label htmlFor="service">What can we help with?</label>
          <select
            id="service"
            name="service"
            defaultValue={
              services.includes(service || "") ? service : services[0]
            }
          >
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Mobile number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={22}
            placeholder="e.g. +977 98XXXXXXXX"
          />
        </div>
        <div className="field full-width">
          <label htmlFor="email">
            Email <span className="optional">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
          />
        </div>
        <div className="field">
          <label htmlFor="destination">Destination in mind</label>
          <select
            id="destination"
            name="destination"
            defaultValue={
              destinations.some((d) => d.name === destination)
                ? destination
                : "Not sure yet"
            }
          >
            <option>Not sure yet</option>
            {destinations.map((d) => (
              <option key={d.slug}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mode">How would you like to meet?</label>
          <select id="mode" name="mode">
            <option>At the Bagbazar office</option>
            <option>Phone call</option>
            <option>Online meeting</option>
          </select>
        </div>
        <div className="field full-width">
          <label htmlFor="date">
            Preferred date <span className="optional">(optional)</span>
          </label>
          <input id="date" name="preferredDate" type="date" />
          <small>The team will confirm the date and time with you.</small>
        </div>
        <div className="field full-width">
          <label htmlFor="note">
            Your questions <span className="optional">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            maxLength={1500}
            defaultValue={note?.slice(0, 1500)}
            placeholder="Tell us what you’d like to work through."
          />
          <small>
            Please don’t include passport numbers, financial documents or
            passwords.
          </small>
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that AECS may save these details and contact me about this
          request, as explained in the{" "}
          <Link href="/privacy">privacy notice</Link>.
        </span>
      </label>
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Saving your request…" : "Request my conversation"}
      </button>
      <p className="section-note">
        No payment. No document upload. We’ll confirm the next step with you.
      </p>
      {error && (
        <div className="form-status error" role="alert">
          {error}{" "}
          <a className="text-link" href={"tel:" + business.tel}>
            Call AECS
          </a>
        </div>
      )}
    </form>
  );
}

