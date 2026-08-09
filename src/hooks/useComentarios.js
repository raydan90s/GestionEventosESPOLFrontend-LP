import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { crearComentario, erroresDeCampo, getComentarios } from '@services/comentariosService'

/** Formulario vacío. */
const VACIO = Object.freeze({ autor: '', contenido: '' })

/**
 * Comentarios de un evento: lectura y escritura
 * (RF "Ver comentarios" y "Escribir comentario", Eimmy Ochoa).
 *
 * Tras publicar no se recarga la lista entera: se antepone el comentario que
 * devolvió la API, que ya trae su id y su fecha reales del servidor.
 *
 * @param {string | number | undefined} eventoId
 */
export function useComentarios(eventoId) {
  const [comentarios, setComentarios] = useState(
    /** @type {import('@/types/event').Comment[]} */ ([]),
  )
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const [valores, setValores] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState(/** @type {Record<string, string>} */ ({}))
  const [errorEnvio, setErrorEnvio] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    if (eventoId === undefined || eventoId === null || eventoId === '') return undefined

    const controlador = new AbortController()

    getComentarios(eventoId, { signal: controlador.signal })
      .then((resultado) => {
        setComentarios(resultado.comentarios)
        setTotal(resultado.total)
        setError(null)
      })
      .catch((fallo) => {
        if (controlador.signal.aborted) return
        setError(mensajeDeError(fallo, 'No pudimos cargar los comentarios.'))
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [eventoId])

  /** Actualiza un campo y limpia su error, para que desaparezca al corregirlo. */
  const cambiar = useCallback((campo, valor) => {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => {
      if (!(campo in previos)) return previos
      const { [campo]: _descartado, ...resto } = previos
      return resto
    })
  }, [])

  const publicar = useCallback(
    async (evento) => {
      evento?.preventDefault()
      if (enviando) return

      setEnviando(true)
      setErrores({})
      setErrorEnvio(null)

      try {
        const creado = await crearComentario(eventoId, valores)

        setComentarios((previos) => [creado, ...previos])
        setTotal((n) => n + 1)
        setValores(VACIO)
      } catch (fallo) {
        const porCampo = erroresDeCampo(fallo)

        if (Object.keys(porCampo).length > 0) {
          setErrores(porCampo)
        } else {
          setErrorEnvio(mensajeDeError(fallo, 'No se pudo publicar el comentario.'))
        }
      } finally {
        setEnviando(false)
      }
    },
    [enviando, eventoId, valores],
  )

  return {
    comentarios,
    total,
    cargando,
    error,
    valores,
    cambiar,
    publicar,
    enviando,
    errores,
    errorEnvio,
  }
}
