import { ApiError } from '@services/http'

/**
 * Lectura de los errores que devuelve la API PHP.
 *
 * El 422 trae `errors` por campo y va bajo cada input; el 409 es un aviso de
 * estado (sin cupos, correo ya inscrito) con el `message` ya legible.
 */

/**
 * Traduce los errores de validacion (422) a las claves del formulario.
 * La API manda varios mensajes por campo; se toma el primero.
 *
 * @param {unknown} error
 * @param {Record<string, string>} [mapaApiForm] `{ nombre_estudiante: 'nombre' }`.
 *   Lo que no este en el mapa se devuelve tal cual.
 * @returns {Record<string, string>} Vacio si el error no es de validacion.
 */
export function erroresDeCampo(error, mapaApiForm = {}) {
  if (!(error instanceof ApiError) || error.status !== 422) return {}

  const errores = error.body?.errors
  if (!errores || typeof errores !== 'object') return {}

  return Object.fromEntries(
    Object.entries(errores).map(([campoApi, mensajes]) => [
      mapaApiForm[campoApi] ?? campoApi,
      Array.isArray(mensajes) ? mensajes[0] : String(mensajes),
    ]),
  )
}

/**
 * `true` cuando fallo por el estado del recurso y no por los datos enviados:
 * sin cupos, duplicado, cancelado o ya realizado.
 *
 * @param {unknown} error
 */
export const esConflicto = (error) => error instanceof ApiError && error.status === 409

/**
 * Mensaje presentable de cualquier fallo, con respaldo si la peticion no
 * llego a la API (red caida, CORS).
 *
 * @param {unknown} error
 * @param {string} respaldo
 * @returns {string}
 */
export const mensajeDeError = (error, respaldo) =>
  (error instanceof Error && error.message) || respaldo
