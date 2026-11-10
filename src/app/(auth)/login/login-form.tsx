'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { FormTextField } from '@/components/form-text-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { signIn } from '../actions'

export function LoginForm({
  next,
  initialError,
}: {
  next?: string
  initialError?: string
}) {
  const [serverError, setServerError] = useState(initialError)
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: LoginInput) {
    setServerError(undefined)
    startTransition(async () => {
      const result = await signIn(values, next)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
        <FormTextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        {serverError && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Logging in…
            </>
          ) : (
            'Log in'
          )}
        </Button>

        <p className="text-muted-foreground text-sm">
          New here?{' '}
          <Link
            href="/signup"
            className="text-brand-link font-medium underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
