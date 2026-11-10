# 03 Design

Follows `web-design-system`. Tokens live only in `src/app/globals.css`.

## Logo
| Item | Value |
|---|---|
| Source | Built in code (`web-design-system` 2.4); no logo in the brief |
| Name · tagline | "EventHub" · "Community events" |
| Mark style | **A. Subject symbol, "Events, bookings, schedules" recipe**: calendar body in ink, two binder tabs and a dot in coral. The subject has a clear object (a calendar date). |
| Colors | Ink = `#1A1F36` (white on dark backgrounds) · accent = `#FF8A65` |
| Files | `src/components/brand/logo.tsx`, `src/app/icon.svg`, `src/app/apple-icon.tsx`, optional `src/app/opengraph-image.tsx`; delete `src/app/favicon.ico` and remove `favicon.ico` from the proxy matcher only if needed |
| Usage | Header: full, light tone, mark 32 px · Footer and auth dark panel: full, dark tone · Auth pages on mobile: mark 40–48 px · Below 360 px header: mark only |

## Colors: preset "Ink & Coral" (social, events)
| Role | Hex | Token |
|---|---|---|
| Dark | `#1A1F36` | `--brand-dark`, `--secondary` |
| Accent (main action) | `#FF8A65` | `--primary` |
| Accent hover | `#FF9E80` | `--brand-accent-hover` (lighter, so dark text contrast only rises) |
| Text on accent | `#1A1F36` | `--primary-foreground` |
| Link | `#2F5BD3` | `--brand-link`, `--ring` |
| Ink (body text) | `#1C2030` | `--foreground` |
| Muted text | `#5A6072` | `--muted-foreground` |
| Alt background | `#F3F4F8` | `--muted`, `--accent` (shadcn hover tint) |
| Border | `#D9E1EB` | `--border`, `--input` |
| Error | `#B42318` | `--destructive` |
| Success | `#1E7B4F` | `--brand-success` |
| Shadow tint | `rgb(26 31 54 / …)` | `--shadow-card/raised/header` (replace the starter's navy tint) |

Contrast (from the skill's measured table): white on dark 16.2 ✓ · **dark on accent 7.0 ✓** ·
link on white 5.9 ✓ · ink on white 16.2 ✓ · muted on white 6.3 ✓ · muted on alt 5.7 ✓ ·
error on white 6.6 ✓ · success on white 5.3 ✓ · **white on accent 2.3 ✗ (never used)**.

Category badges stay neutral (outline badge, ink text) — no extra colors per category. Weather
icons use the link color. Error red is only for errors and the delete action.

## Fonts: "Confident" pair (already wired in the starter's `layout.tsx`)
| Use | Font | Weights |
|---|---|---|
| Headings | Sora | 600, 700 |
| Body | Source Sans 3 | 400, 600 |

## Type and spacing
Scale from `web-design-system` 4; spacing steps only; page frame `max-w-7xl px-5 md:px-8 lg:px-12`.
Radii: inputs/buttons `rounded-md`, cards/posters/map/dialogs `rounded-xl`, badges/avatar `rounded-full`.
Cards: border only, no shadow; clickable event cards lift 4 px with `shadow-raised` on hover.

## Components used
Buttons (accent / dark / outline / ghost / destructive in the dialog only), event cards (border,
4:3 poster frame), category pill filter strip, search input with icon, `Field` + `Controller`
forms (`FormTextField`), `Select` for category, native date input, poster dropzone with preview,
`AlertDialog` delete, `sonner` toasts, `Skeleton` for list/detail/weather/map, empty states,
`Badge` for category and "Past", avatar `DropdownMenu` user menu, Leaflet map.
Icons: lucide only, `strokeWidth={1.75}` — `CalendarDays`, `MapPin`, `Building2` (venue),
`Search`, `Plus`, `Pencil`, `Trash2`, `ImagePlus`, `ImageOff`, `RefreshCw`, weather icons.

## Motion
`MotionConfig reducedMotion="user"`; card hover lift 150 ms; event cards fade in once
(`AnimatePresence` on the list, COULD). Nothing moves on its own.

## Tone of copy
Plain and about local events. One word for one thing: always **event**, **poster**, **city**,
**venue**. Examples:
- "Plan local events, with the weather already checked."
- "No events yet. Create your first workshop, meetup or match."
- "Poster is larger than 5 MB. Choose a smaller image."
- "Rain expected in Lahore. Bring umbrellas or plan an indoor backup."
- "Event date can't be in the past."
Seed/demo data: "Saturday Futsal League, Lahore", "Intro to Photography Workshop, Islamabad",
"Clean Ravi River Drive, Lahore", "Basant Kite Festival, Lahore", "Karachi JS Meetup".
