import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '@services/apiErrors'
import { AUTOR_MAX, AUTOR_MIN, COMENTARIO_MAX, COMENTARIO_MIN, COMENTARIOS_POR_PAGINA, crearComentario, erroresDeCampo, getComentarios } from '@services/comentariosService'

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
  const [cargandoMas, setCargandoMas] = useState(false)
  const offsetRef = useRef(0)

  useEffect(() => {
    if (eventoId === undefined || eventoId === null || eventoId === '') return undefined

    const controlador = new AbortController()
    offsetRef.current = 0

    getComentarios(eventoId, { limite: COMENTARIOS_POR_PAGINA, offset: 0, signal: controlador.signal })
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

      const autorTrim = valores.autor.trim()
      const contenidoTrim = valores.contenido.trim()
      const fallosValidacion = {}

      if (autorTrim.length < AUTOR_MIN || autorTrim.length > AUTOR_MAX) {
        fallosValidacion.autor = `El nombre debe tener entre ${AUTOR_MIN} y ${AUTOR_MAX} caracteres.`
      }

      if (contenidoTrim.length < COMENTARIO_MIN || contenidoTrim.length > COMENTARIO_MAX) {
        fallosValidacion.contenido = `El comentario debe tener entre ${COMENTARIO_MIN} y ${COMENTARIO_MAX} caracteres.`
      }

      if (Object.keys(fallosValidacion).length > 0) {
        setErrores(fallosValidacion)
        setEnviando(false)
        return
      }

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

  const cargarMas = useCallback(async () => {
    if (cargandoMas) return
    setCargandoMas(true)

    const nuevoOffset = offsetRef.current + COMENTARIOS_POR_PAGINA

    try {
      const resultado = await getComentarios(eventoId, { limite: COMENTARIOS_POR_PAGINA, offset: nuevoOffset })
      setComentarios((previos) => [...previos, ...resultado.comentarios])
      offsetRef.current = nuevoOffset
    } catch (fallo) {
      console.error(fallo)
    } finally {
      setCargandoMas(false)
    }
  }, [cargandoMas, eventoId])

  const hayMas = comentarios.length < total

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
    cargarMas,
    cargandoMas,
    hayMas,
  }
}
