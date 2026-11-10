import type { SupabaseClient } from '@supabase/supabase-js'

export const IMAGE_BUCKET = 'images'
export const SIGNED_URL_TTL = 60 * 60 // 1 hour

/** A path the user may reference: inside their own folder, no tricks. */
export function isOwnPath(path: string, userId: string) {
  return (
    path.startsWith(`${userId}/`) && !path.includes('..') && path.length < 200
  )
}

/** One signed URL, or null. */
export async function getSignedUrl(
  supabase: SupabaseClient,
  path: string | null,
) {
  if (!path) return null
  const { data } = await supabase.storage
    .from(IMAGE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL)
  return data?.signedUrl ?? null
}

/** Signed URLs for many paths in one request: { [path]: url }. */
export async function getSignedUrlMap(
  supabase: SupabaseClient,
  paths: (string | null)[],
) {
  const list = [...new Set(paths.filter((p): p is string => Boolean(p)))]
  if (list.length === 0) return {} as Record<string, string>

  const { data } = await supabase.storage
    .from(IMAGE_BUCKET)
    .createSignedUrls(list, SIGNED_URL_TTL)
  return Object.fromEntries(
    (data ?? [])
      .filter((d) => d.path && d.signedUrl)
      .map((d) => [d.path as string, d.signedUrl]),
  ) as Record<string, string>
}

/** Remove files and ignore failures (cleanup must never break the main action). */
export async function removeFiles(
  supabase: SupabaseClient,
  paths: (string | null | undefined)[],
) {
  const list = paths.filter((p): p is string => Boolean(p))
  if (list.length) await supabase.storage.from(IMAGE_BUCKET).remove(list)
}
