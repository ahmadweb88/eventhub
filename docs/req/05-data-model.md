# 05 Data Model

Follows `web-database-crud` (Sections 2–4) and `web-file-storage` (Section 3).

## Tables

### `profiles` (already in the starter: `20261109000000_create_profiles.sql`)
| Field | Type | Rules |
|---|---|---|
| id | uuid | PK, → `auth.users(id)` on delete cascade |
| full_name | text | ≤ 60 chars, from sign-up metadata via trigger `handle_new_user` |
| avatar_path | text | unused (out of scope) |
| created_at, updated_at | timestamptz | default now() |

RLS: owner select, owner update. Insert only via the security-definer trigger.

### `events` (new: `<timestamp>_create_events.sql`)
| Field | Type | Rules |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| user_id | uuid | not null, default `auth.uid()`, → `auth.users(id)` on delete cascade; never sent by the client |
| title | text | not null, `char_length between 3 and 100` |
| description | text | nullable, `≤ 2000` |
| category | text | not null, `check (category in ('workshop','meetup','sports','cultural','charity'))` |
| event_date | date | not null (calendar date, no time zone, D-07) |
| city | text | not null, `char_length between 2 and 80` |
| venue | text | nullable, `≤ 120` |
| poster_path | text | nullable, `≤ 200`, storage path `{user_id}/{uuid}.webp` |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now(), trigger `set_updated_at` |

The "not in the past on create" rule lives in Zod + server action, not in a DB check, because
edits may keep an existing past date (D-07).

Indexes:
- `events_user_date_idx on (user_id, event_date)` — list order (upcoming first)
- `events_user_category_idx on (user_id, category)` — category filter

### RLS policies on `events` (all `to authenticated`)
| Policy | Operation | Rule |
|---|---|---|
| Events: owner can read | select | `(select auth.uid()) = user_id` |
| Events: owner can create | insert | with check `(select auth.uid()) = user_id` |
| Events: owner can update | update | using + with check `(select auth.uid()) = user_id` |
| Events: owner can delete | delete | `(select auth.uid()) = user_id` |

Function `public.set_updated_at()` with `set search_path = ''`. Run the Supabase security
advisor after applying; fix every warning.

## Storage

### Bucket `images` (already in the starter: `20261109000100_create_images_bucket.sql`)
| Setting | Value |
|---|---|
| Public | **false** — signed URLs only (1 hour, made on the server) |
| File size limit | 5 242 880 bytes (5 MB, matches the brief) |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Path | `{user_id}/{uuid}.{ext}` (random name, never the original file name) |

Policies on `storage.objects` (to authenticated): select, insert, update, delete, each with
`bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text`.

Bucket name stays `images` (starter); posters are the only files in it (D-06).

### Size limits in each layer (D-05)
| Layer | Limit | Message |
|---|---|---|
| Browser dropzone (before compression) | 5 MB, JPG/PNG/WebP | "Poster is larger than 5 MB. Choose a smaller image." / "Only JPG, PNG or WebP images are allowed." |
| Browser compression | → WebP, ≤ 1 MB, max 1600 px | — |
| `/api/upload` | 4 MB (Vercel 4.5 MB body limit), signature check | "This file is not a valid image." |
| Bucket | 5 MB, MIME list | final guard |

## Zod schemas: `src/lib/validations/event.ts`
```ts
export const EVENT_CATEGORIES = ['workshop', 'meetup', 'sports', 'cultural', 'charity'] as const
export const CATEGORY_LABELS = { workshop: 'Workshop', meetup: 'Meetup', sports: 'Sports',
  cultural: 'Cultural', charity: 'Charity' } satisfies Record<EventCategory, string>

export const eventSchema = z.object({
  title: z.string().trim().min(3, 'Title needs at least 3 characters.').max(100, 'Keep the title under 100 characters.'),
  description: z.string().trim().max(2000, 'Keep the description under 2000 characters.'),
  category: z.enum(EVENT_CATEGORIES, { message: 'Choose a category.' }),
  eventDate: z.string().min(1, 'Choose the event date.')
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)), 'Enter a valid date.'),
  city: z.string().trim().min(2, 'Enter the city.').max(80, 'City name is too long.')
    .regex(/^[\p{L}\s.'-]+$/u, 'Use letters only for the city name.'),
  venue: z.string().trim().max(120, 'Keep the venue under 120 characters.'),
  posterPath: z.string().max(200).nullable(),
})

/** Create only: date must be today or later (D-07). */
export const createEventSchema = eventSchema.refine(
  (v) => v.eventDate >= todayIso(), { message: "Event date can't be in the past.", path: ['eventDate'] })

export const eventIdSchema = z.string().uuid('Invalid event.')
export type EventInput = z.infer<typeof eventSchema>

export function toEventRow(v: EventInput) {
  return { title: v.title, description: v.description || null, category: v.category,
    event_date: v.eventDate, city: v.city, venue: v.venue || null, poster_path: v.posterPath }
}
```
`todayIso()` (in `src/lib/dates.ts`) returns the local `yyyy-MM-dd` via `date-fns` `format`.
On the server (UTC) it can be one day behind Pakistan time, so the server is at most one day
more lenient than the browser; never stricter (D-07).

The same city regex is reused by the `/api/weather` query schema.

## Types
`src/types/database.ts` generated by the Supabase connector after each migration. Both
clients typed with `Database`. Row type `Event` exported from `src/lib/data/event-types.ts`
(client-safe). Note: name the TS type `EventRow` to avoid clashing with the DOM `Event` type.

## Data layer: `src/lib/data/events.ts` (server only)
- `listEvents({ q, category, page })` — `requireUser()`, `.eq('user_id')`, escaped `ilike` on title, category whitelist, order `event_date asc` then `created_at desc`, range of 9, `count: 'exact'`, batch signed URLs → `posterUrl`.
- `getEvent(id)` — validates id with `eventIdSchema` (invalid → `null` → not-found), `maybeSingle()`, signed URL.

## Server actions: `src/app/(app)/events/actions.ts`
`createEvent(input)`, `updateEvent(id, input)`, `deleteEvent(id)` returning `ActionResult`.
Zod first → `requireUser()` → `isOwnPath(posterPath)` → write → `.select()` to detect not-found →
storage cleanup (failed insert, replaced poster, delete) → `revalidatePath('/dashboard')` and
`/events/[id]`.
