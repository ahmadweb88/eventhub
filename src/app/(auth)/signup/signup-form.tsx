'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { FormTextField } from '@/components/form-text-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { signUp } from '../actions'

export function SignupForm() {
  const [serverError, setServerError] = useState<string>()
  const [notice, setNotice] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: SignupInput) {
    setServerError(undefined)
    setNotice(undefined)
    startTransition(async () => {
      const result = await signUp(values)
      if (result?.error) setServerError(result.error)
      if (result?.message) setNotice(result.message)
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormTextField
          control={form.control}
          name="fullName"
          label="Full name"
          autoComplete="name"
        />
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
          autoComplete="new-password"
          description="At least 8 characters, with a letter and a number."
        />
        <FormTextField
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />

        {serverError && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {serverError}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="border-brand-success/30 bg-brand-success/5 text-brand-success rounded-md border px-3 py-2 text-sm"
          >
            {notice}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </Button>

        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-brand-link font-medium underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
