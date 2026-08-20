import { erroresDeCampo as erroresDeValidacion, esConflicto } from '@services/apiErrors'
import { http } from '@services/http'
import { toIso } from '@utils/apiDate'

/**
 * Inscripciones y asistentes. RF "Registrar inscripcion" y "Ver asistentes"
 * (Diego Parrales). Traduce el snake_case de la API a camelCase.
 */

/** Nombre que espera la API para cada campo del formulario. */
const CAMPO_API = Object.freeze({
  nombre: 'nombre_estudiante',
  correo: 'correo',
  matricula: 'matricula',
  telefono: 'telefono',
})

/** Inverso de `CAMPO_API`, para traducir los errores 422 de vuelta al formulario. */
const CAMPO_FORM = Object.freeze(
  Object.fromEntries(Object.entries(CAMPO_API).map(([form, api]) => [api, form])),
)

/**
 * @param {Record<string, unknown>} row
 * @returns {import('@/types/event').Attendee}
 */
const toAttendee = (row) => ({
  id: Number(row.id),
  nombre: String(row.nombre_estudiante ?? ''),
  matricula: String(row.matricula ?? ''),
  correo: String(row.correo ?? ''),
  telefono: String(row.telefono ?? ''),
  fechaInscripcion: toIso(row.fecha_inscripcion),
})

/**
 * @param {Record<string, unknown>} row
 * @returns {import('@/types/event').EventSummary}
 */
const toEventSummary = (row) => ({
  id: Number(row.id),
  titulo: String(row.titulo ?? ''),
  fecha: toIso(row.fecha_evento),
  lugar: String(row.ubicacion ?? ''),
  cupoMaximo: Number(row.cupos_maximos ?? 0),
  cuposDisponibles: Number(row.cupos_disponibles ?? 0),
  inscritos: Number(row.inscritos ?? 0),
})

/**
 * @param {Record<string, unknown>} row
 * @returns {import('@/types/event').Registration}
 */
const toRegistration = (row) => ({
  id: Number(row.id),
  eventoId: Number(row.evento_id),
  eventoTitulo: String(row.evento_titulo ?? ''),
  nombre: String(row.nombre_estudiante ?? ''),
  matricula: String(row.matricula ?? ''),
  correo: String(row.correo ?? ''),
  telefono: String(row.telefono ?? ''),
  fechaInscripcion: toIso(row.created_at),
  cuposRestantes: Number(row.cupos_restantes ?? 0),
})

/**
 * Registra una inscripcion en un evento.
 *
 * El aforo lo valida el servidor con bloqueo de fila: quien llega segundo al
 * ultimo cupo recibe un 409. El cliente nunca descuenta.
 *
 * @param {string | number} eventoId
 * @param {{ nombre: string, correo: string, matricula?: string, telefono?: string }} datos
 * @returns {Promise<import('@/types/event').Registration>}
 */
export async function registrarInscripcion(eventoId, datos) {
  const payload = {}

  for (const [campoForm, campoApi] of Object.entries(CAMPO_API)) {
    const valor = String(datos[campoForm] ?? '').trim()
    // Los opcionales vacios no se envian: el payload refleja lo escrito.
    if (valor !== '') payload[campoApi] = valor
  }

  const respuesta = await http.post(`/eventos/${eventoId}/inscripciones`, payload)

  return toRegistration(respuesta.data)
}

/**
 * Listado de asistentes de un evento, junto al resumen de aforo del evento.
 *
 * @param {string | number} eventoId
 * @param {{ q?: string, signal?: AbortSignal }} [opciones] `q` busca por nombre,
 *   matricula o correo (lo resuelve el backend con ILIKE).
 * @returns {Promise<import('@/types/event').AttendeeList>}
 */
export async function getAsistentes(eventoId, { q, signal } = {}) {
  const respuesta = await http.get(`/eventos/${eventoId}/asistentes`, { q }, { signal })

  return {
    evento: toEventSummary(respuesta.evento ?? {}),
    total: Number(respuesta.total ?? 0),
    asistentes: (respuesta.data ?? []).map(toAttendee),
  }
}

/**
 * Cancela una inscripcion y devuelve el cupo. Lo repone el backend, por eso la
 * vista recarga en vez de quitar la fila (ver `useAsistentes`).
 *
 * @param {string | number} inscripcionId
 */
export const cancelarInscripcion = (inscripcionId) => http.del(`/inscripciones/${inscripcionId}`)

/**
 * Errores de validacion del formulario de inscripcion, con las claves del
 * formulario (`nombre`) y no las de la API (`nombre_estudiante`).
 *
 * @param {unknown} error
 * @returns {Record<string, string>} Vacio si el error no es de validacion.
 */
export const erroresDeCampo = (error) => erroresDeValidacion(error, CAMPO_FORM)

/**
 * `true` cuando el evento ya no admite la inscripcion: sin cupos, correo
 * repetido, cancelado o ya realizado.
 *
 * @param {unknown} error
 */
export const esConflictoDeAforo = esConflicto
