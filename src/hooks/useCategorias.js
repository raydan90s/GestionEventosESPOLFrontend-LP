import { useEffect, useState } from 'react'
import { getCategorias } from '@services/categoriasService'
import { mensajeDeError } from '@services/apiErrors'

/**
 * Categorias preestablecidas, leidas de la API. Se cargan una sola vez.
 * Si fallan, el error se expone pero no bloquea: el catalogo sigue usable.
 */
export function useCategorias() {
  const [categorias, setCategorias] = useState(
    /** @type {import('@/types/event').Category[]} */ ([]),
  )
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    const controlador = new AbortController()

    getCategorias({ signal: controlador.signal })
      .then((lista) => {
        setCategorias(lista)
        setError(null)
      })
      .catch((fallo) => {
        if (controlador.signal.aborted) return
        setError(mensajeDeError(fallo, 'No se pudieron cargar las categorías.'))
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [])

  return { categorias, cargando, error }
}
