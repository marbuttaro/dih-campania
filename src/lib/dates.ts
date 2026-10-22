import { Temporal } from '@js-temporal/polyfill'

export function toLocalDateTime(instant: string, zone = 'Europe/Rome') {
  return Temporal.Instant.from(instant).toZonedDateTimeISO(zone).toPlainDateTime().toString({ smallestUnit: 'second' })
}

export function toInstant(local: string, zone = 'Europe/Rome') {
  try {
    return Temporal.PlainDateTime.from(local).toZonedDateTime(zone, { disambiguation: 'reject' }).toInstant().toString()
  } catch {
    throw new Error('Data o ora non valida oppure ambigua nel cambio dell’ora legale. Seleziona UTC per indicare l’istante esatto.')
  }
}

// Keep the original instant when editing metadata during the repeated autumn hour.
export function resolveDateTime(local: string, original: string | null, zone = 'Europe/Rome') {
  return original && local === toLocalDateTime(original, zone) ? Temporal.Instant.from(original).toString() : toInstant(local, zone)
}
