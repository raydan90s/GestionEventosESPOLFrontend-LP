import { ApiError } from '@services/http'

/**
 * Lectura de los errores que devuelve la API PHP.
 *
 * El backend distingue dos fallos que la interfaz debe mostrar distinto:
 * - **422** con `errors` por campo: el usuario escribió algo mal, el mensaje va
 *   debajo del input correspondiente.
 * - **409**: la operación es válida pero el estado del recurso no la admite
 *   (sin cupos, correo ya inscrito, evento cancelado). Es un aviso, no un error
 *   de tecleo, y el `message` del backend ya viene legible en español.
 */

/**
 * Traduce los errores de validación (HTTP 422) a las claves del formulario.
 *
 * La API agrupa varios mensajes por campo (`{ correo: ['...', '...'] }`);
 * aquí se toma el primero, que es el que se pinta bajo el input.
 *
 * @param {unknown} error
 * @param {Record<string, string>} [mapaApiForm] Traduce el nombre de la API al
 *   del formulario (`{ nombre_estudiante: 'nombre' }`). Las claves que no estén
 *   en el mapa se devuelven tal cual.
 * @returns {Record<string, string>} Vacío si el error no es de validación.
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
 * `true` cuando la operación falló por el estado del recurso y no por los datos
 * enviados: sin cupos, duplicado, evento cancelado o ya realizado.
 *
 * @param {unknown} error
 */
export const esConflicto = (error) => error instanceof ApiError && error.status === 409

/**
 * Mensaje presentable de cualquier fallo, con un respaldo por si la petición
 * ni siquiera llegó a la API (red caída, CORS).
 *
 * @param {unknown} error
 * @param {string} respaldo
 * @returns {string}
 */
export const mensajeDeError = (error, respaldo) =>
  (error instanceof Error && error.message) || respaldo
