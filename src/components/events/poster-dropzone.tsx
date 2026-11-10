'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_BYTES = 5 * 1024 * 1024 // the brief's limit, checked before compression

type Props = {
  existingUrl?: string | null
  onChange: (file: File | null) => void
  onRemoveExisting?: () => void
  disabled?: boolean
}

export function PosterDropzone({
  existingUrl,
  onChange,
  onRemoveExisting,
  disabled,
}: Props) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null)
  const [error, setError] = useState<string>()

  // Free the object URL when it changes or the component unmounts
  useEffect(
    () => () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    },
    [preview],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_BYTES,
    multiple: false,
    disabled,
    onDropAccepted: ([file]) => {
      setError(undefined)
      setPreview(URL.createObjectURL(file))
      onChange(file)
    },
    onDropRejected: ([rejection]: FileRejection[]) => {
      const code = rejection?.errors[0]?.code
      setError(
        code === 'file-too-large'
          ? 'Poster is larger than 5 MB. Choose a smaller image.'
          : code === 'file-invalid-type'
            ? 'Only JPG, PNG or WebP images are allowed.'
            : 'This file can’t be used. Try another image.',
      )
    },
  })

  function remove() {
    setPreview(null)
    onChange(null)
    onRemoveExisting?.()
  }

  if (preview) {
    return (
      <div className="bg-muted relative overflow-hidden rounded-xl border">
        <Image
          src={preview}
          alt="Selected poster preview"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-contain"
          unoptimized={preview.startsWith('blob:')}
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={remove}
          disabled={disabled}
          className="absolute top-2 right-2 rounded-full"
          aria-label="Remove poster"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          'hover:bg-muted focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2',
          isDragActive && 'border-brand-link bg-muted',
          error && 'border-destructive',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <input {...getInputProps()} aria-label="Upload a poster" />
        <ImagePlus
          className="text-muted-foreground size-6"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p className="font-semibold">
          {isDragActive
            ? 'Drop the poster here'
            : 'Drag a poster here, or click to choose'}
        </p>
        <p className="text-muted-foreground text-sm">
          JPG, PNG or WebP, up to 5 MB.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-destructive mt-2 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
