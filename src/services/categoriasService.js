import { http } from '@services/http'
import { colorDeCategoria } from '@constants/categories'

/**
 * Categorias preestablecidas. La lista la manda la base; lo unico que se anade
 * aqui es el color, que la tabla no guarda (ver `@constants/categories`).
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
 * Todas las categorias, con su total de eventos activos.
 * @param {{ signal?: AbortSignal }} [opciones]
 * @returns {Promise<import('@/types/event').Category[]>}
 */
export async function getCategorias({ signal } = {}) {
  const respuesta = await http.get('/categorias', undefined, { signal })

  return (respuesta.data ?? []).map(toCategory)
}
