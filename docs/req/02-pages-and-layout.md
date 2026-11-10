# 02 Pages and Layout

Follows `web-design-system` (Sections 5, 7, 9, 10). Mobile (375) is designed first.

## Routes
| Route | Access | Purpose | Main action (accent) |
|---|---|---|---|
| `/` | Public | Landing: what EventHub does | **Sign up** |
| `/signup` | Public (logged in → `/dashboard`) | Create account | **Create account** |
| `/login` | Public (logged in → `/dashboard`) | Log in | **Log in** |
| `/dashboard` | Logged in | My Events: search, category filter, cards | **New event** |
| `/events/new` | Logged in | Create event form | **Create event** |
| `/events/[id]` | Owner | Details + poster + weather + map | **Edit event** (outline; no accent needed — see note) |
| `/events/[id]/edit` | Owner | Edit event form | **Save changes** |
| `/auth/callback` | Public | Supabase code exchange (starter) | — |
| `/api/upload` | Logged in (401) | Poster upload (starter) | — |
| `/api/weather?city=` | Logged in (401) | Weather + coordinates for a city | — |

Note on `/events/[id]`: the page's strongest element is the poster + title. **Edit** is the one
accent button; **Delete** is an outline button with destructive text; "Try again" in the
weather card is outline.

Forms are pages, not dialogs: the event has 7 fields plus a poster (`web-database-crud` 7.2,
"more than about 6 fields").

`proxy.ts` protected prefixes: `/dashboard`, `/events`. Remove the unused `/profile`, `/items`.

## App shell (all logged-in pages)
```
Desktop (≥1024)
┌───────────────────────────────────────────────────────────┐
│ [Mark] EventHub          My events            (AB) avatar │  sticky, shadow-header on scroll
├───────────────────────────────────────────────────────────┤
│ <main id="main"> …                                         │
├───────────────────────────────────────────────────────────┤
│ footer: Logo (dark tone) · "Weather by OpenWeatherMap · Maps © OpenStreetMap" │
└───────────────────────────────────────────────────────────┘
Mobile (375)
┌───────────────────────┐
│ [Mark] EventHub  (AB) │   nav has one link, so no Sheet; avatar menu holds "My events" + Log out
└───────────────────────┘
```
Logged out (landing, auth): header shows Logo + "Log in" (ghost) + "Sign up" (accent, the one allowed header CTA).

## Layouts

### `/` Landing
```
Desktop (≥1024)
┌──────────────────────────────────────────────────────────────┐
│ Logo                                    Log in  [Sign up]    │
├──────────────────────────────────────────────────────────────┤
│ H1 Plan local events, with the weather   ┌────────────────┐  │  white, split 7fr/5fr
│ already checked.                          │ sample event   │  │
│ Lead: create workshops, meetups…          │ card mock: real│  │  (static, built from our own
│ [Sign up — it's free]  Log in →           │ UI components) │  │   EventCard + WeatherCard look)
│                                           └────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ H2 What you can do       (alt background)                    │
│ 1 Create events  2 Check the weather  3 Share posters        │  numbered list, not icon cards
├──────────────────────────────────────────────────────────────┤
│ Category strip: Workshop · Meetup · Sports · Cultural · Charity  (white, one line each with example) │
├──────────────────────────────────────────────────────────────┤
│ Dark band: "Your first event takes two minutes." [Create account] │
├──────────────────────────────────────────────────────────────┤
│ Footer                                                       │
└──────────────────────────────────────────────────────────────┘
Mobile (375)
┌────────────────────┐
│ Logo   Log in [Sign up]│  (Sign up only below 360 px; Log in in hero)
│ H1 (36px)          │
│ Lead               │
│ [Sign up] full     │
│ Log in →           │
│ sample card        │
│ 1 / 2 / 3 stacked  │
│ categories list    │
│ dark band + button │
└────────────────────┘
```
No invented numbers, testimonials or stock people (`web-design-system` 12).

### `/signup`, `/login`
```
Desktop (≥1024)                                   Mobile (375)
┌──────────────────────┬───────────────────────┐  ┌───────────────────┐
│ dark panel:          │  H1 Create your       │  │ Logo (mark 40px)  │
│ Logo (dark tone)     │  account              │  │ H1                │
│ "Plan events, check  │  Full name            │  │ fields (44px,16px)│
│ the weather, share   │  Email                │  │ [Create account]  │
│ the poster."         │  Password (+ helper)  │  │ full width        │
│                      │  Confirm password     │  │ Already have an   │
│                      │  [Create account]     │  │ account? Log in   │
│                      │  Already have… Log in │  └───────────────────┘
└──────────────────────┴───────────────────────┘
```
Form `max-w-sm`. Login: Email, Password, server error alert, "New here? Create an account".
States: field errors under each field · server error alert · pending "Creating account…".

