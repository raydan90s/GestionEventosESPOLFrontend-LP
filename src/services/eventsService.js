import { erroresDeCampo as erroresDeValidacion } from '@services/apiErrors'
import { http } from '@services/http'
import { finDelDia, inicioDelDia, toIso } from '@utils/apiDate'

/**
 * Eventos del catalogo. RF "Ver catalogo de eventos" y "Crear evento"
 * (Juliana Burgos). Traduce el snake_case de la API a camelCase.
 */

/**
 * @param {Record<string, unknown>} row
 * @returns {import('@/types/event').Event}
 */
export const toEvent = (row) => ({
  id: Number(row.id),
  titulo: String(row.titulo ?? ''),
  descripcion: String(row.descripcion ?? ''),
  categoriaId: Number(row.categoria_id),
  categoriaNombre: String(row.categoria_nombre ?? ''),
  lugar: String(row.ubicacion ?? ''),
  fecha: toIso(row.fecha_evento),
  cupoMaximo: Number(row.cupos_maximos ?? 0),
  cuposDisponibles: Number(row.cupos_disponibles ?? 0),
  inscritos: Number(row.inscritos ?? 0),
  organizador: String(row.organizador ?? ''),
  // Nullable en la base: evita que un `null` acabe como la cadena "null".
  imagenUrl: row.imagen_url ? String(row.imagen_url) : '',
  estado: String(row.estado ?? ''),
})

/**
 * Catalogo de eventos, con filtros opcionales y paginacion.
 *
 * El filtrado y la paginacion (50 por tanda) los hace el backend, de ahi el
 * `total`. `desde` y `hasta` entran `YYYY-MM-DD` y salen ISO (`@utils/apiDate`).
 *
 * @param {{ categoriaId?: number|string, q?: string, desde?: string, hasta?: string,
 *           soloProximos?: boolean, soloPasados?: boolean, soloDisponibles?: boolean,
 *           estado?: string, limite?: number, offset?: number }} [filtros]
 * @param {{ signal?: AbortSignal }} [opciones]
 * @returns {Promise<{ total: number, eventos: import('@/types/event').Event[] }>}
 */
export async function getEvents(filtros = {}, { signal } = {}) {
  const respuesta = await http.get(
    '/eventos',
    {
      categoria_id: filtros.categoriaId,
      q: filtros.q,
      estado: filtros.estado,
      fecha_desde: inicioDelDia(filtros.desde),
      fecha_hasta: finDelDia(filtros.hasta),
      // La API espera cadenas; con `false` el filtro no llega a viajar.
      solo_proximos: filtros.soloProximos ? 'true' : undefined,
      // El backend lo devuelve en orden inverso: primero lo mas reciente.
      solo_pasados: filtros.soloPasados ? 'true' : undefined,
      solo_disponibles: filtros.soloDisponibles ? 'true' : undefined,
      limite: filtros.limite,
      offset: filtros.offset,
    },
    { signal },
  )

  return {
    total: Number(respuesta.total ?? 0),
    eventos: (respuesta.data ?? []).map(toEvent),
  }
}

/**
 * Detalle de un evento.
 * @param {string | number} id
 * @param {{ signal?: AbortSignal }} [opciones]
 * @returns {Promise<import('@/types/event').Event>}
 */
export async function getEvent(id, { signal } = {}) {
  const respuesta = await http.get(`/eventos/${id}`, undefined, { signal })

  return toEvent(respuesta.data)
}

/**
 * Payload snake_case comun a crear y actualizar.
 *
 * @param {{ titulo: string, descripcion?: string, categoriaId: number|string,
 *           lugar: string, fecha: string, cupoMaximo: number|string,
 *           organizador?: string }} datos
 */
const aPayload = (datos) => {
  const payload = {
    titulo: String(datos.titulo ?? '').trim(),
    categoria_id: Number(datos.categoriaId),
    ubicacion: String(datos.lugar ?? '').trim(),
    fecha_evento: String(datos.fecha ?? '').trim(),
    cupos_maximos: Number(datos.cupoMaximo),
  }

  for (const [campoForm, campoApi] of [
    ['descripcion', 'descripcion'],
    ['organizador', 'organizador'],
  ]) {
    const valor = String(datos[campoForm] ?? '').trim()
    if (valor !== '') payload[campoApi] = valor
  }

  return payload
}

/**
 * Crea un evento. `cuposDisponibles` no se envia: el backend lo iguala al
 * aforo maximo.
 *
 * @param {{ titulo: string, descripcion?: string, categoriaId: number|string,
 *           lugar: string, fecha: string, cupoMaximo: number|string,
 *           organizador?: string }} datos
 * @returns {Promise<import('@/types/event').Event>}
 */
export async function createEvent(datos) {
  const respuesta = await http.post('/eventos', aPayload(datos))

  return toEvent(respuesta.data)
}

/**
 * Actualiza un evento. Mismo payload que `createEvent`; `cuposDisponibles`
 * lo recalcula el backend.
 *
 * @param {string | number} id
 * @param {{ titulo: string, descripcion?: string, categoriaId: number|string,
 *           lugar: string, fecha: string, cupoMaximo: number|string,
 *           organizador?: string }} datos
 * @returns {Promise<import('@/types/event').Event>}
 */
export async function updateEvent(id, datos) {
  const respuesta = await http.put(`/eventos/${id}`, aPayload(datos))

  return toEvent(respuesta.data)
}

/**
 * Elimina un evento.
 * @param {string | number} id
 * @returns {Promise<void>}
 */
export async function deleteEvent(id) {
  await http.del(`/eventos/${id}`)
}

/**
 * Sube la imagen de un evento ya creado. Va aparte porque es un endpoint
 * `multipart/form-data` y no JSON.
 *
 * @param {string | number} id
 * @param {File} archivo
 * @returns {Promise<import('@/types/event').Event>}
 */
export async function uploadEventImage(id, archivo) {
  const formData = new FormData()
  formData.append('imagen', archivo)

  const respuesta = await http.upload(`/eventos/${id}/imagen`, formData)

  return toEvent(respuesta.data)
}

/** Traduce el nombre de campo de la API al del formulario de evento. */
const CAMPO_FORM = Object.freeze({
  titulo: 'titulo',
  categoria_id: 'categoriaId',
  ubicacion: 'lugar',
  fecha_evento: 'fecha',
  cupos_maximos: 'cupoMaximo',
  descripcion: 'descripcion',
  organizador: 'organizador',
})

/**
 * Errores de validacion con las claves del formulario (`lugar`, `cupoMaximo`)
 * y no las de la API (`ubicacion`, `cupos_maximos`).
 *
 * @param {unknown} error
 * @returns {Record<string, string>}
 */
export const erroresDeCampo = (error) => erroresDeValidacion(error, CAMPO_FORM)
