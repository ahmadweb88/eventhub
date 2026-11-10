import type { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Log in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams

  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
          {/* [PLACEHOLDER] Replace with a line specific to the app. */}
          <p className="text-muted-foreground">
            Log in to continue to your dashboard.
          </p>
        </div>
        <LoginForm
          next={next}
          initialError={
            error === 'auth'
              ? 'That sign-in link is invalid or expired. Log in again.'
              : undefined
          }
        />
      </div>
    </main>
  )
}
