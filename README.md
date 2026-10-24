# AuraBook Salon SaaS — Next.js + Prisma + PostgreSQL

This repository is a deployable starter built from the supplied AuraBook React source. It retains the core three-console idea and replaces the browser-only salon/booking state with a Next.js App Router application, database-backed route handlers, Prisma ORM, and PostgreSQL.

## Consoles included

- **Customer Booking Console:** salon discovery/search/category/city filters, salon service/staff selection, appointment creation, appointment list and cancellation.
- **Salon Owner Console:** owner account registration/sign-in, salon registration (pending admin approval), switch between owned salons, add services/team members, view salon appointments, start/complete service.
- **Admin Panel:** protected admin sign-in, salon directory, approve/reject/suspend/reactivate salons, set subscription plan and configured monthly plan price, dashboard metrics.

The original uploaded TSX is retained at `legacy/salon_saas_multi_tenant_platform.tsx` as a reference. The new UI is responsive for mobile, tablet, and desktop.

## Stack

- Next.js 15 App Router (frontend and server API routes)
- TypeScript / React
- Prisma ORM 6
- Managed PostgreSQL (Neon, Supabase PostgreSQL, or another PostgreSQL provider)
- Signed HTTP-only session cookie (JWT via `jose`), `bcryptjs` password hashing, Zod input validation
- Vercel deployment

## Local setup

Requirements: Node.js 20.9+ and a PostgreSQL database.

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `AUTH_SECRET`.
2. Install packages: `npm install`
3. Generate Prisma client: `npm run db:generate`
4. Create/apply initial database schema: `npm run db:push`
5. Add starter records and demo accounts: `npm run db:seed`
6. Run locally: `npm run dev`

Open `http://localhost:3000`.

### Demo accounts (created by `npm run db:seed`)

- Admin: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your environment (defaults in seed are for local development only)
- Owner: `owner@example.com` / `ChangeThis-Owner-Password-123!`
- Customer: `customer@example.com` / `ChangeThis-Customer-Password-123!`

Change all seeded passwords before exposing any deployment publicly. Do not leave the seed/demo credentials active in production. Public registration deliberately cannot create an ADMIN role; create administrators using a controlled database/seed process.

## Deploy to GitHub and Vercel

1. Create a GitHub repository and push the contents of this folder (the `package.json` should be at the repository root).
2. Create a managed PostgreSQL database and copy its pooled/connection URL. Ensure it is reachable by Vercel serverless functions.
3. Import the GitHub repository into Vercel. Framework preset: **Next.js**. Root directory: `.`.
4. Add these Vercel Environment Variables for Production (and Preview if required):
   - `DATABASE_URL` — PostgreSQL connection string, including provider-required SSL parameters.
   - `AUTH_SECRET` — long random secret, at least 32 characters. Generate one with `openssl rand -base64 48`.
   - `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` — only if using the seed command in a controlled setup; do not expose demo credentials.
5. Before serving traffic, run the schema command against the production database from a trusted terminal/CI environment: `npx prisma db push` for initial setup. For a mature production system, create and commit Prisma migrations (`npx prisma migrate dev --name init`) in development and use `npx prisma migrate deploy` in CI/deployment.
6. Deploy. The build command runs `prisma generate && next build`.
7. Run `npm run db:seed` only when you intentionally want the starter demo data and accounts in that database. Avoid seeding production with default passwords.

## API routes

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/salons`, `POST /api/salons` (owner creates a pending salon)
- `GET /api/appointments`, `POST /api/appointments`, `PATCH /api/appointments/:id`
- `GET /api/owner/salons`, `POST /api/owner/services`, `POST /api/owner/staff`
- `GET /api/salons?all=true` and `PATCH /api/admin/salons` (admin only)
- `GET /api/admin/settings`, `PUT /api/admin/settings` (admin only)

## Important deployment/security notes

- Database persistence and role checks are implemented in API routes; the console selector is a navigation aid, **not** an authorization mechanism. Owner/admin operations check the signed-in role and salon membership on the server.
- The booking endpoint checks staff/service ownership and overlapping appointment times. The overlap check is application-level; for high-concurrency production workloads, add a database-level exclusion constraint or another transactional reservation lock before relying on it for simultaneous requests.
- This is a starter, not a fully audited commercial platform. Payment provider webhooks, real email/WhatsApp delivery, password reset/email verification, reviews, audit logs, advanced opening-hours/holiday rules, subscription enforcement, and automated reminder jobs are not implemented. Notification integrations shown in the original mock UI are not falsely represented as live integrations.
- The app uses USD because that is what the uploaded mock source uses. Configure currency/tax behavior before a real launch.
- `db:push` is convenient for first-time setup; use versioned migrations for production schema evolution.

## Included schema

Prisma models cover users/roles, salons, owner memberships, services, staff, staff-service links, appointments, invoices, platform settings, and notifications. Some models are foundation for future phases and are not yet surfaced as complete management screens.
