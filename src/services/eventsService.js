import { erroresDeCampo as erroresDeValidacion } from '@services/apiErrors'
import { http } from '@services/http'
import { finDelDia, inicioDelDia, toIso } from '@utils/apiDate'

/**
 * Eventos del catálogo.
 *
 * RF "Ver catálogo de eventos" y "Crear evento" (Juliana Burgos).
 *
 * Como en el resto de la capa de servicios, la API responde en snake_case y
 * aquí se traduce a camelCase: ningún componente ve una clave de la base.
 *
 * Las inscripciones y el listado de asistentes viven en
 * `@services/inscripcionesService`; los comentarios, en
 * `@services/comentariosService`.
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
  estado: String(row.estado ?? ''),
})

/**
 * Catálogo de eventos, con filtros opcionales.
 *
 * El filtrado lo hace el backend (SQL), no el cliente: así el catálogo puede
 * crecer sin que la vista tenga que descargarlo entero para poder filtrarlo.
 *
 * `desde` y `hasta` llegan como fecha suelta (`YYYY-MM-DD`, lo que da un
 * `<input type="date">`) y salen como instante ISO: ver `@utils/apiDate`.
 *
 * @param {{ categoriaId?: number|string, q?: string, desde?: string, hasta?: string,
 *           soloProximos?: boolean, soloPasados?: boolean, soloDisponibles?: boolean,
 *           estado?: string }} [filtros]
 * @param {{ signal?: AbortSignal }} [opciones]
 * @returns {Promise<import('@/types/event').Event[]>}
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
      // La API espera cadenas: `false` se descarta en http.get y el filtro
      // simplemente no viaja, que es justo lo que queremos.
      solo_proximos: filtros.soloProximos ? 'true' : undefined,
      // El histórico lo devuelve el backend (`fecha_evento < NOW()`) y en orden
      // inverso: de un pasado se mira primero lo más reciente.
      solo_pasados: filtros.soloPasados ? 'true' : undefined,
      solo_disponibles: filtros.soloDisponibles ? 'true' : undefined,
    },
    { signal },
  )

  return (respuesta.data ?? []).map(toEvent)
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
 * Crea un evento.
 *
 * `cuposDisponibles` no se envía: el backend lo iguala al aforo máximo al crear.
 *
 * @param {{ titulo: string, descripcion?: string, categoriaId: number|string,
 *           lugar: string, fecha: string, cupoMaximo: number|string,
 *           organizador?: string }} datos
 * @returns {Promise<import('@/types/event').Event>}
 */
export async function createEvent(datos) {
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

  const respuesta = await http.post('/eventos', payload)

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
 * Errores de validación del formulario de evento, con las claves del formulario
 * (`lugar`, `cupoMaximo`) y no las de la API (`ubicacion`, `cupos_maximos`).
 *
 * @param {unknown} error
 * @returns {Record<string, string>}
 */
export const erroresDeCampo = (error) => erroresDeValidacion(error, CAMPO_FORM)
