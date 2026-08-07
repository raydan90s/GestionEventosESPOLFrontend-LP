import { http } from '@services/http'

/**
 * Catálogo de eventos, con filtros opcionales.
 * @param {{ categoria?: string, desde?: string, hasta?: string }} [filters]
 * @returns {Promise<import('@/types/event').Event[]>}
 */
export const getEvents = (filters) => http.get('/eventos', filters)

/**
 * Detalle de un evento.
 * @param {string | number} id
 * @returns {Promise<import('@/types/event').Event>}
 */
export const getEvent = (id) => http.get(`/eventos/${id}`)

/**
 * Crea un evento.
 * @param {Partial<import('@/types/event').Event>} data
 */
export const createEvent = (data) => http.post('/eventos', data)

/**
 * Asistentes inscritos en un evento.
 * @param {string | number} id
 */
export const getAttendees = (id) => http.get(`/eventos/${id}/asistentes`)

/**
 * Registra una inscripción. El backend valida el aforo disponible.
 * @param {string | number} id
 * @param {{ nombre: string, correo: string }} data
 */
export const registerAttendee = (id, data) => http.post(`/eventos/${id}/inscripciones`, data)

/**
 * Comentarios de un evento.
 * @param {string | number} id
 */
export const getComments = (id) => http.get(`/eventos/${id}/comentarios`)

/**
 * Publica un comentario.
 * @param {string | number} id
 * @param {{ autor: string, contenido: string }} data
 */
export const createComment = (id, data) => http.post(`/eventos/${id}/comentarios`, data)
