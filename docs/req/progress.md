# Progress

> The single tracker. Tick a step only when its checks pass: `- [x] 4.1 … HH:MM`.
> Skipped: `- [-] 4.5 … skipped HH:MM (reason)`. Phase details: `phases/phase-N-*.md`.

**Status (10:41):** P3 done (logo, favicon, landing, footer; headless layout check 320–1440 ✅) · 2.4 Supabase URLs pending (user) · next: P8 end-to-end test of CRUD + poster + weather (headless) · live: https://eventhub-three-khaki.vercel.app

Brief received 08:05 · 120 minutes · target finish ~10:05.

| Phase | Feature | Skill | Rubric | Guide |
|---|---|---|---|---|
| P0 | Plan | web-requirements-plan | all | ~8 min |
| P1 | Local setup | web-starter-clone (already cloned) / initial-setup-packages | — | ~7 min |
| P2 | Go public | web-starter-clone (go public) + web-deploy-vercel | Deployment 15 | ~5 min |
| P3 | Design & layout | web-design-system | UI/UX 10 | ~10 min |
| P4 | Authentication | web-auth-supabase | Auth 15 | ~8 min (starter has it) |
| P5 | Events CRUD | web-database-crud | CRUD 20 | ~25 min |
| P6 | Poster storage | web-file-storage | Storage 10 | ~10 min |
| P7 | Weather + map | web-external-api | API 15 | ~15 min |
| P8 | Polish & test | web-design-system + Playwright | UI/UX, no crashes | ~10 min |
| P9 | Docs, final check, submit | web-readme-docs + web-final-check | Docs 5, Demo 5, all | ~15 min |

## P0 Plan ✅
- [x] 0.1 Brief analyzed, docs/req written · 08:09
- [x] 0.2 Plan reviewed by the user · 08:14

## P1 Local setup ✅
- [x] 1.1 Starter in place (D-02); `npm install react-dropzone browser-image-compression leaflet react-leaflet` + `-D @types/leaflet` (04-packages)
- [x] 1.2 Supabase project connected, `.env.local` set (URL, anon key, `OPENWEATHER_API_KEY`), `.env.example` lists the 3 names; Confirm email off (user to confirm in dashboard)
- [x] 1.3 `siteConfig` → EventHub name, description, nav `[My events → /dashboard]`
- [x] 1.4 Ink & Coral tokens in `globals.css` (03-design), shadow tint `rgb(26 31 54)`
- [x] 1.5 Starter migrations (profiles, images bucket) applied; `create_events` migration from 05-data-model applied; security advisor clean; `src/types/database.ts` generated
- [x] 1.6 Private `CLAUDE.md` / `AGENTS.md` per web-requirements-plan Section 8
- [x] 1.7 `npm run check` passes · 08:23

## P2 Go public ✅
- [x] 2.1 `git init`, AI files in `.git/info/exclude`, first commit as the user
- [x] 2.2 Public GitHub repo https://github.com/ahmadweb88/eventhub, push to `main`
- [x] 2.3 Vercel connected to Git, Supabase env variables added (OPENWEATHER_API_KEY pending), live URL works (`/api/health`) · 09:36
- [ ] 2.4 (user) Live URL added to Supabase Site URL and Redirect URLs

## P3 Design & layout ✅
- [x] 3.1 Logo (events recipe), `icon.svg`, `apple-icon.tsx`; default `favicon.ico` removed (R-10)
- [x] 3.2 App shell: header with logo, nav, user menu / Log in + Sign up; footer with API credits (R-74)
- [x] 3.3 Landing page: hero split, "what you can do" list, categories, dark CTA band (R-10, R-11)
- [x] 3.4 Check landing + shell at 320 / 375 / 1024 / 1440, no sideways scroll

## P4 Authentication
- [x] 4.1 Proxy prefixes `['/dashboard', '/events']`, auth-page redirect, `next` param (R-04, R-05, R-07)
- [ ] 4.2 Sign-up (full name, email, password, confirm) and login pages restyled, split layout on lg (R-01, R-02)
- [ ] 4.3 User menu: name + email + Log out; Profile item removed (R-03, R-08)
- [ ] 4.4 Dashboard greeting from `profiles.full_name` (R-08)
- [ ] 4.5 Auth checks from 06-auth pass locally (R-06)

