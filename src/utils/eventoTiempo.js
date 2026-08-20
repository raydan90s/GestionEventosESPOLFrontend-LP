/**
 * Si un evento ya ocurrio. El servidor es quien manda; esto solo evita ofrecer
 * "Inscribirse" en algo que devolveria un 409.
 *
 * @param {string | Date} fecha Fecha del evento (ISO o `Date`).
 * @param {Date} [ahora] Inyectable para las pruebas.
 * @returns {boolean}
 */
export function esPasado(fecha, ahora = new Date()) {
  const cuando = fecha instanceof Date ? fecha : new Date(fecha)

  // Una fecha ilegible no se declara pasada: que decida el servidor.
  return Number.isNaN(cuando.getTime()) ? false : cuando.getTime() < ahora.getTime()
}
