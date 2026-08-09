/** Una marca de tiempo que ya trae hora, para no tocar una fecha suelta. */
const CON_HORA = /\d{2}:\d{2}/

/**
 * Normaliza a ISO 8601 las marcas de tiempo de PostgreSQL.
 *
 * Llegan como `2026-08-17 14:38:18.355104+00`: espacio en vez de `T` y desfase
 * de dos dígitos. El estándar de JavaScript sólo garantiza el parseo del
 * formato ISO —Chrome es permisivo, Safari no—, así que se corrige en la capa
 * de servicios, junto al resto de la traducción de la API. Si aun así no se
 * puede parsear, se devuelve el texto original y `formatDate` decide qué mostrar.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function toIso(value) {
  const texto = String(value ?? '').trim()
  if (texto === '') return ''

  let normalizado = texto.replace(' ', 'T')
  if (CON_HORA.test(normalizado)) normalizado = normalizado.replace(/([+-]\d{2})$/, '$1:00')

  const fecha = new Date(normalizado)

  return Number.isNaN(fecha.getTime()) ? texto : fecha.toISOString()
}

/**
 * Convierte el valor de un `<input type="date">` (`YYYY-MM-DD`) en el instante
 * absoluto en que **empieza** ese día en la zona del usuario, listo para viajar
 * como filtro `fecha_desde`.
 *
 * Se manda el instante y no la fecha suelta porque el backend interpretaría
 * `2026-09-01` en la zona del servidor, no en la de quien filtra.
 *
 * @param {string} value Fecha en formato `YYYY-MM-DD`; vacío si no hay filtro.
 * @returns {string} ISO 8601, o cadena vacía si no hay fecha válida.
 */
export function inicioDelDia(value) {
  return instante(value, 'T00:00:00.000')
}

/**
 * Igual que `inicioDelDia`, pero con el último milisegundo del día: un filtro
 * `hasta = 2026-09-01` tiene que incluir los eventos de esa misma tarde, y
 * `2026-09-01T00:00` los dejaría todos fuera.
 *
 * @param {string} value Fecha en formato `YYYY-MM-DD`; vacío si no hay filtro.
 * @returns {string} ISO 8601, o cadena vacía si no hay fecha válida.
 */
export function finDelDia(value) {
  return instante(value, 'T23:59:59.999')
}

/**
 * @param {string} value
 * @param {string} hora
 * @returns {string}
 */
function instante(value, hora) {
  const texto = String(value ?? '').trim()
  if (texto === '') return ''

  // Sin sufijo de zona, el navegador lo lee como hora local: justo lo que se quiere.
  const fecha = new Date(`${texto}${hora}`)

  return Number.isNaN(fecha.getTime()) ? '' : fecha.toISOString()
}

/**
 * Convierte una fecha ISO al formato que espera un `<input type="datetime-local">`
 * (`YYYY-MM-DDTHH:mm`), en hora local.
 *
 * @param {string | Date} value
 * @returns {string} Cadena vacía si la fecha no es válida.
 */
export function toDatetimeLocal(value) {
  const fecha = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(fecha.getTime())) return ''

  const dosDigitos = (n) => String(n).padStart(2, '0')

  return (
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}` +
    `T${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`
  )
}
