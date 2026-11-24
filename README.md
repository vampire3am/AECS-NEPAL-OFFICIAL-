# AECS Nepal

A multi-page study counselling website and private student platform built with Next.js 16, React, TypeScript, Neon Postgres, managed Neon Auth and private Neon object storage.

Live: https://aecs-nepal-official.vercel.app/
Repository: https://github.com/vampire3am/AECS-NEPAL-OFFICIAL-
Hosting owner: iamsamshad7@gmail.com.

## Public website

Twelve destination guides, search, filters and side-by-side comparisons with dated primary sources for costs and intake guidance. IELTS, PTE and Duolingo preparation, dated AECS package pricing, real team profiles, guides, a printable budgeting worksheet and essential Nepali guidance for students and parents. The redesigned homepage uses interactive destination previews, a working plan starter and a My AECS walkthrough. AECS team portraits and the award photograph support the About page. Figures retain their source currency, period and scope; they are not quotations or immigration assessments.

## Student workspace

At /my-aecs, students sign in using an email code, save a profile, import a browser draft, keep a study plan and shortlist, follow staff-entered applications and their history, complete their assigned tasks, upload requested documents privately, read review feedback, request appointments and exchange messages with AECS. Updates are real database records. Meetings are requests until staff confirms them. Dates and confirmed times use Nepal time.

## Owner control centre

/staff contains the enquiry inbox. /staff/students contains student dossiers, application creation/stage updates, task and document checklists, private file downloads/reviews, appointment confirmation and replies. Only the verified configured ADMIN_EMAIL is staff. Students cannot grant themselves staff access or alter application stages. Every private endpoint derives identity from the server session; record ownership is checked in SQL. Sensitive responses use private, no-store caching.

## Setup

Node >=22.18 and pnpm 11.25.0. Run pnpm install --frozen-lockfile, copy .env.example to .env.local and configure branch-specific values. Secrets must stay server-side and out of Git. Run pnpm dev, pnpm test, pnpm typecheck and pnpm build. pnpm start serves the production build.

Database project autumn-sky-98311213, Singapore. Production br-royal-glade-bimex2my; development br-frosty-hall-bicvtuth; database aecs. Apply database/001_initial.sql then db/002-workspace.sql on a development branch before production. The private student-documents bucket and S3 credentials must match the database branch. Production and development use separate Auth endpoints, storage credentials and database URLs. All application tables have RLS enabled and PUBLIC permissions revoked. Access uses server-only database credentials; there is no public database API.

The private document endpoint accepts PDF/JPEG/PNG signatures matching the declared MIME type, up to 3 MB each and 30 documents per student. Files are downloaded as attachments after authorisation. Document authenticity and malware are not automatically assessed. Audit records cover workspace changes and downloads. Staff must establish their retention policy and process correction/deletion requests, including both database records and stored objects.

## Verification

Unit tests cover request consent, validation, idempotency input, origins, budget limits and document signatures. tests/workspace-integration.mjs performs the real student/staff HTTP → Auth → database → private storage workflow against the specifically guarded development branch. Run it only with AECS_RUN_INTEGRATION=1 and development ADMIN_EMAIL=aecs-staff-test@example.invalid. It creates synthetic records, retains fixtures locally under ignored .test-local and never sends real email. The development-only browser QA sign-in screen is not part of the deployed source.

See BUILD-VERIFICATION.md for checks and their limits. CI runs tests, TypeScript and a production build. The owner must personally check live email-code delivery and sign-in; automated tests prove provider sessions with isolated password-based fixture identities, not real inbox delivery.

## Operational boundaries

Payments, automatic immigration eligibility decisions, university-system integrations and automatic message email notifications are not included. Application stages are staff records, not automatic institution status. Messages are read in the workspace using Refresh. No fake university decisions, testimonials, success percentages or invented prices are displayed. AECS must confirm copy, fees, continued image permissions and operational email configuration before broad rollout.

## Frontend design tooling

Impeccable is installed project-scope in .agents/skills/impeccable, with Codex hooks in .codex/hooks.json. On this Windows environment npx was unavailable, so the same installer ran via pnpm dlx impeccable install --project --providers=codex --yes. Project context, craft guidance, source detection, rendered detection and desktop/mobile screenshots were used for the redesign. The design system is documented in DESIGN.md; app/redesign.css applies it across public and private screens.
