import { erroresDeCampo as erroresDeValidacion, esConflicto } from '@services/apiErrors'
import { http } from '@services/http'
import { toIso } from '@utils/apiDate'

/**
 * Inscripciones y asistentes.
 *
 * RF "Registrar inscripción" y "Ver asistentes" (Diego Parrales).
 *
 * La API PHP responde en snake_case (`nombre_estudiante`, `cupos_disponibles`,
 * `fecha_inscripcion`) y el frontend trabaja en camelCase. Toda la traducción
 * vive en este módulo: los hooks y los componentes nunca ven una clave de la
 * base de datos.
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
 * Registra una inscripción en un evento.
 *
 * El aforo se valida en el servidor dentro de una transacción con bloqueo de
 * fila, así que dos personas que peleen por el último cupo no pueden ganarlo
 * las dos: la segunda recibe un 409. Nunca se descuenta el cupo en el cliente.
 *
 * @param {string | number} eventoId
 * @param {{ nombre: string, correo: string, matricula?: string, telefono?: string }} datos
 * @returns {Promise<import('@/types/event').Registration>}
 */
export async function registrarInscripcion(eventoId, datos) {
  const payload = {}

  for (const [campoForm, campoApi] of Object.entries(CAMPO_API)) {
    const valor = String(datos[campoForm] ?? '').trim()
    // Los opcionales vacíos no se envían: el validador del backend los ignora
    // igual, pero así el payload refleja lo que el usuario realmente escribió.
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
 *   matrícula o correo (lo resuelve el backend con ILIKE).
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
 * Cancela una inscripción y devuelve el cupo al evento.
 * @param {string | number} inscripcionId
 */
export const cancelarInscripcion = (inscripcionId) => http.del(`/inscripciones/${inscripcionId}`)

/**
 * Errores de validación del formulario de inscripción, con las claves del
 * formulario (`nombre`) y no las de la API (`nombre_estudiante`).
 *
 * @param {unknown} error
 * @returns {Record<string, string>} Vacío si el error no es de validación.
 */
export const erroresDeCampo = (error) => erroresDeValidacion(error, CAMPO_FORM)

/**
 * `true` cuando el registro falló porque el evento ya no admite la inscripción:
 * sin cupos, correo repetido, evento cancelado o evento ya realizado.
 *
 * @param {unknown} error
 */
export const esConflictoDeAforo = esConflicto
