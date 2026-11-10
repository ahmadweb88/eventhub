# Phase 1: Local setup

> Goal: the starter runs against the EventHub Supabase project with the plan's packages, tokens and schema.
> Requirements: R-70, R-71, R-72, R-76 · Rubric: — · Skill: initial-setup-packages
> Tracker: [`../progress.md`](../progress.md)

## Steps
- [x] 1.1 Feature packages installed: react-dropzone, browser-image-compression, leaflet, react-leaflet, @types/leaflet
- [x] 1.2 Supabase `vspark26` connected; `.env.local` (URL, anon key, empty `OPENWEATHER_API_KEY`); `.env.example` lists the 3 names
- [x] 1.3 `siteConfig` set to EventHub
- [x] 1.4 Ink & Coral tokens, shadows tinted `rgb(26 31 54)`
- [x] 1.5 Migrations applied: profiles, images bucket, events, revoke RPC execute on `handle_new_user`; advisor clean; types generated, clients typed
- [x] 1.6 Private `CLAUDE.md`
- [x] 1.7 `npm run check` passes

## Open items for the user
- Supabase → Authentication → Sign In / Providers → Email → **Confirm email: Off**
- OpenWeatherMap key into `.env.local` and Vercel (optional, Open-Meteo fallback works without it)

## Trace log
| ID | Time | Result | Checks | Commit | Notes |
|---|---|---|---|---|---|
| 1.1–1.7 | 08:23 | ✅ | `npm run check` ✅, security advisor ✅ | first commit in P2 | Advisor flagged `handle_new_user` RPC exposure → revoked |
