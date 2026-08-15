import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { cancelarInscripcion, getAsistentes } from '@services/inscripcionesService'

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

  // Id de la inscripción que se está dando de baja, para bloquear su fila y que
  // no se pueda pulsar dos veces. Es uno solo: se cancela de una en una.
  const [cancelandoId, setCancelandoId] = useState(/** @type {number | null} */ (null))
  const [errorCancelar, setErrorCancelar] = useState(/** @type {string | null} */ (null))

  // Cambiarlo fuerza una recarga sin tocar los parámetros de la consulta.
  const [contador, setContador] = useState(0)
  const recargar = useCallback(() => setContador((n) => n + 1), [])

  // La primera carga muestra el esqueleto; las búsquedas posteriores dejan la
  // tabla anterior visible para que la vista no parpadee en cada tecla.
  const primeraCarga = useRef(true)

  /*
   * Sin id no hay nada que pedir. `cargando` se apaga por cálculo y no con un
   * `setCargando(false)` en la salida temprana del efecto: si el estado se
   * quedara en `true` —su valor inicial— la tabla enseñaría los esqueletos para
   * siempre. Hoy la ruta siempre trae id, así que esto es un seguro.
   */
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
   * Da de baja una inscripción y devuelve el cupo al evento.
   *
   * Al terminar se recarga en vez de quitar la fila en memoria: el `DELETE`
   * también cambia el aforo, y el resumen del encabezado sale de la misma
   * respuesta que el listado. Descontarlo aquí sería volver a decidir cupos en
   * el cliente, que es justo lo que este módulo no hace.
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
