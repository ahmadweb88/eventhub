# Decisions

> Decisions already made. **Don't reopen or change these without asking the user.**

| ID | Time | Decision | Reason | Status |
|---|---|---|---|---|
| D-01 | 08:05 | Supabase Auth (email + password) as the approved alternative to Firebase Authentication | One provider for auth, Postgres and Storage; RLS ties all three to `auth.uid()`; already wired in the starter | final |
| D-02 | 08:05 | Build on the existing starter in this folder (auth, profiles, images bucket, upload route, http client already present) | Saves ~20 min; P1 becomes connect + configure | final |
| D-03 | 08:05 | Weather: OpenWeatherMap current weather as primary, Open-Meteo (keyless) as automatic fallback | Brief asks for a production public weather API with failure handling; fallback keeps the demo alive if the key isn't active | assumption |
| D-04 | 08:05 | Map uses Leaflet + OpenStreetMap at the lat/lon returned by `/api/weather` (one request feeds weather and map); if weather fails the map shows a message | No extra key or geocoding call; city-not-found handled once with one Retry | assumption |
| D-05 | 08:05 | Poster limit: browser rejects > 5 MB and non JPG/PNG/WebP (the brief's rule), then compresses to WebP ≤ 1 MB; server route keeps a 4 MB cap + file-signature check; bucket caps at 5 MB | Meets "max 5 MB" for users while staying under Vercel's 4.5 MB request body limit | final |
| D-06 | 08:05 | "Share event posters" = upload a poster per event and display it on the card and detail page; posters stay private to the owner (signed URLs). Bucket name stays `images`. Posters shown with `object-contain` so portrait posters aren't cropped | Brief also says each user can only see their own events; no public sharing feature is described | assumption |
| D-07 | 08:05 | Event date is a calendar `date` (no time). "Not in the past" means today or later, checked in Zod + server action on create only; edits may keep an existing past date. Server (UTC) may be up to one day more lenient than the browser | Matches "cannot be in the past when creating"; avoids timezone bugs with `date` columns | assumption |
| D-08 | 08:05 | Create and edit are separate pages (`/events/new`, `/events/[id]/edit`) sharing one `EventForm` | 7 fields + poster is too long for a dialog on a phone | final |
| D-09 | 08:05 | Dashboard order: upcoming first (event date ascending), past events marked "Past"; pagination 9 per page is COULD | Organisers care about what's next; brief only requires search + category filter | assumption |
| D-10 | 08:05 | Category filter is a pill strip of links (`?category=`), search is a debounced input (`?q=`); both in the URL | Shareable/back-button friendly, fits 375 px with its own horizontal scroll | final |
| D-11 | 08:05 | Design: "Ink & Coral" preset (events/social), Sora + Source Sans 3 (already in the starter), code-built logo using the events calendar recipe | Fits the subject; fonts already wired | assumption |
| D-12 | 08:05 | Title minimum 3 characters; description ≤ 2000; venue ≤ 120; city letters/spaces/`.'-` only, 2–80 | Sensible limits; city regex also protects the weather query | assumption |
| D-13 | 08:05 | No profile page, password reset or email confirmation | Not in the brief; time | final |
| D-14 | 09:36 | Behind schedule (~30 min left): build order changed to P4 check → P5 CRUD → P6 posters → P7 weather + map → minimal P3 (logo, landing copy) → README. Pagination (R-27), forecast (R-58) and landing extras dropped first | Protect the highest-mark criteria: CRUD 20, Auth 15, API 15, Storage 10 | final |
