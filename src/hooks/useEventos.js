import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { getEvents } from '@services/eventsService'

/** Espera antes de consultar mientras el usuario sigue escribiendo. */
const DEBOUNCE_MS = 300

/**
 * Catálogo de eventos (RF "Ver catálogo de eventos"), paginado.
 *
 * El filtro por categoría, el rango de fechas y la búsqueda los resuelve el
 * backend, no el cliente: el catálogo puede crecer y no tiene sentido
 * descargarlo entero para filtrarlo en memoria. Por la misma razón el
 * backend pagina de 50 en 50, así que este hook también expone `total` y
 * `cargarMas()` para pedir la siguiente tanda.
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
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
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
          // `offset: 0` explícito: este efecto se relanza con cada cambio de
          // filtro, y un offset heredado del filtro anterior traería una
          // "página 2" que no corresponde a lo que se acaba de pedir.
          const { total: totalRecibido, eventos: pagina } = await getEvents(
            {
              categoriaId: categoriaId ?? undefined,
              q: termino,
              desde,
              hasta,
              soloProximos,
              soloDisponibles,
              offset: 0,
            },
            { signal: controlador.signal },
          )
          setEventos(pagina)
          setTotal(totalRecibido)
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

  /**
   * Pide la siguiente tanda a partir de lo que ya hay cargado y la añade a la
   * rejilla existente. No usa `cargando` para no hacer desaparecer la rejilla
   * ya visible: tiene su propio estado, `cargandoMas`.
   */
  const cargarMas = useCallback(async () => {
    if (cargandoMas) return

    setCargandoMas(true)
    setError(null)

    try {
      const { total: totalRecibido, eventos: pagina } = await getEvents({
        categoriaId: categoriaId ?? undefined,
        q: q.trim(),
        desde,
        hasta,
        soloProximos,
        soloDisponibles,
        offset: eventos.length,
      })
      setEventos((previos) => [...previos, ...pagina])
      setTotal(totalRecibido)
    } catch (fallo) {
      setError(mensajeDeError(fallo, 'No pudimos cargar más eventos. Intenta de nuevo.'))
    } finally {
      setCargandoMas(false)
    }
  }, [cargandoMas, categoriaId, q, desde, hasta, soloProximos, soloDisponibles, eventos.length])

  return {
    eventos,
    total,
    cargando,
    cargandoMas,
    // Mientras `total` no ha llegado (primera carga en curso) `hayMas` da
    // `false`: no hay nada que ofrecer todavía, y `cargando` ya cubre ese caso.
    hayMas: eventos.length < total,
    error,
    recargar,
    cargarMas,
  }
}
