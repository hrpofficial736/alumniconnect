# AlumniConnect

AlumniConnect is a web application for connecting current students with alumni from their institution. It has separate student, alumni, and administrator areas for directory browsing, profile management, mentorship requests, connected-mentee management, and email communication.

This guide documents the implementation currently in this repository. Some landing-page statements describe intended capabilities rather than working features; important differences are noted below.

## Contents

- [Overview](#overview)
- [Features by role](#features-by-role)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Data model](#data-model)
- [API routes](#api-routes)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [Build and lint](#build-and-lint)
- [Known limitations](#known-limitations)

## Overview

The project is split into two independently installed applications:

- **Client:** React single-page application built with Vite and TypeScript.
- **Server:** Node.js ES-module application using Express and PostgreSQL.
- **Database:** PostgreSQL stores profiles, admins, mentorship requests, and accepted mentorship relationships.

The client sends requests to `${VITE_API_BASE_URL}/api/...`. The server mounts its API router at `/api`, so configure the client base URL as the server origin (for example, `http://localhost:5000`), without appending `/api`.

The general request flow is:

```text
Page -> TanStack Query hook -> API function -> apiClient/fetch
     -> Express route -> controller -> PostgreSQL
```

Mutations generally invalidate relevant TanStack Query keys so affected views reload.

## Features by role

### Students

- Browse alumni and search/filter profiles by batch year, CGPA, and skill.
- Send a mentorship request with one or more topics: `placements`, `higher_studies`, or `general`; a message is optional.
- View pending and rejected requests, withdraw pending requests, or delete rejected requests.
- View accepted mentors and remove a mentor connection.
- View and update their profile.

### Alumni

- View students already connected to them as mentees. This is not a directory of all students.
- Review incoming mentorship requests and accept or reject them.
- View, search, and filter connected students, including by mentorship topic.
- Email selected connected students or send by mentorship topic.
- Update their profile.

Emails are written in Markdown in the client. The server converts the content to HTML, sanitizes it, and sends individual messages through SMTP. The response includes sent and failed counts.

### Administrators

- View, search, and filter student and alumni records.
- Import student and alumni records from JSON using the seed controls.
- Trigger an action that attempts to move students whose `batch_year` equals the current calendar year into the alumni table.

The admin pages do not currently implement general record editing, CSV import/export, reporting, or verification workflows, despite some UI and landing-page descriptions.

## Architecture

### Client

- `client/src/main.tsx` sets up React, browser routing, and the shared TanStack Query client.
- `client/src/App.tsx` declares public and role-specific page routes.
- `client/src/pages/` contains the landing/auth pages, dashboard, and student/alumni/admin pages.
- `client/src/components/` contains shared UI such as the sidebar, filters, and profile editor.
- `client/src/hooks/` wraps API calls with TanStack Query queries and mutations.
- `client/src/api/` contains typed endpoint functions and the shared HTTP helper.
- `client/src/types/types.ts` contains client-side domain types.

### Server

- `server/src/index.js` configures Express, CORS, body parsing, health endpoints, and the `/api` router.
- `server/src/routes/routes.js` registers API endpoints.
- `server/src/controllers/` contains SQL-backed handlers grouped by feature.
- `server/src/db/setup.js` wraps a PostgreSQL connection pool.
- `server/src/middleware/middleware.js` is the current authentication middleware, but currently only calls `next()`.

### Technology

| Area | Technologies |
| --- | --- |
| Client | React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS 4 |
| Server | Node.js ES modules, Express 5 |
| Database | PostgreSQL via `pg` |
| Other server dependencies | `bcrypt`, `dotenv`, `nodemailer`, `marked`, `sanitize-html`, `cors` |
| Package manager | pnpm; `client` and `server` have separate lockfiles |

## Repository structure

```text
client/
  src/
    api/          HTTP endpoint functions
    components/   Shared UI components
    hooks/        TanStack Query hooks and mutations
    pages/        Landing, auth, dashboard, and role pages
    types/        Shared client-side types
    App.tsx       Client-side route definitions
    main.tsx      React/router/query setup
  package.json
  vite.config.ts

server/
  src/
    controllers/  Feature-specific API handlers
    db/setup.js   PostgreSQL pool wrapper
    middleware/   Express middleware
    routes/       API endpoint registration
    index.js      Express app and server startup
  package.json
```

## Data model

There are no checked-in SQL migrations, schema definition, or database bootstrap script. The following tables and columns are inferred from the SQL statements and must be provisioned in PostgreSQL:

- **`students`** — `id`, `name`, `bio`, `age`, `gender`, `semester`, `cgpa`, `college`, `roll_no`, `email`, `password`, `branch`, `batch_year`, `phone`, `skills`, `portfolio_link`, `linkedin_link`.
- **`alumni`** — `id`, `name`, `bio`, `roll_no`, `age`, `gender`, `email`, `password`, `current_company`, `current_position`, `batch_year`, `cgpa`, `college`, `skills`, `portfolio_link`, `linkedin_link`, `branch`, `phone`.
- **`admin`** — SQL paths use `id`, `name`, `email`, `college`, and in some legacy controller paths `password`.
- **`mentorship_requests`** — `id`, `student_id`, `alum_id`, `tags`, `description`, `status` (`pending` or `rejected`).
- **`mentorship`** — accepted connection fields `student_id`, `alum_id`, `tags`, and `description`.

The client models `skills` and mentorship `tags` as string arrays. Database column types, constraints, and foreign keys are not defined in this repository; confirm them in the database before changing the schema.

Mentorship lifecycle:

1. A student creates a pending row in `mentorship_requests`.
2. An alumnus can reject it, changing its status to `rejected`, or accept it.
3. Accepting runs a transaction that inserts a row into `mentorship` and deletes the request.
4. Connected mentor/mentee views and email recipient selection use `mentorship`.

## API routes

All paths below are prefixed with `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/students/login` | Student login |
| `POST` | `/auth/alumni/login` | Alumni login |
| `POST` | `/auth/admin/login` | Admin login |
| `POST` | `/auth/admin/register` | Admin registration |
| `GET` | `/students` | List students |
| `GET`, `PATCH`, `DELETE` | `/students/:id` | Read, update, or delete student |
| `GET`, `PATCH` | `/students/:id/profile` | Read or update student profile |
| `POST` | `/students/seed` | Seed students |
| `GET` | `/alumni` | List alumni |
| `GET`, `PATCH`, `DELETE` | `/alumni/:id` | Read, update, or delete alumnus |
| `GET`, `PATCH` | `/alumni/:id/profile` | Read or update alumni profile |
| `POST` | `/alumni/seed` | Seed alumni |
| `POST` | `/mentorship/requests` | Create mentorship request |
| `GET` | `/mentorship/requests/:id` | List pending requests for an alumnus |
| `PATCH` | `/mentorship/requests/:id/accept` | Accept request |
| `PATCH` | `/mentorship/requests/:id/reject` | Reject request |
| `GET` | `/mentorship/student-requests/:id` | List a student's requests |
| `DELETE` | `/mentorship/student-requests/:id` | Withdraw pending request |
| `DELETE` | `/mentorship/student-requests/:id/rejected` | Delete rejected request |
| `GET` | `/mentorship/mentors/:id` | List a student's accepted mentors |
| `GET` | `/mentorship/students/:id` | List an alumnus's connected students |
| `DELETE` | `/mentorship/mentors` | Remove a student/alumnus connection |
| `POST` | `/mentorship/mail/:id` | Email connected students |
| `GET`, `PATCH`, `DELETE` | `/admin/:id` | Read, update, or delete admin |
| `POST` | `/admin` | Create admin (legacy controller path) |
| `POST` | `/admin/:id/seed/students` | Seed students through admin path |
| `POST` | `/admin/:id/seed/alumni` | Seed alumni through admin path |
| `POST` | `/admin/:id/update/students` | Move current-year students to alumni |

The server also provides `GET /` and `GET /db-health` outside the `/api` prefix.

## Run locally

The client and server are separate pnpm projects; install dependencies in each directory. The repository is not configured as a pnpm workspace.

### 1. Prepare PostgreSQL

Create a PostgreSQL database and provision the tables and columns described in [Data model](#data-model). No migration or schema setup command is included.

### 2. Configure and run the server

Create `server/.env` with:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

Then:

```powershell
cd server
pnpm install
pnpm start
```

The server defaults to port `5000`; `pnpm start` runs `nodemon src/index.js`.

### 3. Configure and run the client

Create `client/.env` with:

```dotenv
VITE_API_BASE_URL=http://localhost:5000
```

In another terminal:

```powershell
cd client
pnpm install
pnpm dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The server's CORS configuration currently allows that origin only.

## Environment variables

| Variable | Application | Required | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Server | Yes | PostgreSQL connection string |
| `PORT` | Server | No | HTTP port; defaults to `5000` |
| `VITE_API_BASE_URL` | Client | Yes | API origin, e.g. `http://localhost:5000`; do not include `/api` |
| `SMTP_HOST` | Server | For email | SMTP server hostname |
| `SMTP_PORT` | Server | For email | Defaults to `587`; valid range is 1–65535 |
| `SMTP_SECURE` | Server | No | Set to `true` for TLS; port 465 also enables secure transport |
| `SMTP_FROM_EMAIL` | Server | For email | Sender address |
| `SMTP_USER`, `SMTP_PASS` | Server | Optional pair | Must either both be set or both omitted |
| `CLERK_ADMIN_EMAILS` | Server | No | Comma-separated addresses checked by admin registration controller |

Do not commit real credentials. Environment files are ignored by Git.

## Build and lint

From `client/`:

```powershell
pnpm build
pnpm lint
pnpm preview
```

`pnpm build` runs the TypeScript project build and then creates a Vite production bundle. `pnpm preview` serves that bundle locally. The server package currently defines only a `start` script; neither package defines a test script.

## Known limitations

These are observations about the checked-in implementation. Do not treat the current application as production-ready:

- **Authentication is incomplete and is not enforced by the API.** The server middleware currently calls `next()` without validating identity or authorization. Client API functions pass `null` as the token, although the shared HTTP helper supports an Authorization header.
- **The sign-in UI and server endpoints do not fully align.** The client offers student/alumni registration, but there are no corresponding server registration routes. Admin sign-in and registration payloads do not match the server controller expectations. The Google button has no sign-in handler.
- **Identity is stored client-side.** After a successful login, the client stores the returned profile in `localStorage` and uses its role/id to choose pages. This does not secure API access.
- **Responses can contain password hashes.** Student and alumni login query complete rows and return them; the client caches and stores the returned profile. Student and alumni list endpoints also use `SELECT *`. Avoid using real accounts until these responses are corrected.
- **Database setup is manual.** There are no migrations, schema installer, or test fixtures. Admin JSON seeding hashes supplied passwords but does not validate the full record shape before insertion.
- **Some dashboard values are placeholders.** Student/alumni CGPA/company and connection counters are fixed UI values rather than computed from profile or relationship data.
- **Search and filters are client-side.** Lists are fetched before filtering; there is no server-side pagination.
- **CORS is fixed to `http://localhost:5173`.** A different client origin needs corresponding server configuration.

For production readiness, address authentication/authorization and password-hash exposure first, then add a versioned database schema and automated validation/tests for critical flows.
