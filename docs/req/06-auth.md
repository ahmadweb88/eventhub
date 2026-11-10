# 06 Auth

Follows `web-auth-supabase`. Supabase Auth is the approved alternative to Firebase
Authentication (D-01). The starter already contains the clients, proxy, auth helpers, auth
actions, login/sign-up pages, callback route and user menu; P4 is mostly checking, connecting
and restyling.

## Pages
| Route | Fields | Action | Success | Errors |
|---|---|---|---|---|
| `/signup` | Full name, Email, Password, Confirm password | `signUp` | → `/dashboard` (Confirm email off) | under fields; alert for "account exists", rate limit |
| `/login` | Email, Password | `signIn(values, next)` | → `next` or `/dashboard` | "Email or password is incorrect." |
| user menu | — | `signOut` | → `/login` | — |

Password rule (shared `signupSchema`): 8–72 chars, at least one letter and one number;
helper text under the field. Full name 2–60 chars, stored as `full_name` user metadata → copied
to `profiles` by the trigger.

## Three protection layers
| Layer | Where | Rule |
|---|---|---|
| 1. Proxy | `src/proxy.ts` → `src/lib/supabase/proxy.ts` | Refresh session every request. `PROTECTED_PREFIXES = ['/dashboard', '/events']`. Logged out → `/login?next=<path>`. `AUTH_PAGES = ['/login', '/signup']` → logged in goes to `/dashboard`. Redirects carry cookies. |
| 2. Server check | `requireUser()` / `getUser()` | Top of `/dashboard`, `/events/new`, `/events/[id]`, `/events/[id]/edit`, all event server actions, `/api/upload` and `/api/weather` (route handlers return `401` JSON) |
| 3. Database | RLS | `events`, `profiles`, `storage.objects` (images bucket) all owner-only |

Authorization always uses `supabase.auth.getUser()`, never `getSession()`. No `service_role`
key anywhere. `next` redirect must start with `/` and not `//`.

## Profile data
| Field | Source | Used in |
|---|---|---|
| full_name | sign-up form → user metadata → `profiles` trigger | Dashboard greeting ("Hi Ayesha"), user menu |
| email | `auth.users` | User menu |

No profile page (out of scope): remove the Profile item from `user-menu.tsx` if present.

## Supabase dashboard settings (P1/P2, user may need to do these)
| Setting | Value |
|---|---|
| Email → Confirm email | **Off** (demo sign-ups must not hit the mail rate limit) |
| Site URL | live Vercel URL (after P2) |
| Redirect URLs | `http://localhost:3000/**`, `https://<app>.vercel.app/**` |

## Checks
From `web-auth-supabase` Section 7: sign-up lands on dashboard with name · duplicate email
message · field errors without a request · wrong password message · refresh keeps session ·
logout → login and Back shows no data · `/dashboard` and `/events/<id>` logged out →
`/login?next=…` → back after login · logged in `/login` → `/dashboard` · `/api/weather` and
`/api/upload` logged out → 401.