### `/dashboard` My Events
```
Desktop (≥1024)
┌──────────────────────────────────────────────────────────────┐
│ App shell header                                             │
├──────────────────────────────────────────────────────────────┤
│ H1 My events · 4 events                        [+ New event] │
│ [🔍 Search by title…………………………]                              │
│ (All) (Workshop) (Meetup) (Sports) (Cultural) (Charity)      │  pill links, aria-current
│ ┌────────┐ ┌────────┐ ┌────────┐                             │
│ │ poster │ │ poster │ │ poster │   3 columns, 4:3 poster     │
│ │ Badge  │ │        │ │        │   category badge            │
│ │ Title  │ │        │ │        │   line-clamp-2              │
│ │ date·city│ │      │ │        │   "Sat 14 Dec 2026 · Lahore"│
│ └────────┘ └────────┘ └────────┘   "Past" badge if past      │
│            ‹ Prev  Page 1 of 2  Next ›                       │
└──────────────────────────────────────────────────────────────┘
Mobile (375)
┌────────────────────┐
│ H1 My events       │
│ 4 events           │
│ [+ New event] full │
│ [Search………]       │
│ (All)(Workshop)(M→ │  pill strip scrolls in its own overflow-x-auto row
│ ┌────────────────┐ │
│ │ poster 4:3     │ │  1 column; sm: 2 columns
│ │ title, meta    │ │
│ └────────────────┘ │
└────────────────────┘
```
States:
- **loading** (`dashboard/loading.tsx`): heading + toolbar skeleton + 6 skeleton cards
- **empty** (no events at all): CalendarPlus icon, "No events yet", "Create your first workshop, meetup or match.", [Create your first event] (this replaces the header button as the accent)
- **no results**: "No events match “yoga” in Sports.", [Clear filters] outline
- **error** (`(app)/error.tsx`): "We couldn't load your events." + Try again
- **success**: cards; toast after create/delete arrives from the action

Whole card is a link (stretched) → `/events/[id]`, lift 4 px on hover/focus.

### `/events/new` and `/events/[id]/edit` (one `EventForm` component)
```
Desktop (≥1024)                                      Mobile (375)
┌──────────────────────────────────────────────┐    ┌────────────────────┐
│ ← My events                                  │    │ ← My events        │
│ H1 New event                                 │    │ H1 New event       │
│ ┌──────────────────────────┐ ┌─────────────┐ │    │ Title              │
│ │ Title *                  │ │ Poster      │ │    │ Category *  ▾      │
│ │ Category * ▾ │ Date *    │ │ dropzone /  │ │    │ Date *             │
│ │ City *       │ Venue     │ │ preview 4:3 │ │    │ City *             │
│ │ Description (textarea)   │ │ JPG/PNG/WebP│ │    │ Venue              │
│ │                          │ │ up to 5 MB  │ │    │ Description        │
│ └──────────────────────────┘ └─────────────┘ │    │ Poster dropzone    │
│                     Cancel  [Create event]   │    │ [Create event] full│
└──────────────────────────────────────────────┘    │ Cancel             │
  lg: grid 7fr / 5fr, form max-w-5xl                 └────────────────────┘
```
Fields: one column on phones; Category+Date and City+Venue pair on `sm`+.
Date input `min={today}` on create. Error under every field. Required marked with "(required)"
text, optional with "(optional)".
States: pending "Uploading poster…" then "Saving…" (button disabled) · server field errors mapped to fields · toast "Event created." → redirect to `/events/[id]`.
Edit page loading: form skeleton. Unknown id → not-found.

### `/events/[id]` Details
```
Desktop (≥1024)
┌──────────────────────────────────────────────────────────────┐
│ ← My events                                                  │
│ ┌──────────────────────────────┐  Badge Sports  (Past)       │
│ │                              │  H1 Saturday Futsal League  │
│ │ poster (aspect 3:4 or 4:3,   │  📅 Sat 14 Dec 2026         │
│ │ object-contain on alt bg)    │  📍 Model Town Ground, Lahore│
│ │                              │  [Edit event]  [Delete]     │
│ └──────────────────────────────┘  Description (max-w-prose) │
├──────────────────────────────────────────────────────────────┤
│ ┌── Weather in Lahore ─────────┐  ┌── Map ─────────────────┐ │  alt background band
│ │ ☀ 24°C  clear sky        ↻   │  │ Leaflet, pin on city   │ │  lg: 2 columns
│ │ Tip: Good conditions for an  │  │ h-72 md:h-96 rounded-xl│ │
│ │ outdoor match.               │  │                        │ │
│ │ Feels · Humidity · Wind      │  │                        │ │
│ │ Current weather, not the     │  │ © OpenStreetMap        │ │
│ │ forecast for 14 Dec. Data: … │  └────────────────────────┘ │
│ └──────────────────────────────┘                             │
└──────────────────────────────────────────────────────────────┘
Mobile (375)
┌────────────────────┐
│ ← My events        │
│ Badge · Past       │
│ H1 title           │
│ date · venue, city │
│ [Edit event] full  │
│ [Delete] full      │
│ poster full width  │
│ description        │
│ Weather card       │
│ Map h-72           │
└────────────────────┘
```
Posters are often portrait: show with `object-contain` on `bg-muted` in a fixed 4:3 frame on
cards and a 3:4 frame on the detail page, so nothing is cropped (D-06).

States:
- **page loading** (`events/[id]/loading.tsx`): poster skeleton + text lines
- **not found** (`events/[id]/not-found.tsx`): "This event doesn't exist or was deleted." + link to My events
- **weather loading**: skeleton with the card's shape · **weather error**: message + Try again · **city not found**: "We couldn't find “Xyzabc”. Check the city name in Edit event." + Try again + Edit link
- **map**: skeleton while mounting · uses lat/lon from the weather response; when weather fails the map shows "Map unavailable until the city is found." (D-04)
- **delete**: AlertDialog "Delete “Saturday Futsal League”?" → toast "Event deleted." → `/dashboard`

## Main flow (demo order)
1. Landing → **Sign up** → empty dashboard with the empty state
2. **Create your first event** → fill form, try a past date (error under Date), upload a poster → toast → details page
3. Details: poster, weather card with tip, map pin
4. **Edit event** → change city → weather and map update
5. Back to dashboard → search by title, filter by category
6. Delete an event → confirmation → toast → gone from the list
7. Log out → open `/dashboard` → redirected to login
