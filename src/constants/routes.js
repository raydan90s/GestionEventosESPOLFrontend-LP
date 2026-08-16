/** Rutas de la aplicación. Usar estas constantes en vez de strings sueltos. */
export const ROUTES = Object.freeze({
  CATALOGO: '/',
  EVENTO_NUEVO: '/eventos/nuevo',
  EVENTO_EDITAR: '/eventos/:id/editar',
  EVENTO_DETALLE: '/eventos/:id',
  EVENTO_ASISTENTES: '/eventos/:id/asistentes',
})

/**
 * Parámetros de filtrado del catálogo.
 *
 * Viven en la query string y no en el estado de la página porque el buscador
 * está en la navbar y el listado en el catálogo: la URL es el único sitio que
 * ven los dos. De paso, un filtro queda compartible y el botón «atrás» lo
 * deshace.
 */
export const CATALOGO_PARAMS = Object.freeze({
  Q: 'q',
  CATEGORIA: 'categoria',
  /** Atajo de rango (`hoy`, `semana`…) o `personalizado`; ver `@constants/rangosFecha`. */
  FECHA: 'fecha',
  DESDE: 'desde',
  HASTA: 'hasta',
  /** Sólo eventos que aún no han ocurrido. */
  PROXIMOS: 'proximos',
  /** Sólo eventos con cupo libre. */
  DISPONIBLES: 'disponibles',
})

/**
 * Valor con el que un filtro de sí/no viaja en la URL.
 *
 * Se guarda el `1` y se omite el `0`: un parámetro presente es el filtro
 * puesto, y así la URL sin filtros queda literalmente vacía.
 */
export const ACTIVO = '1'

/** Apagado explícito. Necesario en los filtros que vienen activados por defecto. */
export const INACTIVO = '0'

/**
 * Construye la ruta de detalle de un evento.
 * @param {string | number} id
 * @returns {string}
 */
export const eventoDetalle = (id) => `/eventos/${id}`

/**
 * Construye la ruta de edición de un evento.
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
