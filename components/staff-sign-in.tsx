"use client";
import { useState } from "react";
import Link from "next/link";
import { createAuthClient } from "@neon/auth/next";
const authClient = createAuthClient();
export function StaffSignIn({ student = false }: { student?: boolean }) {
  const [email, setEmail] = useState(""),
    [otp, setOtp] = useState(""),
    [sent, setSent] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      if (!sent) {
        const result = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });
        if (result.error)
          throw new Error(
            result.error.message || "The sign-in code could not be sent.",
          );
        setSent(true);
      } else {
        const result = await authClient.signIn.emailOtp({ email, otp });
        if (result.error)
          throw new Error(
            result.error.message || "That code could not be verified.",
          );
        window.location.assign(student ? "/my-aecs" : "/staff");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign-in is temporarily unavailable. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="auth-box">
      <h1>
        {student ? "Your next step, all together." : "AECS staff access."}
      </h1>
      <p>
        {student
          ? "Sign in or create your My AECS account with your email. "
          : "Use your authorised email address. "}{" "}
        A one-time code verifies that you control the inbox.{" "}
        {student
          ? "Save your plan, share documents privately and follow updates from AECS."
          : "Public enquiries are never shown without staff authorisation."}
      </p>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="staff-email">
            {student ? "Your email" : "Staff email"}
          </label>
          <input
            id="staff-email"
            autoComplete="email"
            type="email"
            required
            value={email}
            readOnly={sent}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {sent && (
          <div className="field">
            <label htmlFor="staff-otp">Verification code</label>
            <input
              id="staff-otp"
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <small>Check your inbox and spam folder. The code expires.</small>
          </div>
        )}
        <button type="submit" className="button" disabled={pending}>
          {pending
            ? "Please wait…"
            : sent
              ? "Verify and sign in"
              : "Email me a sign-in code"}
        </button>
        {sent && (
          <button
            type="button"
            className="button button-outline"
            disabled={pending}
            onClick={() => {
              setSent(false);
              setOtp("");
              setError("");
            }}
          >
            Use another email
          </button>
        )}
        {error && (
          <p className="form-status error" role="alert">
            {error}
          </p>
        )}
      </form>
      <p className="section-note">
        {student
          ? "Your workspace is shared with authorised AECS staff. By continuing, you agree to our "
          : "Access is restricted to the configured AECS owner account. A verified email alone does not grant staff permissions. "}
        <Link className="text-link" href="/terms">
          Terms
        </Link>
        {" and "}
        <Link className="text-link" href="/privacy">
          Privacy notice
        </Link>
        .
      </p>
    </div>
  );
}
