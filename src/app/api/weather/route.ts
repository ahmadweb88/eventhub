import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getWeather } from '@/lib/api/weather'
import { getUser } from '@/lib/auth'
import { toApiError } from '@/lib/http'
import { cityField } from '@/lib/validations/event'

const querySchema = z.object({ city: cityField })

export async function GET(request: Request) {
  const user = await getUser()
  if (!user)
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 })

  const parsed = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  )
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    )

  try {
    const data = await getWeather(parsed.data.city)
    return NextResponse.json(
      { data },
      { headers: { 'Cache-Control': 'private, max-age=300' } },
    )
  } catch (error) {
    const e = toApiError(
      error,
      `We couldn't find “${parsed.data.city}”. Check the city name in Edit event.`,
    )
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
}
