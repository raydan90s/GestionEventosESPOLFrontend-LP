import { useCallback, useState } from 'react'
import {
  erroresDeCampo,
  esConflictoDeAforo,
  registrarInscripcion,
} from '@services/inscripcionesService'

/** Formulario vacío. */
const VACIO = Object.freeze({ nombre: '', correo: '', matricula: '', telefono: '' })

/**
 * Estado del formulario de inscripción (RF "Registrar inscripción").
 *
 * Separa tres tipos de fallo, porque cada uno se pinta distinto:
 * - `errores`: validación por campo (HTTP 422), debajo del input correspondiente.
 * - `conflicto`: el evento no admite la inscripción —sin cupos, correo repetido,
 *   evento cancelado o ya realizado— (HTTP 409). Es un aviso, no un error del usuario.
 * - `error`: cualquier otra cosa (red caída, 500).
 *
 * @param {string | number} eventoId
 * @param {(registro: import('@/types/event').Registration) => void} [onExito]
 *   Se llama tras un registro exitoso, para que la vista refresque el aforo.
 */
export function useInscripcion(eventoId, onExito) {
  const [valores, setValores] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState(/** @type {Record<string, string>} */ ({}))
  const [conflicto, setConflicto] = useState(/** @type {string | null} */ (null))
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [registro, setRegistro] = useState(
    /** @type {import('@/types/event').Registration | null} */ (null),
  )

  /** Actualiza un campo y limpia su error, para que desaparezca al corregirlo. */
  const cambiar = useCallback((campo, valor) => {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => {
      if (!(campo in previos)) return previos
      const { [campo]: _descartado, ...resto } = previos
      return resto
    })
  }, [])

  const reiniciar = useCallback(() => {
    setValores(VACIO)
    setErrores({})
    setConflicto(null)
    setError(null)
    setRegistro(null)
  }, [])

  const enviar = useCallback(
    async (evento) => {
      evento?.preventDefault()
      if (enviando) return

      setEnviando(true)
      setErrores({})
      setConflicto(null)
      setError(null)

      try {
        const creado = await registrarInscripcion(eventoId, valores)
        setRegistro(creado)
        setValores(VACIO)
        onExito?.(creado)
      } catch (fallo) {
        const porCampo = erroresDeCampo(fallo)

        if (Object.keys(porCampo).length > 0) {
          setErrores(porCampo)
        } else if (esConflictoDeAforo(fallo)) {
          setConflicto(fallo.message)
        } else {
          setError(fallo.message ?? 'No se pudo completar la inscripción. Intenta de nuevo.')
        }
      } finally {
        setEnviando(false)
      }
    },
    [enviando, eventoId, onExito, valores],
  )

  return { valores, cambiar, enviar, reiniciar, enviando, errores, conflicto, error, registro }
}
