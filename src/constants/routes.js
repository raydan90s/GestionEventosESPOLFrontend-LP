/** Rutas de la aplicación. Usar estas constantes en vez de strings sueltos. */
export const ROUTES = Object.freeze({
  CATALOGO: '/',
  EVENTO_NUEVO: '/eventos/nuevo',
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
  DESDE: 'desde',
  HASTA: 'hasta',
})

/**
 * Construye la ruta de detalle de un evento.
 * @param {string | number} id
 * @returns {string}
 */
export const eventoDetalle = (id) => `/eventos/${id}`

/**
 * Construye la ruta del listado de asistentes de un evento (vista de organizador).
 * @param {string | number} id
 * @returns {string}
 */
export const eventoAsistentes = (id) => `/eventos/${id}/asistentes`
