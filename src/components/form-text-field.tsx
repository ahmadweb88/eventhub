'use client'

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
} & Pick<React.ComponentProps<'input'>, 'type' | 'autoComplete'>

/** A labelled input wired to React Hook Form, with its error under the field. */
export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...inputProps
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorId = `${name}-error`

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input
              {...field}
              {...inputProps}
              id={name}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.invalid ? errorId : undefined}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError id={errorId} errors={[fieldState.error]} />
          </Field>
        )
      }}
    />
  )
}
