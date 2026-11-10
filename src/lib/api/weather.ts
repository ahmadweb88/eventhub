import { z } from 'zod'
import { cached } from '@/lib/cache'
import { ApiError, http, withRetry } from '@/lib/http'
import type { WeatherCondition, WeatherSummary } from './weather-types'

const notFound = (city: string) =>
  new ApiError(
    404,
    `We couldn't find “${city}”. Check the city name in Edit event.`,
  )

// ---------- Provider 1: OpenWeatherMap (needs OPENWEATHER_API_KEY) ----------
const owmSchema = z.object({
  name: z.string(),
  coord: z.object({ lat: z.number(), lon: z.number() }),
  sys: z.object({ country: z.string().optional() }),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({ speed: z.number() }), // m/s with units=metric
  weather: z
    .array(z.object({ main: z.string(), description: z.string() }))
    .min(1),
})

export function owmCondition(main: string): WeatherCondition {
  const m = main.toLowerCase()
  if (m === 'clear') return 'clear'
  if (m === 'clouds') return 'clouds'
  if (m === 'rain') return 'rain'
  if (m === 'drizzle') return 'drizzle'
  if (m === 'thunderstorm') return 'thunder'
  if (m === 'snow') return 'snow'
  return 'fog' // mist, haze, smoke, dust…
}

async function fromOpenWeatherMap(city: string, key: string) {
  const { data } = await withRetry(() =>
    http.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, units: 'metric', appid: key },
    }),
  )
  const w = owmSchema.parse(data)
  return round({
    city: w.name,
    country: w.sys.country ?? null,
    tempC: w.main.temp,
    feelsLikeC: w.main.feels_like,
    humidity: w.main.humidity,
    windKmh: w.wind.speed * 3.6,
    condition: owmCondition(w.weather[0].main),
    description: w.weather[0].description,
    lat: w.coord.lat,
    lon: w.coord.lon,
    source: 'OpenWeatherMap',
  })
}

// ---------- Provider 2: Open-Meteo (no key; geocoding + current weather) ----------
const geoSchema = z.object({
  results: z
    .array(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country_code: z.string().optional(),
      }),
    )
    .optional(),
})

const meteoSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    relative_humidity_2m: z.number(),
    wind_speed_10m: z.number(), // km/h
    weather_code: z.number(),
  }),
})

export function wmoCondition(code: number): [WeatherCondition, string] {
  if (code === 0) return ['clear', 'clear sky']
  if (code <= 3) return ['clouds', code === 3 ? 'overcast' : 'partly cloudy']
  if (code === 45 || code === 48) return ['fog', 'fog']
  if (code >= 51 && code <= 57) return ['drizzle', 'drizzle']
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return ['rain', 'rain']
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return ['snow', 'snow']
  if (code >= 95) return ['thunder', 'thunderstorm']
  return ['clouds', 'cloudy']
}

async function fromOpenMeteo(city: string) {
  const { data: geoData } = await withRetry(() =>
    http.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: city, count: 1, language: 'en' },
    }),
  )
  const place = geoSchema.parse(geoData).results?.[0]
  if (!place) throw notFound(city)

  const { data } = await withRetry(() =>
    http.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: place.latitude,
        longitude: place.longitude,
        current:
          'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
        timezone: 'auto',
      },
    }),
  )
  const c = meteoSchema.parse(data).current
  const [condition, description] = wmoCondition(c.weather_code)
  return round({
    city: place.name,
    country: place.country_code ?? null,
    tempC: c.temperature_2m,
    feelsLikeC: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    windKmh: c.wind_speed_10m,
    condition,
    description,
    lat: place.latitude,
    lon: place.longitude,
    source: 'Open-Meteo',
  })
}

function round(w: WeatherSummary): WeatherSummary {
  return {
    ...w,
    tempC: Math.round(w.tempC),
    feelsLikeC: Math.round(w.feelsLikeC),
    humidity: Math.round(w.humidity),
    windKmh: Math.round(w.windKmh),
  }
}

/** Current weather for a city: OpenWeatherMap first, Open-Meteo as a keyless fallback. */
export async function getWeather(city: string): Promise<WeatherSummary> {
  const key = process.env.OPENWEATHER_API_KEY
  return cached(`weather:${city.toLowerCase()}`, 10 * 60_000, async () => {
    if (key) {
      try {
        return await fromOpenWeatherMap(city, key)
      } catch (error) {
        // City not found is a real answer; anything else falls back
        if (
          (error as { response?: { status?: number } }).response?.status === 404
        )
          throw notFound(city)
        console.warn('OpenWeatherMap failed, falling back to Open-Meteo.')
      }
    }
    return fromOpenMeteo(city)
  })
}
