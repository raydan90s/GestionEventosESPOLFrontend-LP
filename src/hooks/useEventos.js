import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { getEvents } from '@services/eventsService'

/** Espera antes de consultar mientras el usuario sigue escribiendo. */
const DEBOUNCE_MS = 300

/**
 * Catálogo de eventos (RF "Ver catálogo de eventos").
 *
 * El filtro por categoría, el rango de fechas y la búsqueda los resuelve el
 * backend, no el cliente: el catálogo puede crecer y no tiene sentido
 * descargarlo entero para filtrarlo en memoria. Por eso los parámetros viajan
 * en la query string.
 *
 * Los argumentos son primitivos y no un objeto de filtros, para que las
 * dependencias del efecto sean estables: un `{ categoriaId, q }` creado en el
 * render se recrearía en cada pasada y dispararía la petición en bucle.
 *
 * @param {{ categoriaId?: number|string|null, q?: string, desde?: string,
 *           hasta?: string, soloProximos?: boolean, soloDisponibles?: boolean }} [filtros]
 */
export function useEventos({
  categoriaId = null,
  q = '',
  desde = '',
  hasta = '',
  soloProximos = false,
  soloDisponibles = false,
} = {}) {
  const [eventos, setEventos] = useState(/** @type {import('@/types/event').Event[]} */ ([]))
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const [contador, setContador] = useState(0)
  const recargar = useCallback(() => setContador((n) => n + 1), [])

  // Solo la primera carga muestra el esqueleto; al filtrar se deja la rejilla
  // anterior para que la vista no parpadee en cada tecla.
  const primeraCarga = useRef(true)

  useEffect(() => {
    const controlador = new AbortController()
    const termino = q.trim()

    const temporizador = setTimeout(
      async () => {
        if (primeraCarga.current) setCargando(true)
        setError(null)

        try {
          const lista = await getEvents(
            {
              categoriaId: categoriaId ?? undefined,
              q: termino,
              desde,
              hasta,
              soloProximos,
              soloDisponibles,
            },
            { signal: controlador.signal },
          )
          setEventos(lista)
        } catch (fallo) {
          if (controlador.signal.aborted) return
          setError(mensajeDeError(fallo, 'No pudimos cargar los eventos. Revisa tu conexión.'))
        } finally {
          if (!controlador.signal.aborted) {
            primeraCarga.current = false
            setCargando(false)
          }
        }
      },
      termino === '' ? 0 : DEBOUNCE_MS,
    )

    return () => {
      clearTimeout(temporizador)
      controlador.abort()
    }
  }, [categoriaId, contador, desde, hasta, q, soloDisponibles, soloProximos])

  return { eventos, cargando, error, recargar }
}
