/**
 * Configuracion de acceso a la API RESTful (PHP + PostgreSQL).
 * La URL base se define en `.env` con VITE_API_URL; ver `.env.example`.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api'

/**
 * Construye una URL absoluta hacia un endpoint de la API.
 * @param {string} path Ruta relativa, con o sin `/` inicial.
 * @returns {string}
 */
export function apiUrl(path = '') {
  const base = API_URL.replace(/\/+$/, '')
  const suffix = String(path).replace(/^\/+/, '')
  return suffix ? `${base}/${suffix}` : base
}

/**
 * URL absoluta hacia un archivo de `public/` del backend, que se sirve fuera
 * de `/api`. Si `path` ya es una URL absoluta se devuelve tal cual.
 *
 * @param {string} path Ruta relativa guardada en la base de datos.
 * @returns {string}
 */
export function assetUrl(path = '') {
  const texto = String(path)
  if (/^(https?:)?\/\//.test(texto)) return texto

  const base = API_URL.replace(/\/api\/?$/, '')
  const suffix = texto.replace(/^\/+/, '')
  return suffix ? `${base}/${suffix}` : base
}
