import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { getEvent } from '@services/eventsService'

/**
 * Detalle de un evento. `recargar` lo usa la vista tras una inscripcion: el
 * cliente nunca resta cupos por su cuenta, vuelve a preguntar.
 *
 * @param {string | number | undefined} id
 */
export function useEvento(id) {
  const [evento, setEvento] = useState(/** @type {import('@/types/event').Event | null} */ (null))
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const [contador, setContador] = useState(0)
  const recargar = useCallback(() => setContador((n) => n + 1), [])

  useEffect(() => {
    if (id === undefined || id === null || id === '') return undefined

    const controlador = new AbortController()

    getEvent(id, { signal: controlador.signal })
      .then((datos) => {
        setEvento(datos)
        setError(null)
      })
      .catch((fallo) => {
        if (controlador.signal.aborted) return
        setError(mensajeDeError(fallo, 'No pudimos cargar el evento.'))
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [contador, id])

  return { evento, cargando, error, recargar }
}
