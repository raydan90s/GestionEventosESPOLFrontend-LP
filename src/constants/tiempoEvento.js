/**
 * Momento del catálogo: si se listan los eventos que están por venir, los que
 * ya se realizaron o todos.
 *
 * No es un interruptor de sí/no sino tres opciones porque el catálogo tiene un
 * valor por defecto que no es «sin filtro»: **lo normal es ver sólo lo que
 * queda por venir**. Un evento cuya fecha ya pasó no admite inscripciones —el
 * backend las rechaza (`El evento ya se realizo`)— así que listarlo entre los
 * demás sólo lleva a intentar apuntarse a algo imposible. El histórico sigue
 * disponible, pero hay que pedirlo.
 *
 * Viaja en la URL como `tiempo=pasados`; el valor por defecto se omite, para
 * que el catálogo sin filtros tenga la query string vacía.
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
 * Normaliza el parámetro `tiempo` de la URL.
 *
 * Un valor desconocido —una URL escrita a mano, una opción que ya no existe—
 * cae en el de por defecto en vez de dejar el catálogo sin criterio.
 *
 * @param {string | null} valor
 * @returns {string}
 */
export const resolverTiempo = (valor) =>
  TIEMPOS.some((tiempo) => tiempo.clave === valor) ? valor : TIEMPO_POR_DEFECTO

/**
 * Etiqueta visible de una opción.
 * @param {string} clave
 * @returns {string}
 */
export const etiquetaDeTiempo = (clave) =>
  TIEMPOS.find((tiempo) => tiempo.clave === clave)?.etiqueta ?? ''
