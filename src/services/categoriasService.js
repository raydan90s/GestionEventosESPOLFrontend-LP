import { http } from '@services/http'
import { colorDeCategoria } from '@constants/categories'

/**
 * Categorías preestablecidas.
 *
 * La lista la manda la base de datos: el frontend no tiene ninguna categoría
 * escrita a mano. Lo único que se añade aquí es el color, que la tabla
 * `categorias` no guarda porque es una decisión de diseño
 * (ver `@constants/categories`).
 */

/**
 * @param {Record<string, unknown>} row
 * @returns {import('@/types/event').Category}
 */
const toCategory = (row) => {
  const nombre = String(row.nombre ?? '')

  return {
    id: Number(row.id),
    nombre,
    descripcion: String(row.descripcion ?? ''),
    totalEventos: Number(row.total_eventos ?? 0),
    color: colorDeCategoria(nombre),
  }
}

/**
 * Todas las categorías, con su total de eventos activos.
 * @param {{ signal?: AbortSignal }} [opciones]
 * @returns {Promise<import('@/types/event').Category[]>}
 */
export async function getCategorias({ signal } = {}) {
  const respuesta = await http.get('/categorias', undefined, { signal })

  return (respuesta.data ?? []).map(toCategory)
}
