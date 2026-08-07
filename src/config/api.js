/**
 * Configuración de acceso a la API RESTful (PHP + PostgreSQL).
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
