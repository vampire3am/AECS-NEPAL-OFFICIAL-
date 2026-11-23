# AECS Nepal

A minimal, professional multi-page website for Abroad Education Consultancy Services Pvt. Ltd. Built with Next.js, React, TypeScript, Lakebase Postgres on Neon and managed Neon Auth. Intended Vercel hosting account: `iamsamshad7@gmail.com`.

## What works

- Twelve destination guides, filters, search and side-by-side comparison of up to three destinations. Shortlists stay on the visitor's device.
- IELTS, PTE and Duolingo course information, published package pricing, real AECS team profiles and preparation guides.
- A study worksheet with local saving, printable summary and a calculator for the visitor's own cost estimates.
- Counselling and exam enquiries saved server-side to Postgres, with stable references, idempotent retries, input validation, consent checks, origin checks, and database-backed rate limiting.
- Owner-only staff inbox, verified email OTP sign-in, status filtering, pagination, status changes and audit records. The server authorizes every private read and mutation. The owner is selected through `ADMIN_EMAIL`; verified email alone grants no staff access.
- Responsive navigation, local fonts and imagery, privacy/terms pages, sitemap, robots, error and not-found screens, basic browser security headers.

## Local setup

Use Node 22.18 or newer. Install the pinned packages with `pnpm install --frozen-lockfile`. Copy `.env.example` to `.env.local` and supply the server-only database URL, managed Auth URL, independent random cookie and rate-limit secrets, owner email and site origin. Never commit `.env.local`.

Run `pnpm dev`, `pnpm test`, `pnpm typecheck`, and `pnpm build`. `pnpm start` serves the production build. Run `node tests/integration.mjs` only against a development database: it writes synthetic test enquiries and intentionally exercises the rate limiter.

## Database and authentication

Neon project: `autumn-sky-98311213` (`AECS Nepal`), Singapore. Production branch: `br-royal-glade-bimex2my`. Development branch: `br-frosty-hall-bicvtuth`. Database: `aecs`.

The initial schema is in `database/001_initial.sql`. All application tables enable RLS and revoke PUBLIC access. No public Data API is enabled; database access is server-side. Keep production and preview credentials separate. Test migrations on a branch before applying them to an established production database.

Managed Neon Auth is provisioned. The application supports email OTP through the managed service. Add the deployed origin to Neon's trusted-domain allowlist. OTP delivery, sign-in, reload restoration and owner inbox interaction must be tested by the owner; automated tests do not send real email. Shared managed SMTP is suitable for initial verification; configure production SMTP in Neon before a wider operational rollout.

## Vercel deployment

Import `vampire3am/AECS-NEPAL-OFFICIAL-` into the intended Vercel account with Next.js auto-detection and Node 22 or newer. Configure all `.env.example` keys as environment variables. Use the production branch database for production and the isolated development branch for previews. Mark database and signing secrets as secret/sensitive variables. Set `NEXT_PUBLIC_SITE_URL` to the final canonical deployment origin and add that same origin to Neon Auth. Deploy, test public pages and the API, then have the owner verify sign-in. No existing domain should be moved without a separate request.

## Content and assets

Business facts, team details, prices and existing images are sourced from `https://aecsnepal.com/`, retrieved 23 November 2026. `CONTENT-SOURCES.md` documents provenance. Published fees are dated and require confirmation before payment. No admission, visa, scholarship or score guarantee is made. The hero destination illustration is an existing AECS-published asset, not evidence of an individual student's result. Obtain and retain permission for continued use of all team and student images.

## Operational boundaries

This release provides the public website, planning tools, enquiry backend and owner inbox. It does not collect payment, confirm exam availability, upload sensitive documents, manage university applications, or send automated counselling emails. Staff must follow up on enquiries and establish an appropriate retention/deletion policy. Authentication and email-provider settings require operational review before handling sensitive student records.

