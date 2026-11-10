'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createEvent, updateEvent } from '@/app/(app)/events/actions'
import { PosterDropzone } from '@/components/events/poster-dropzone'
import { FormTextField } from '@/components/form-text-field'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { EventWithPoster } from '@/lib/data/event-types'
import { todayIso } from '@/lib/dates'
import { uploadImage } from '@/lib/upload-image'
import {
  CATEGORY_LABELS,
  EVENT_CATEGORIES,
  createEventSchema,
  eventSchema,
  type EventInput,
} from '@/lib/validations/event'

type Props = { mode: 'create' } | { mode: 'edit'; event: EventWithPoster }

const optional = (
  <span className="text-muted-foreground font-normal">(optional)</span>
)

export function EventForm(props: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const isEdit = props.mode === 'edit'

  const form = useForm<EventInput>({
    resolver: zodResolver(isEdit ? eventSchema : createEventSchema),
    defaultValues: isEdit
      ? {
          title: props.event.title,
          description: props.event.description ?? '',
          category: props.event.category as EventInput['category'],
          eventDate: props.event.event_date,
          city: props.event.city,
          venue: props.event.venue ?? '',
          posterPath: props.event.poster_path,
        }
      : {
          title: '',
          description: '',
          category: undefined,
          eventDate: '',
          city: '',
          venue: '',
          posterPath: null,
        },
  })

  function onSubmit(values: EventInput) {
    startTransition(async () => {
      let posterPath = values.posterPath
      if (file) {
        try {
          setUploading(true)
          posterPath = await uploadImage(file)
        } catch (e) {
          toast.error(e instanceof Error ? e.message : 'Upload failed.')
          return
        } finally {
          setUploading(false)
        }
      }

      const payload = { ...values, posterPath }
      const result = isEdit
        ? await updateEvent(props.event.id, payload)
        : await createEvent(payload)

      if (!result.ok) {
        Object.entries(result.fieldErrors ?? {}).forEach(
          ([field, messages]) => {
            if (messages?.[0])
              form.setError(field as keyof EventInput, { message: messages[0] })
          },
        )
        toast.error(result.error)
        return
      }

      toast.success(result.message ?? 'Saved.')
      const id = isEdit ? props.event.id : result.data?.id
      router.push(id ? `/events/${id}` : '/dashboard')
      router.refresh()
    })
  }

  const busy = isPending || uploading
  const cancelHref = isEdit ? `/events/${props.event.id}` : '/dashboard'

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="grid gap-8 lg:grid-cols-[7fr_5fr]"
    >
      <div className="min-w-0 space-y-5">
        <FormTextField control={form.control} name="title" label="Title" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <select
                  id="category"
                  {...field}
                  value={field.value ?? ''}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'category-error' : undefined
                  }
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive h-11 w-full rounded-md border bg-transparent px-3 text-base outline-none focus-visible:ring-3"
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                <FieldError id="category-error" errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="eventDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="eventDate">Event date</FieldLabel>
                <Input
                  id="eventDate"
                  type="date"
                  min={isEdit ? undefined : todayIso()}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'eventDate-error' : undefined
                  }
                />
                <FieldError id="eventDate-error" errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormTextField
            control={form.control}
            name="city"
            label="City"
            autoComplete="address-level2"
          />
          <Controller
            control={form.control}
            name="venue"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="venue">Venue name {optional}</FieldLabel>
                <Input
                  id="venue"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'venue-error' : undefined
                  }
                />
                <FieldError id="venue-error" errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">
                Description {optional}
              </FieldLabel>
              <Textarea
                id="description"
                rows={5}
                className="text-base"
                {...field}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? 'description-error' : undefined
                }
              />
              <FieldError id="description-error" errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-sm font-semibold">Poster {optional}</p>
        <PosterDropzone
          existingUrl={isEdit ? props.event.posterUrl : null}
          onChange={setFile}
          onRemoveExisting={() => form.setValue('posterPath', null)}
          disabled={busy}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end lg:col-span-2">
        <Link
          href={cancelHref}
          className={buttonVariants({ variant: 'ghost' })}
          aria-disabled={busy}
        >
          Cancel
        </Link>
        <Button type="submit" disabled={busy}>
          {busy && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {uploading
            ? 'Uploading poster…'
            : isPending
              ? 'Saving…'
              : isEdit
                ? 'Save changes'
                : 'Create event'}
        </Button>
      </div>
    </form>
  )
}
