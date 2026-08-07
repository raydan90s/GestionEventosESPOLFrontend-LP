const DATE_FORMAT = new Intl.DateTimeFormat('es-EC', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const TIME_FORMAT = new Intl.DateTimeFormat('es-EC', {
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * Fecha legible: "mié, 12 ago 2026".
 * @param {string | Date} value
 * @returns {string}
 */
export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : DATE_FORMAT.format(date)
}

/**
 * Hora legible: "14:30".
 * @param {string | Date} value
 * @returns {string}
 */
export function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : TIME_FORMAT.format(date)
}

/**
 * Fecha y hora juntas.
 * @param {string | Date} value
 * @returns {string}
 */
export function formatDateTime(value) {
  const date = formatDate(value)
  const time = formatTime(value)
  return date && time ? `${date} · ${time}` : date
}
