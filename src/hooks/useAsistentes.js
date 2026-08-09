import { useCallback, useEffect, useRef, useState } from 'react'
import { getAsistentes } from '@services/inscripcionesService'

/** Espera antes de consultar mientras el organizador sigue escribiendo. */
const DEBOUNCE_MS = 300

/**
 * Listado de asistentes de un evento (RF "Ver asistentes").
 *
 * La búsqueda la resuelve el backend (`?q=`), no el cliente: el listado puede
 * ser largo y el filtro debe aplicarse sobre todos los inscritos, no sobre los
 * que ya se descargaron. Por eso se espera a que el organizador deje de
 * escribir y se cancela la petición anterior con `AbortController`, de modo que
 * una respuesta lenta no pise a otra más reciente.
 *
 * @param {string | number} eventoId
 * @param {string} [busqueda] Nombre, matrícula o correo.
 */
export function useAsistentes(eventoId, busqueda = '') {
  const [evento, setEvento] = useState(
    /** @type {import('@/types/event').EventSummary | null} */ (null),
  )
  const [asistentes, setAsistentes] = useState(
    /** @type {import('@/types/event').Attendee[]} */ ([]),
  )
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  // Cambiarlo fuerza una recarga sin tocar los parámetros de la consulta.
  const [contador, setContador] = useState(0)
  const recargar = useCallback(() => setContador((n) => n + 1), [])

  // La primera carga muestra el esqueleto; las búsquedas posteriores dejan la
  // tabla anterior visible para que la vista no parpadee en cada tecla.
  const primeraCarga = useRef(true)

  useEffect(() => {
    if (eventoId === undefined || eventoId === null || eventoId === '') return undefined

    const controlador = new AbortController()
    const termino = busqueda.trim()

    const temporizador = setTimeout(
      async () => {
        if (primeraCarga.current) setCargando(true)
        setError(null)

        try {
          const resultado = await getAsistentes(eventoId, {
            q: termino,
            signal: controlador.signal,
          })

          setEvento(resultado.evento)
          setAsistentes(resultado.asistentes)
          setTotal(resultado.total)
        } catch (fallo) {
          // Abortar es el flujo normal cuando se sigue escribiendo: no es un error.
          if (controlador.signal.aborted) return
          setError(fallo.message ?? 'No se pudo cargar el listado de asistentes.')
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
  }, [busqueda, contador, eventoId])

  return { evento, asistentes, total, cargando, error, recargar }
}
