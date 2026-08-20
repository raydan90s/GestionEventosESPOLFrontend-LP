import { erroresDeCampo as erroresDeValidacion } from '@services/apiErrors'
import { http } from '@services/http'
import { toIso } from '@utils/apiDate'

/**
 * Comentarios de un evento.
 *
 * RF "Ver comentarios de evento" y "Escribir comentario de evento" (Eimmy Ochoa).
 */

/** Nombre que espera la API para cada campo del formulario. */
const CAMPO_API = Object.freeze({
  autor: 'autor',
  contenido: 'contenido',
})

/** Inverso de `CAMPO_API`, para traducir los errores 422 al formulario. */
const CAMPO_FORM = Object.freeze(
  Object.fromEntries(Object.entries(CAMPO_API).map(([form, api]) => [api, form])),
)

/**
 * @param {Record<string, unknown>} row
 * @returns {import('@/types/event').Comment}
 */
const toComment = (row) => ({
  id: Number(row.id),
  autor: String(row.autor ?? ''),
  contenido: String(row.contenido ?? ''),
  fecha: toIso(row.created_at ?? row.fecha),
})

/**
 * Comentarios de un evento, del más reciente al más antiguo.
 * @param {string | number} eventoId
 * @param {{ limite?: number, offset?: number, signal?: AbortSignal }} [opciones]
 * @returns {Promise<{ total: number, comentarios: import('@/types/event').Comment[] }>}
 */
export async function getComentarios(eventoId, { limite, offset, signal } = {}) {
  const respuesta = await http.get(`/eventos/${eventoId}/comentarios`, { limite, offset }, { signal })

  return {
    total: Number(respuesta.total ?? 0),
    comentarios: (respuesta.data ?? []).map(toComment),
  }
}

/**
 * Publica un comentario en un evento.
 * @param {string | number} eventoId
 * @param {{ autor: string, contenido: string }} datos
 * @returns {Promise<import('@/types/event').Comment>}
 */
export async function crearComentario(eventoId, datos) {
  const payload = {}

  for (const [campoForm, campoApi] of Object.entries(CAMPO_API)) {
    payload[campoApi] = String(datos[campoForm] ?? '').trim()
  }

  const respuesta = await http.post(`/eventos/${eventoId}/comentarios`, payload)

  return toComment(respuesta.data)
}

/** Límites que impone la base: `contenido` es `CHECK (char_length BETWEEN 3 AND 1000)`. */
export const COMENTARIO_MAX = 1000
export const COMENTARIO_MIN = 3
export const AUTOR_MAX = 120
export const AUTOR_MIN = 3

/** Comentarios que se piden por tanda. */
export const COMENTARIOS_POR_PAGINA = 20

/**
 * Errores de validación del formulario de comentario.
 * @param {unknown} error
 * @returns {Record<string, string>}
 */
export const erroresDeCampo = (error) => erroresDeValidacion(error, CAMPO_FORM)
