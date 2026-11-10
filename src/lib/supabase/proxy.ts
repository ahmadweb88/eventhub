import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from './env'

// Edit these two lists to match docs/req/02-pages-and-layout.md
const PROTECTED_PREFIXES = ['/dashboard', '/events']
const AUTH_PAGES = ['/login', '/signup']

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  // A fresh copy has no .env.local yet. requireUser() still sends protected pages to /login.
  if (!isSupabaseConfigured) return response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Don't put code between createServerClient and getUser(): it refreshes the session.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  )
  const isAuthPage = AUTH_PAGES.includes(path)

  if (!user && isProtected) {
    return redirectWithCookies(request, response, '/login', { next: path })
  }
  if (user && isAuthPage) {
    return redirectWithCookies(request, response, '/dashboard')
  }

  return response
}

// A redirect must carry the refreshed session cookies, or the user gets logged out.
function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  params: Record<string, string> = {},
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const redirect = NextResponse.redirect(url)
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}
