import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { getEvents } from '@services/eventsService'

/** Espera antes de consultar mientras el usuario sigue escribiendo. */
const DEBOUNCE_MS = 300

/**
 * Catalogo de eventos (RF "Ver catalogo de eventos"), paginado.
 *
 * Los filtros y la paginacion (50 por tanda) los resuelve el backend; de ahi
 * `total` y `cargarMas()`. Los argumentos son primitivos para no rehacer el efecto.
 *
 * @param {{ categoriaId?: number|string|null, q?: string, desde?: string,
 *           hasta?: string, soloProximos?: boolean, soloPasados?: boolean,
 *           soloDisponibles?: boolean }} [filtros]
 */
export function useEventos({
  categoriaId = null,
  q = '',
  desde = '',
  hasta = '',
  soloProximos = false,
  soloPasados = false,
  soloDisponibles = false,
} = {}) {
  const [eventos, setEventos] = useState(/** @type {import('@/types/event').Event[]} */ ([]))
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const [contador, setContador] = useState(0)
  const recargar = useCallback(() => setContador((n) => n + 1), [])

  // Solo la primera carga muestra el esqueleto; al filtrar se deja la rejilla.
  const primeraCarga = useRef(true)

  useEffect(() => {
    const controlador = new AbortController()
    const termino = q.trim()

    const temporizador = setTimeout(
      async () => {
        if (primeraCarga.current) setCargando(true)
        setError(null)

        try {
          // `offset: 0` explicito: un offset heredado del filtro anterior
          // traeria una "pagina 2" que no corresponde.
          const { total: totalRecibido, eventos: pagina } = await getEvents(
            {
              categoriaId: categoriaId ?? undefined,
              q: termino,
              desde,
              hasta,
              soloProximos,
              soloPasados,
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
  }, [categoriaId, contador, desde, hasta, q, soloDisponibles, soloPasados, soloProximos])

  /**
   * Pide la siguiente tanda y la anade a la rejilla. Tiene su propio estado,
   * `cargandoMas`, para no hacer desaparecer lo ya visible.
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
    // Mientras `total` no ha llegado, `hayMas` da `false`; lo cubre `cargando`.
    hayMas: eventos.length < total,
    error,
    recargar,
    cargarMas,
  }
}
