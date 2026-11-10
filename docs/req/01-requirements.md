# 01 Requirements

> What we're building, for whom, and what counts as done.

## Snapshot
| Item | Details |
|---|---|
| App name | EventHub |
| Purpose (one line) | Community members create and manage local events, check the weather for each event's city, and share event posters. |
| Users | Community organisers: people running workshops, meetups, sports days, cultural and charity events |
| Main user goal | Plan an event in one place: details, poster, and whether the weather suits it |
| Stack | Next.js 16 (App Router) + Supabase (Auth, Postgres, Storage) + Vercel |
| Source | VSPARK Practice Round brief, Web Development Track, received 08:05 (120 min) |

## Requirements

Priority: **MUST** = named in the brief or a rubric item depends on it · **SHOULD** = expected
part of a MUST feature · **COULD** = only after every MUST works. Items marked *(suggested)* are
not stated in the brief.

### Authentication
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-01 | Sign up with full name, email and password (confirm password field) | MUST | Auth | P4 |
| R-02 | Log in with email and password; friendly error on wrong credentials | MUST | Auth | P4 |
| R-03 | Log out from the user menu | MUST | Auth | P4 |
| R-04 | Dashboard and all `/events/*` pages require login | MUST | Auth | P4 |
| R-05 | Logged-out user opening a private page is redirected to `/login?next=…`, then returned after login | MUST | Auth | P4 |
| R-06 | Session survives refresh (cookie session refreshed by `proxy.ts`) | MUST | Auth | P4 |
| R-07 | Logged-in user opening `/login` or `/signup` goes to `/dashboard` *(suggested)* | SHOULD | Auth | P4 |
| R-08 | Full name stored in `profiles` and shown in the header / dashboard greeting | SHOULD | Auth | P4 |

### Landing
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-10 | Public landing page that explains EventHub (events, weather, posters) | MUST | UI/UX | P3 |
| R-11 | Landing has **Sign up** (accent) and **Log in** actions | MUST | UI/UX | P3 |

### Dashboard: My Events
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-20 | List only the logged-in user's events as cards: poster, title, date, city, category | MUST | CRUD | P5 |
| R-21 | Search events by title (debounced, in the URL) | MUST | CRUD | P5 |
| R-22 | Filter by category: Workshop, Meetup, Sports, Cultural, Charity (plus "All") | MUST | CRUD | P5 |
| R-23 | Helpful empty state when the user has no events, with "Create your first event" | MUST | UI/UX | P5 |
| R-24 | Separate "no results" state when search/filter matches nothing, with "Clear filters" | SHOULD | UI/UX | P5 |
| R-25 | Loading skeleton cards while the list loads | MUST | UI/UX | P5 |
| R-26 | Upcoming events first (date ascending); past events marked "Past" *(suggested)* | SHOULD | CRUD | P5 |
| R-27 | Pagination, 9 per page, keeps search and filter *(suggested)* | COULD | CRUD | P5 |
| R-28 | Event count from the database in the heading ("4 events") | SHOULD | UI/UX | P5 |

### Create / Edit Event
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-30 | Create event: title (required), description, category (required), event date (required), city (required), venue name, poster | MUST | CRUD | P5 |
| R-31 | Event date cannot be in the past **when creating** | MUST | CRUD | P5 |
| R-32 | Edit event with the form pre-filled; past date allowed if it was already past (D-07) | MUST | CRUD | P5 |
| R-33 | Validation errors shown under each field; same Zod schema on client and server | MUST | CRUD, Code quality | P5 |
| R-34 | Database `check` constraints match the Zod limits | SHOULD | CRUD | P5 |
| R-35 | Save button pending state ("Saving…", "Uploading poster…"), toast on success | MUST | UI/UX | P5 |

### Poster (cloud storage)
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-40 | Poster upload: JPG, PNG or WebP only, max 5 MB, rejected with a clear message otherwise | MUST | Storage | P6 |
| R-41 | Posters stored in Supabase Storage (private bucket, owner-only folder) | MUST | Storage | P6 |
| R-42 | Posters rendered from storage via server-made signed URLs on cards and detail | MUST | Storage | P6 |
| R-43 | Drag-and-drop with preview, remove and replace | SHOULD | Storage, UI/UX | P6 |
| R-44 | Old poster deleted on replace, remove and event delete (no orphans) | SHOULD | Storage | P6 |
| R-45 | Browser compression to WebP ≤ 1 MB before upload | SHOULD | Storage | P6 |
| R-46 | Events without a poster show a neutral placeholder, never a broken image | MUST | UI/UX | P6 |

