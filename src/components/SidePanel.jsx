import { useEffect, useId, useRef } from 'react'
import { CloseIcon } from '@components/icons'

/**
 * Panel lateral modal, deslizado desde la derecha sobre la vista actual.
 *
 * Es un `<dialog>` nativo abierto con `showModal()`, no un `div` con
 * `position: fixed`. Así el navegador se encarga gratis de lo que suele salir
 * mal en un modal hecho a mano: atrapar el foco dentro, cerrar con Escape,
 * dejar inerte y sin scroll todo lo que hay detrás, y ponerlo en la capa
 * superior sin pelearse con ningún `z-index`.
 *
 * El contenido se recibe entero (`children`) para que quepa un `<form>` con su
 * propia zona de scroll y su pie de botones; el panel sólo pone el marco y la
 * cabecera.
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

    // Al desmontar se cierra sin avisar a `onClose`: el cierre ya lo decidió
    // quien nos desmontó. Por eso se escucha `cancel` (Escape) y no `close`,
    // que también dispararía aquí y provocaría una segunda navegación.
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
