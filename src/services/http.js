import { apiUrl } from '@config/api'

/** Error de una respuesta HTTP no exitosa. */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {unknown} [body]
   */
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Envoltura mínima sobre fetch para hablar con la API PHP.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = (isJson && payload?.message) || `Error ${response.status} en ${path}`
    throw new ApiError(message, response.status, payload)
  }

  return payload
}

export const http = {
  /** @param {string} path @param {Record<string, unknown>} [params] */
  get: (path, params) => {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
        )}`
      : ''
    return request(`${path}${query}`)
  },
  /** @param {string} path @param {unknown} body */
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  /** @param {string} path @param {unknown} body */
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  /** @param {string} path */
  del: (path) => request(path, { method: 'DELETE' }),
}
