import { useEffect, useId, useRef } from 'react'
import { CloseIcon } from '@components/icons'

/**
 * Panel lateral modal, deslizado desde la derecha sobre la vista actual.
 *
 * Es un `<dialog>` nativo abierto con `showModal()`: el navegador atrapa el
 * foco, cierra con Escape y deja inerte el fondo sin pelear con `z-index`.
 *
 * @param {{
 *   titulo: string,
 *   onClose: () => void,
 *   children: import('react').ReactNode,
 * }} props
 */
export function SidePanel({ titulo, onClose, children }) {
  const dialogo = useRef(/** @type {HTMLDialogElement | null} */ (null))
  const tituloId = useId()

  useEffect(() => {
    const elemento = dialogo.current
    if (!elemento.open) elemento.showModal()

    // Al desmontar se cierra sin avisar a `onClose`. Se escucha `cancel`
    // (Escape) y no `close`, que provocaria una segunda navegacion.
    return () => elemento.close()
  }, [])

  const cancelar = (evento) => {
    evento.preventDefault()
    onClose()
  }

  // Un clic que aterriza en el propio `<dialog>` es un clic en el fondo: el
  // contenido lo tapa por completo.
  const clicEnFondo = (evento) => {
    if (evento.target === dialogo.current) onClose()
  }

  return (
    <dialog
      ref={dialogo}
      onCancel={cancelar}
      onClick={clicEnFondo}
      aria-labelledby={tituloId}
      className="side-panel"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-edge px-6 py-4">
          <h2 id={tituloId} className="font-serif text-title font-semibold">
            {titulo}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="btn btn-neutral border-transparent px-2 text-base"
          >
            <CloseIcon />
          </button>
        </header>

        {children}
      </div>
    </dialog>
  )
}
