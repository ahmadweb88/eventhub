type Entry<T> = { value: T; expires: number }
const store = new Map<string, Entry<unknown>>()

/** Tiny per-instance TTL cache: keeps repeated requests fast and inside free-tier limits. */
export async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined
  if (hit && hit.expires > Date.now()) return hit.value

  const value = await load()
  store.set(key, { value, expires: Date.now() + ttlMs })
  if (store.size > 500) store.delete(store.keys().next().value as string)
  return value
}
