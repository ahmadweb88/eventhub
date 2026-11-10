import { z } from 'zod'

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
})

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your name.')
      .max(60, 'Name is too long.'),
    email,
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(72, 'Use 72 characters or fewer.')
      .regex(/[A-Za-z]/, 'Include at least one letter.')
      .regex(/[0-9]/, 'Include at least one number.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
