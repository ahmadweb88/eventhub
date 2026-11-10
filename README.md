# [PLACEHOLDER] App name

[PLACEHOLDER] One paragraph: what the app does and who it is for.

**Live:** [PLACEHOLDER] https://your-app.vercel.app

## Features

[PLACEHOLDER] List what the app does, one line each.

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (Auth, Postgres, Storage), Vercel.

## Architecture

- **Sessions:** `src/proxy.ts` refreshes the Supabase cookie session on every request and redirects logged-out users away from protected routes.
- **Authorization:** protected pages, server actions and route handlers call `requireUser()` or `getUser()`. Row Level Security protects every table and bucket.
- **Validation:** the same Zod schemas run in the forms and on the server.
- **Files:** a private `images` bucket, with uploads through `/api/upload` and signed URLs for reading.

## Environment variables

| Name                            | Where to find it               |
| ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project settings, API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings, API |

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Apply the SQL files in `supabase/migrations/` to your Supabase project, in order.
4. In Supabase Auth, turn **Confirm email** off and add `http://localhost:3000/**` to Redirect URLs.
5. Run `npm run dev` and open http://localhost:3000.

## Scripts

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Starts the dev server                       |
| `npm run check`    | Runs lint, type check, unit tests and build |
| `npm test`         | Runs unit tests                             |
| `npm run test:e2e` | Runs Playwright end-to-end tests            |
| `npm run format`   | Formats the code with Prettier              |

## Screenshots

[PLACEHOLDER] Add a screenshot of each main flow.
