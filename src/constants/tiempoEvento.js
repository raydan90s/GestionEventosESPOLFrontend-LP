/**
 * Momento del catalogo: proximos, pasados o todos. Por defecto solo los
 * proximos, porque el backend rechaza inscribirse a un evento ya realizado.
 */

export const TIEMPO_EVENTO = Object.freeze({
  PROXIMOS: 'proximos',
  PASADOS: 'pasados',
  TODOS: 'todos',
})

/** Lo que se lista cuando nadie ha elegido nada. */
export const TIEMPO_POR_DEFECTO = TIEMPO_EVENTO.PROXIMOS

/**
 * Opciones tal como se listan en el desplegable.
 *
 * @type {readonly { clave: string, etiqueta: string, resumen: string }[]}
 */
export const TIEMPOS = Object.freeze([
  {
    clave: TIEMPO_EVENTO.PROXIMOS,
    etiqueta: 'Próximos',
    resumen: 'Eventos que aún no se realizan',
  },
  {
    clave: TIEMPO_EVENTO.PASADOS,
    etiqueta: 'Pasados',
    resumen: 'Histórico: ya no admiten inscripciones',
  },
  {
    clave: TIEMPO_EVENTO.TODOS,
    etiqueta: 'Todos',
    resumen: 'Próximos y pasados juntos',
  },
])

/**
 * Normaliza el parametro `tiempo` de la URL. Un valor desconocido cae en el
 * de por defecto.
 *
 * @param {string | null} valor
 * @returns {string}
 */
export const resolverTiempo = (valor) =>
  TIEMPOS.some((tiempo) => tiempo.clave === valor) ? valor : TIEMPO_POR_DEFECTO

/**
 * Etiqueta visible de una opcion.
 * @param {string} clave
 * @returns {string}
 */
export const etiquetaDeTiempo = (clave) =>
  TIEMPOS.find((tiempo) => tiempo.clave === clave)?.etiqueta ?? ''
