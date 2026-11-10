import type { Metadata } from 'next'
import { Logo } from '@/components/brand/logo'
import { SignupForm } from './signup-form'

export const metadata: Metadata = { title: 'Create account' }

export default function SignupPage() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm space-y-8">
        <Logo className="[&_svg]:size-11" />
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold">
            Create your account
          </h1>
          <p className="text-muted-foreground">
            Plan local events, add posters and check the weather in each city.
          </p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
