import imageCompression from 'browser-image-compression'

/** Compresses in the browser, uploads through /api/upload, returns the storage path. */
export async function uploadImage(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    fileType: 'image/webp',
    useWebWorker: true,
  })

  const body = new FormData()
  body.append('file', compressed, 'poster.webp')

  const res = await fetch('/api/upload', { method: 'POST', body })
  const json = (await res.json().catch(() => ({}))) as {
    path?: string
    error?: string
  }

  if (!res.ok || !json.path)
    throw new Error(json.error ?? 'Upload failed. Please try again.')
  return json.path
}
