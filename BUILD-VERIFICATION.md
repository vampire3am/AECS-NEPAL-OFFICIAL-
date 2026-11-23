# Verification record

23 November 2026.

- Production compilation, TypeScript and static generation passed with Next.js 16.4.6.
- Five validation tests passed: explicit consent, contact validation, size limits, bot field, UUID request identity, origin matching and budget input handling.
- Twenty-eight public routes returned HTTP 200 from the local production server, with no replacement characters. Unknown routes returned 404.
- Security header checks passed. Pricing appears in the sitemap; staff pages are excluded.
- Unauthenticated staff API access returned 403 without enquiry data.
- Synthetic booking requests against the isolated Neon development branch returned persisted references. Repeated request IDs returned the same reference. Invalid consent, cross-origin requests and past dates were rejected. The sixth request in the test bucket returned 429.
- Production application tables have RLS enabled. Database access remains server-side.
- Impeccable source detector returned no findings for app/components. This is not a rendered accessibility assessment.

## Still requiring live verification

Browser control stopped during account setup because the active URL could not be verified. No desktop/mobile screenshot approval or full keyboard interaction test is claimed. The local preview is available at http://localhost:3000 while its server is running.

The owner must verify OTP delivery, sign-in, session restoration, sign-out and inbox status changes in the deployed environment. Automated checks did not send a real email. Configure production SMTP and confirm business copy, current pricing and image permissions before broader operational use.

Vercel deployment must use iamsamshad7@gmail.com. The initially connected Vercel account was different; no resource was created in that account.