### Event Details
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-50 | Detail page shows all event information and the poster | MUST | CRUD | P5 |
| R-51 | Current weather for the event's city: temperature, condition, humidity, wind | MUST | External API | P7 |
| R-52 | Short tip for attendees based on the weather (and category when relevant) | MUST | External API | P7 |
| R-53 | Map pin for the event's city (Leaflet + OpenStreetMap) | MUST | External API | P7 |
| R-54 | Edit action → edit page | MUST | CRUD | P5 |
| R-55 | Delete action with confirmation dialog naming the event | MUST | CRUD | P5 |
| R-56 | Unknown id or another user's event → not-found page | MUST | CRUD, Auth | P5 |
| R-57 | Note that weather is current, not the forecast for the event date *(suggested)* | SHOULD | External API | P7 |
| R-58 | Forecast for the event date when it is within 7 days (Open-Meteo daily) *(suggested)* | COULD | External API | P7 |

### Error handling
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-60 | Friendly message when the weather API fails, with **Try again** | MUST | External API | P7 |
| R-61 | Friendly "city not found" message, with **Try again** | MUST | External API | P7 |
| R-62 | No crashes on bad input: invalid ids, long text, odd characters, wrong file types | MUST | Code quality | P5–P8 |
| R-63 | Loading states while data loads (route `loading.tsx`, weather skeleton, map skeleton) | MUST | UI/UX | P5–P7 |
| R-64 | Route `error.tsx` with Retry; never raw errors on screen | MUST | Code quality | P5 |

### Technical
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-70 | Supabase Auth as the approved alternative to Firebase (D-01) | MUST | Auth | P4 |
| R-71 | Full CRUD for events in Supabase Postgres | MUST | CRUD | P5 |
| R-72 | RLS: each user can only see and change their own events and posters | MUST | CRUD, Storage | P5–P6 |
| R-73 | External API called from a protected route handler through `src/lib/http.ts`; key server-only | MUST | External API | P7 |
| R-74 | Responsive from 320 px to 1920 px, designed at 375 px first | MUST | UI/UX | P3–P8 |
| R-75 | Live public deployment on Vercel, auto-deploy from `main` | MUST | Deployment | P2 |
| R-76 | `npm run check` (lint, typecheck, unit tests, build) passes | MUST | Code quality | all |
| R-77 | Unit tests for event schema (past date) and weather advice/error mapping *(suggested)* | SHOULD | Code quality | P5, P7 |

### Deliverables
| ID | Requirement | Priority | Rubric | Phase |
|---|---|---|---|---|
| R-80 | Public GitHub repo, sensible Conventional Commits, proper `.gitignore` | MUST | Deployment, Docs | P2–P9 |
| R-81 | README: overview, `.env.example`, setup steps, architecture, API keys, sequential screenshots of each pipeline | MUST | Docs | P9 |
| R-82 | Live URL in the README | MUST | Deployment | P9 |
| R-83 | No real secrets committed | MUST | Deployment | all |
| R-84 | Demo account with 4–6 realistic events (some with posters, mixed categories) | SHOULD | Demo | P9 |
| R-85 | Demo script and code-defense answers | SHOULD | Demo | P9 |

## Rubric coverage
| Criterion | Marks | Requirements |
|---|---|---|
| UI/UX & Responsiveness | 10 | R-10, R-11, R-23–R-25, R-28, R-35, R-43, R-46, R-63, R-74 |
| Authentication | 15 | R-01–R-08, R-56, R-70 |
| Database & CRUD | 20 | R-20–R-22, R-26, R-27, R-30–R-34, R-50, R-54–R-56, R-71, R-72 |
| Cloud Storage | 10 | R-40–R-46, R-72 |
| External API | 15 | R-51–R-53, R-57, R-58, R-60, R-61, R-73 |
| Deployment | 15 | R-75, R-80, R-82, R-83 |
| Code Quality | 5 | R-33, R-62, R-64, R-76, R-77 |
| Documentation | 5 | R-80, R-81 |
| Live Demo & Defense | 5 | R-84, R-85 |

## Out of scope
- Public event listing, RSVPs, attendees, sharing events with other users (brief: each user sees only their own events; "share posters" = upload and display, see D-06)
- Profile page and avatar upload (the user menu shows name and email only)
- Password reset, email confirmation, OAuth providers
- Event times and time zones (date only, D-07)
- Multiple posters per event, image cropping
- Dark mode
- Realtime updates
