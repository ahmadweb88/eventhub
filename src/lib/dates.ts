import { format, parseISO } from 'date-fns'

/** Today as yyyy-MM-dd in the runtime's local time zone. */
export function todayIso() {
  return format(new Date(), 'yyyy-MM-dd')
}

/** "Sat 14 Dec 2026" from a yyyy-MM-dd date, without time-zone shifts. */
export function formatEventDate(iso: string) {
  return format(parseISO(iso), 'EEE d MMM yyyy')
}

export function isPastDate(iso: string) {
  return iso < todayIso()
}
