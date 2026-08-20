import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { cancelarInscripcion, getAsistentes } from '@services/inscripcionesService'

/** Espera antes de consultar mientras el organizador sigue escribiendo. */
const DEBOUNCE_MS = 300

/**
 * Listado de asistentes de un evento (RF "Ver asistentes").
 *
 * La busqueda la resuelve el backend (`?q=`) sobre todos los inscritos, no solo
 * los descargados. Se cancela la peticion anterior con `AbortController`.
 *
 * @param {string | number} eventoId
 * @param {string} [busqueda] Nombre, matricula o correo.
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

  // Inscripcion que se esta dando de baja, para bloquear su fila.
  const [cancelandoId, setCancelandoId] = useState(/** @type {number | null} */ (null))
  const [errorCancelar, setErrorCancelar] = useState(/** @type {string | null} */ (null))

  // Cambiarlo fuerza una recarga sin tocar los parametros de la consulta.
  const [contador, setContador] = useState(0)
  const recargar = useCallback(() => setContador((n) => n + 1), [])

  // Solo la primera carga muestra el esqueleto; al buscar se deja la tabla.
  const primeraCarga = useRef(true)

  // Sin id no hay nada que pedir. `cargando` se apaga por calculo: si se quedara
  // en `true` la tabla ensenaria los esqueletos para siempre.
  const sinId = eventoId === undefined || eventoId === null || eventoId === ''

  useEffect(() => {
    if (sinId) return undefined

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
  }, [busqueda, contador, eventoId, sinId])

  /**
   * Da de baja una inscripcion y devuelve el cupo al evento. Recarga en vez de
   * quitar la fila: el `DELETE` tambien cambia el aforo del encabezado.
   *
   * @param {number} inscripcionId
   */
  const cancelar = useCallback(
    async (inscripcionId) => {
      setCancelandoId(inscripcionId)
      setErrorCancelar(null)

      try {
        await cancelarInscripcion(inscripcionId)
        recargar()
      } catch (fallo) {
        setErrorCancelar(mensajeDeError(fallo, 'No se pudo cancelar la inscripción.'))
      } finally {
        setCancelandoId(null)
      }
    },
    [recargar],
  )

  return {
    evento,
    asistentes,
    total,
    cargando: cargando && !sinId,
    error,
    recargar,
    cancelar,
    cancelandoId,
    errorCancelar,
  }
}
