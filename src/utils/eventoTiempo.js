/**
 * Si un evento ya ocurrió.
 *
 * El servidor es quien manda —rechaza la inscripción a un evento cuya fecha
 * pasó— pero la vista necesita saberlo antes de ofrecer el botón: enseñar
 * «Inscribirse» en algo que va a devolver un 409 es prometer lo que no se puede
 * cumplir. Igual que el aforo, esto es comodidad, no control.
 *
 * `ahora` se inyecta para poder probar la función con cualquier instante.
 *
 * @param {string | Date} fecha Fecha del evento (ISO o `Date`).
 * @param {Date} [ahora]
 * @returns {boolean}
 */
export function esPasado(fecha, ahora = new Date()) {
  const cuando = fecha instanceof Date ? fecha : new Date(fecha)

  // Una fecha ilegible no se declara pasada: dejar decidir al servidor es más
  // seguro que cerrar la inscripción de un evento que quizá sigue en pie.
  return Number.isNaN(cuando.getTime()) ? false : cuando.getTime() < ahora.getTime()
}
