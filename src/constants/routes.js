/** Rutas de la aplicación. Usar estas constantes en vez de strings sueltos. */
export const ROUTES = Object.freeze({
  CATALOGO: '/',
  EVENTO_NUEVO: '/eventos/nuevo',
  EVENTO_DETALLE: '/eventos/:id',
})

/**
 * Construye la ruta de detalle de un evento.
 * @param {string | number} id
 * @returns {string}
 */
export const eventoDetalle = (id) => `/eventos/${id}`
