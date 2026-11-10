# 04 Packages

Chosen with `initial-setup-packages`. The starter already has the full **core set** installed
(see `package.json`). Only feature packages are added.

## Already in the starter (core)
| Package | Type | Why |
|---|---|---|
| next 16, react 19, typescript, tailwindcss 4, eslint | dep / dev | Framework |
| @supabase/supabase-js, @supabase/ssr | dep | Auth, Postgres, Storage; cookie sessions (R-01–R-08, R-71, R-41) |
| zod, react-hook-form, @hookform/resolvers | dep | Shared client/server validation (R-33) |
| axios | dep | External API client in `src/lib/http.ts` (R-73) |
| shadcn (Base UI), class-variance-authority, tw-animate-css, lucide-react | dep | Components and icons |
| sonner, motion, next-themes, date-fns | dep | Toasts, motion, theme provider, date formatting ("Sat 14 Dec 2026") |
| prettier, prettier-plugin-tailwindcss | dev | Formatting |
| vitest, @vitejs/plugin-react, jsdom, @testing-library/* | dev | Unit tests (R-77) |
| @playwright/test | dev | E2E smoke test (browsers installed globally — no `npx playwright install`) |

## Feature packages to add in P1
| Package | Type | Why (requirement) |
|---|---|---|
| react-dropzone | dep | R-40, R-43 poster drag-and-drop with type/size rejection |
| browser-image-compression | dep | R-45 compress poster to WebP ≤ 1 MB before upload |
| leaflet, react-leaflet | dep | R-53 map pin for the event's city (OpenStreetMap, no key) |
| @types/leaflet | dev | Types for Leaflet |

```powershell
npm install react-dropzone browser-image-compression leaflet react-leaflet
npm install -D @types/leaflet
```
Weather needs nothing extra: axios through `src/lib/http.ts`.

## shadcn components
Already present: button input label textarea card dialog field skeleton sonner dropdown-menu
avatar badge table select alert-dialog separator sheet.
No `form` component on Base UI: forms use `FormTextField` / `Field` + `Controller`.
Nothing else to add (category filter is a strip of `buttonVariants` links).

## Not used (and why)
| Package | Instead |
|---|---|
| firebase | Supabase Auth, the approved alternative (D-01) |
| prisma, drizzle-orm | `@supabase/supabase-js` with RLS |
| next-auth, @clerk/nextjs | Supabase Auth via `@supabase/ssr` |
| multer, express | Route handler `/api/upload` with `FormData` |
| @vis.gl/react-google-maps | Leaflet + OSM, no key or billing |
| moment | date-fns |
| cloudinary | Supabase Storage (same provider as auth and data) |
