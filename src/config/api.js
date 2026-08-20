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

/**
 * Construye una URL absoluta hacia un archivo servido desde `public/` del
 * backend (por ejemplo, una imagen subida: `storage/eventos/…`).
 *
 * No es lo mismo que `apiUrl`: esos archivos se sirven directamente desde
 * `public/`, no desde `/api`, así que la base es la de la API sin ese sufijo.
 *
 * `imagen_url` es una columna de texto libre que ya existía antes de que
 * hubiera subida de archivos: algún dato de ejemplo puede traer una URL ya
 * absoluta. Anteponerle la base rompería esa URL, así que se devuelve tal
 * cual si ya lo es.
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
