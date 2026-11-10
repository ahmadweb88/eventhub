/** Client-safe weather types and the attendee tip (no server imports). */
export type WeatherCondition =
  'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunder' | 'snow' | 'fog'

export type WeatherSummary = {
  city: string
  country: string | null
  tempC: number
  feelsLikeC: number
  humidity: number
  windKmh: number
  condition: WeatherCondition
  description: string
  lat: number
  lon: number
  source: 'OpenWeatherMap' | 'Open-Meteo'
}

const OUTDOOR = new Set(['sports', 'charity', 'cultural'])

/** A short tip for attendees, from the weather and the event's category. */
export function adviceFor(
  w: Pick<WeatherSummary, 'condition' | 'tempC' | 'windKmh'>,
  category?: string,
): string {
  const outdoor = category ? OUTDOOR.has(category) : false

  if (w.condition === 'thunder')
    return 'Thunderstorms expected. Move the event indoors or postpone.'
  if (w.condition === 'rain' || w.condition === 'drizzle')
    return outdoor
      ? 'Rain expected. Bring umbrellas and plan an indoor backup.'
      : 'Rain expected. Attendees should bring umbrellas.'
  if (w.condition === 'snow')
    return 'Snow expected. Dress warmly and check road conditions.'
  if (w.tempC >= 35)
    return category === 'sports'
      ? 'Very hot. Bring water, avoid the midday sun and schedule breaks.'
      : 'Very hot. Bring water and avoid the midday sun.'
  if (w.tempC <= 5) return 'Cold. Attendees should bring warm jackets.'
  if (w.windKmh >= 40) return 'Strong wind. Secure banners, tents and posters.'
  return outdoor
    ? 'Good conditions for an outdoor event.'
    : 'Good conditions for travelling to the venue.'
}
