import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import { IMAGE_BUCKET } from '@/lib/storage'

const MAX_BYTES = 4 * 1024 * 1024 // below Vercel's 4.5 MB request limit
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// Check the real file content, not just the type the browser claims
function hasImageSignature(b: Uint8Array, type: string) {
  if (type === 'image/jpeg')
    return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
  if (type === 'image/png')
    return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
  if (type === 'image/webp')
    return (
      String.fromCharCode(...b.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...b.slice(8, 12)) === 'WEBP'
    )
  return false
}

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return fail('Please log in to upload images.', 401)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Please log in to upload images.', 401)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return fail('Upload failed. Please try again.', 400)
  }

  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0)
    return fail('Choose an image to upload.', 400)
  if (file.size > MAX_BYTES)
    return fail('Image is larger than 4 MB. Choose a smaller one.', 413)

  const ext = EXTENSIONS[file.type]
  if (!ext) return fail('Only JPG, PNG or WebP images are allowed.', 415)

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!hasImageSignature(bytes, file.type))
    return fail('This file is not a valid image.', 415)

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Storage upload failed:', error.message)
    return fail('Upload failed. Please try again.', 500)
  }

  return NextResponse.json({ path }, { status: 201 })
}
