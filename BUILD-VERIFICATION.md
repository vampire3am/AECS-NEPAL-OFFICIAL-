# Verification record

24 November 2026.

## Verified

- Eight unit tests pass for booking validation, origins, budgets, privileged actions and document signatures.
- Thirty-seven development integration checks pass through actual managed Auth sessions, HTTP routes, Postgres and private S3-compatible storage.
- Two independent student identities prove plan, task, conversation and document isolation. Anonymous workspace/downloads fail; unauthorised record selection and application changes fail; staff review, appointment confirmation and replies persist.
- Private document upload, byte-identical download, spoofed PDF rejection and unsigned public-bucket rejection pass. Workspace actions and document downloads produce audit records.
- Staff application updates append actual history records. Calendar dates are returned as text so Nepal timezone conversion cannot shift a deadline.
- Browser review at a 390 × 844 viewport covers the homepage, signed-in student overview, application view and private documents. Desktop review covers the public homepage and owner student desk. Synthetic development records only.
- Production schema migration is additive; no prior enquiries were removed. Production has its own private bucket, storage credential and Auth endpoint. No synthetic student data was inserted into production.

## Delivery checks

Production build, public route smoke checks and deployment state are recorded in the delivery status after deployment. No Lighthouse score or independent security certification is claimed.

## Operational verification still owned by AECS

Confirm actual email-code delivery to the owner inbox and a student inbox, staff response procedures, current business prices and imagery rights. Managed Auth sessions work in development, but real SMTP inbox delivery was not exercised by the agent. Messages currently notify in the workspace only. Files are private but not automatically virus-scanned; staff review is not an authenticity certificate. Student records require a documented retention/deletion process.

## Final local build checks

Next.js production build and TypeScript passed. All 28 public page routes returned HTTP 200, anonymous private endpoints returned 401/403, unknown routes and the removed development QA route returned 404, and the student portal redirected anonymous visitors to sign-in. Static and optimised hero/logo image requests returned 200. No real email was sent.
