/** Una marca de tiempo que ya trae hora, para no tocar una fecha suelta. */
const CON_HORA = /\d{2}:\d{2}/

/**
 * Normaliza a ISO 8601 las marcas de tiempo de PostgreSQL.
 *
 * Llegan como `2026-08-17 14:38:18.355104+00`, que Safari no parsea. Si aun asi
 * no se puede parsear, devuelve el texto original.
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
 * Instante en que empieza el dia del `<input type="date">`, en la zona del
 * usuario: mandar la fecha suelta la dejaria en la zona del servidor.
 *
 * @param {string} value Fecha en formato `YYYY-MM-DD`; vacio si no hay filtro.
 * @returns {string} ISO 8601, o cadena vacia si no hay fecha valida.
 */
export function inicioDelDia(value) {
  return instante(value, 'T00:00:00.000')
}

/**
 * Igual que `inicioDelDia` pero al final del dia: `hasta = 2026-09-01` tiene
 * que incluir los eventos de esa misma tarde.
 *
 * @param {string} value Fecha en formato `YYYY-MM-DD`; vacio si no hay filtro.
 * @returns {string} ISO 8601, o cadena vacia si no hay fecha valida.
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
 * @returns {string} Cadena vacia si la fecha no es valida.
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
