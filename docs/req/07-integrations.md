# 07 Integrations

Follows `web-external-api`. All external calls run on the server through `src/lib/http.ts`
(axios) from a protected route handler. Keys never reach the browser.

## APIs
| API | Endpoint | Used for | Called from | Env variable | Key |
|---|---|---|---|---|---|
| **OpenWeatherMap** Current Weather (primary) | `GET https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid=…` | Temperature, condition, humidity, wind, city coordinates | `src/lib/api/weather.ts` ← `/api/weather` | `OPENWEATHER_API_KEY` (server only) | Yes, free tier; new keys can take up to ~2 h to activate |
| **Open-Meteo** Geocoding + Forecast (fallback) | `geocoding-api.open-meteo.com/v1/search?name=…&count=1` then `api.open-meteo.com/v1/forecast?latitude&longitude&current=…` | Same data when OWM has no key, rejects the key, or is down | same service | none | No |
| **OpenStreetMap tiles** via Leaflet | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | Map pin at the coordinates returned by `/api/weather` | `src/components/events/event-map.tsx` (client, `dynamic(..., { ssr: false })`) | none | No; attribution required |
| *(COULD, R-58)* Open-Meteo daily forecast | `api.open-meteo.com/v1/forecast?daily=…&start_date=&end_date=` | Forecast on the event date when it's within 7 days | same service | none | No |

## Files
```
src/lib/http.ts                 ← add ApiError, toApiError, withRetry (keep getApiErrorMessage if used)
src/lib/cache.ts                ← in-memory TTL cache (10 min per city)
src/lib/api/weather.ts          ← providers, Zod response schemas, WeatherSummary, adviceFor(weather, category)
src/lib/api/weather.test.ts     ← advice + error mapping tests
src/app/api/weather/route.ts    ← getUser() → 401, Zod query → 400, service → status-mapped errors
src/components/events/weather-card.tsx  ← client: loading / error / not-found / success + retry; passes coords up
src/components/events/weather-icon.tsx
src/components/events/event-map.tsx     ← Leaflet, h-72 md:h-96, skeleton while mounting
src/components/events/event-insights.tsx← client wrapper: one fetch feeds WeatherCard + EventMap
```

## Our type (the UI only sees this)
```ts
type WeatherSummary = {
  city: string; country: string | null
  tempC: number; feelsLikeC: number; humidity: number; windKmh: number
  condition: 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunder' | 'snow' | 'fog'
  description: string; lat: number; lon: number
  tip: string                        // attendee tip
  source: 'OpenWeatherMap' | 'Open-Meteo'
}
```

## Attendee tip (meaningful use, R-52)
`adviceFor({ condition, tempC, windKmh }, category)` — the weather sentence first, then an
event-aware addition for outdoor-leaning categories (sports, charity, cultural):
| Condition | Tip |
|---|---|
| thunder | "Thunderstorms expected. Move the event indoors or postpone." |
| rain / drizzle | "Rain expected. Bring umbrellas" + (outdoor) " and plan an indoor backup." |
| snow | "Snow expected. Dress warmly and check road conditions." |
| ≥ 35 °C | "Very hot. Bring water and avoid the midday sun" + (sports) " — schedule breaks." |
| ≤ 5 °C | "Cold. Attendees should bring warm jackets." |
| wind ≥ 40 km/h | "Strong wind. Secure banners, tents and posters." |
| otherwise | "Good conditions" + (outdoor) " for an outdoor event." / " for travelling to the venue." |

Plus R-57: small text under the card: "Current weather in {city}. The forecast for {event date}
may differ." (hidden when the event is today).

## Route `/api/weather?city=` status codes
| Case | Status | Message shown |
|---|---|---|
| Not logged in | 401 | "Please log in." |
| Missing / invalid city | 400 | Zod message ("Use letters only for the city name.") |
| City not found | 404 | "We couldn't find “{city}”. Check the city name in Edit event." |
| Upstream timeout (8 s) | 504 | "The weather service took too long to respond. Please try again." |
| Upstream 5xx / unreachable | 502 | "The weather service is having problems. Please try again." |
| Bad key / rate limit (after fallback also fails) | 503 | "The weather service is temporarily unavailable." |
| Response shape changed (ZodError) / unexpected | 500 | "Something went wrong. Please try again." |

Retry once on timeout/5xx (`withRetry`), cache 10 min per lower-cased city, response header
`Cache-Control: private, max-age=300`.

## UI states (detail page)
| State | Weather card | Map |
|---|---|---|
| Loading | skeleton: big temp line, description, 3 stat tiles | skeleton `h-72 md:h-96 rounded-xl` |
| Success | icon + °C + description, tip in `bg-muted`, Feels / Humidity / Wind, "Data: OpenWeatherMap", refresh button | pin + popup "{venue}, {city}" |
| City not found (404) | message + **Try again** + "Edit event" link | "Map unavailable until the city is found." |
| Other error | message + **Try again** | "Map unavailable right now." |

`aria-live="polite"` on the card; Retry and Refresh are 44 px.

## Environment variables
| Name | Where | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local`, Vercel, `.env.example` (name only) | Yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same | Yes (safe because of RLS) |
| `OPENWEATHER_API_KEY` | `.env.local`, Vercel Production + Development, `.env.example` (name only) | **No, server only** |

Without `OPENWEATHER_API_KEY` the app still works through Open-Meteo (shows "Data: Open-Meteo").

## Fallback / demo safety
- Create the OWM key in P1 so it's active by P7. If it's still 401, the fallback covers it.
- `next.config.ts` `images.remotePatterns` for `*.supabase.co/storage/v1/object/**` (posters);
  Leaflet tiles are plain `<img>`, no config needed.
- Leaflet marker icons from unpkg (`leaflet@1.9.4`) as in the skill, or copy them to `public/leaflet/`.