## P5 Events CRUD
- [x] 5.1 `events` migration confirmed, types regenerated, `event.ts` Zod schemas + `todayIso()` + unit tests for past-date rule (R-31, R-33, R-34, R-77)
- [x] 5.2 Data layer `listEvents` / `getEvent` with search, category, upcoming order, count (R-20–R-22, R-26, R-28)
- [x] 5.3 Server actions create / update / delete with `ActionResult` (R-30–R-32, R-71)
- [x] 5.4 Dashboard: heading + New event, search, category pills, card grid, empty and no-results states, `loading.tsx` (R-20–R-25)
- [x] 5.5 `EventForm` + `/events/new` and `/events/[id]/edit`, field errors, pending, toast, redirect (R-30–R-33, R-35, R-54)
- [x] 5.6 Detail page + not-found + loading; delete AlertDialog naming the event (R-50, R-55, R-56, R-64)
- [x] 5.7 Pagination 9 per page (R-27, COULD)
- [ ] 5.8 CRUD checks from web-database-crud Section 10 (second user can't see first user's events) (R-72)

## P6 Poster storage
- [x] 6.1 Bucket and policies confirmed; `next.config.ts` remotePatterns for Supabase (R-41)
- [x] 6.2 `upload-image.ts` (compress → `/api/upload`), `PosterDropzone` with 5 MB / type errors, preview, remove (R-40, R-43, R-45)
- [x] 6.3 Form uploads on submit; actions check `isOwnPath`, clean up on failed insert, replace, remove, delete (R-44)
- [x] 6.4 Signed URLs in list (batch) and detail; placeholder for no poster; `object-contain` frames (R-42, R-46)
- [ ] 6.5 Storage checks from web-file-storage Section 9

## P7 Weather + map
- [x] 7.1 `http.ts` ApiError / toApiError / withRetry, `cache.ts` (R-73)
- [x] 7.2 `weather.ts` service: OWM + Open-Meteo fallback, Zod-validated, `adviceFor(weather, category)` + tests (R-51, R-52, R-77)
- [x] 7.3 `/api/weather` route: 401 / 400 / 404 / 502 / 503 / 504 (R-60, R-61, R-73)
- [x] 7.4 Weather card with loading, error, not-found, success, retry, "current weather" note (R-51, R-52, R-57, R-60, R-61, R-63)
- [x] 7.5 Leaflet map from the same coordinates, skeleton, unavailable state (R-53)
- [ ] 7.6 Forecast for event date within 7 days (R-58, COULD)
- [ ] 7.7 API checks from web-external-api Section 10 (bad city, no key, offline, key not in browser)

## P8 Polish & test
- [ ] 8.1 Playwright pass at 320 / 375 / 768 / 1024 / 1440 / 1920: no sideways scroll, 44 px targets, focus visible, no console errors (R-74)
- [ ] 8.2 Bad-input sweep: invalid ids, 100-char titles, emoji in city, renamed .exe as .jpg, offline (R-62)
- [ ] 8.3 Update `e2e/smoke.spec.ts` for landing + login redirect; `npm run check` passes (R-76)
- [ ] 8.4 Push, live check on Vercel (all flows)

## P9 Docs, final check, submit
- [ ] 9.1 Demo account + 4–6 realistic events with posters, mixed categories, one past (R-84)
- [ ] 9.2 Sequential screenshots: auth, dashboard, create (with errors), poster upload, details with weather + map, weather error, edit, delete (R-81)
- [x] 9.3 README (screenshots still placeholder): overview, live URL, features, architecture, env variables, API keys, setup, screenshots, link to docs/req (R-81, R-82)
- [ ] 9.4 web-final-check: rubric walkthrough on the live URL, fix list, secrets scan of git history (R-83)
- [ ] 9.5 Demo script and code-defense answers (R-85)
- [ ] 9.6 Final push; submit repo URL + live URL

## If time runs short (cut order)
1. R-58 forecast, R-27 pagination, landing extras (category strip, OG image)
2. R-43 drag-and-drop polish (keep a plain file input with the same checks), R-26 "Past" badge
3. Never cut: live URL, auth + protection, full event CRUD with poster, weather card with error + retry, map pin, README with screenshots
