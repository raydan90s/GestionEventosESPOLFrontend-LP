/** Rutas de la aplicacion. Usar estas constantes en vez de strings sueltos. */
export const ROUTES = Object.freeze({
  CATALOGO: '/',
  EVENTO_NUEVO: '/eventos/nuevo',
  EVENTO_EDITAR: '/eventos/:id/editar',
  EVENTO_DETALLE: '/eventos/:id',
  EVENTO_ASISTENTES: '/eventos/:id/asistentes',
})

/**
 * Parametros de filtrado del catalogo. Viven en la query string porque el
 * buscador esta en la navbar y el listado en el catalogo.
 */
export const CATALOGO_PARAMS = Object.freeze({
  Q: 'q',
  CATEGORIA: 'categoria',
  /** Atajo de rango (`hoy`, `semana`...) o `personalizado`; ver `@constants/rangosFecha`. */
  FECHA: 'fecha',
  DESDE: 'desde',
  HASTA: 'hasta',
  /**
   * Momento del catalogo: `proximos` (por defecto y omitido en la URL),
   * `pasados` o `todos`; ver `@constants/tiempoEvento`.
   */
  TIEMPO: 'tiempo',
  /** Solo eventos con cupo libre. */
  DISPONIBLES: 'disponibles',
})

/**
 * Valor con el que un filtro de si/no viaja en la URL: se guarda el `1` y se
 * omite el `0`, asi la URL sin filtros queda vacia.
 */
export const ACTIVO = '1'

/**
 * Construye la ruta de detalle de un evento.
 * @param {string | number} id
 * @returns {string}
 */
export const eventoDetalle = (id) => `/eventos/${id}`

/**
 * Construye la ruta de edicion de un evento.
 * @param {string | number} id
 * @returns {string}
 */
export const eventoEditar = (id) => `/eventos/${id}/editar`

/**
 * Construye la ruta del listado de asistentes de un evento (vista de organizador).
 * @param {string | number} id
 * @returns {string}
 */
export const eventoAsistentes = (id) => `/eventos/${id}/asistentes`
