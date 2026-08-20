import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDownIcon } from '@components/icons'
import { cn } from '@utils/cn'

/**
 * Boton que despliega un panel flotante.
 *
 * No es modal como `@components/SidePanel`, asi que el cierre por Escape y por
 * clic fuera se resuelve aqui. `children` recibe `cerrar` y decide si cerrarlo.
 *
 * @param {{
 *   etiqueta: string,
 *   valor?: string,
 *   activo?: boolean,
 *   icono?: React.ComponentType<{ className?: string }>,
 *   className?: string,
 *   alineacion?: 'izquierda' | 'derecha',
 *   children: (cerrar: () => void) => React.ReactNode,
 * }} props
 */
export function Desplegable({
  etiqueta,
  valor,
  activo = false,
  icono: Icono,
  className,
  alineacion = 'izquierda',
  children,
}) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(/** @type {HTMLDivElement | null} */ (null))
  const disparador = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const panelId = useId()

  const cerrar = () => setAbierto(false)

  // Clic fuera y Escape. Se escucha en `pointerdown` y no en `click` para que
  // el panel se cierre al empezar el gesto, no al soltarlo.
  useEffect(() => {
    if (!abierto) return undefined

    const alPulsarFuera = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false)
    }

    const alTeclear = (evento) => {
      if (evento.key !== 'Escape') return

      setAbierto(false)
      // El foco vuelve al boton: si se cerro con el teclado, el tabulador
      // continua desde donde estaba y no desde el principio de la pagina.
      disparador.current?.focus()
    }

    document.addEventListener('pointerdown', alPulsarFuera)
    document.addEventListener('keydown', alTeclear)

    return () => {
      document.removeEventListener('pointerdown', alPulsarFuera)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [abierto])

  return (
    <div ref={contenedor} className="relative">
      <button
        ref={disparador}
        type="button"
        onClick={() => setAbierto((estaba) => !estaba)}
        aria-expanded={abierto}
        aria-controls={panelId}
        className={cn(
          'btn btn-neutral gap-1.5 py-2',
          // Con filtro puesto el boton se queda marcado aunque el panel este
          // plegado: el filtro sigue actuando y tiene que verse.
          activo && 'border-secondary text-secondary',
          className,
        )}
      >
        {Icono && <Icono className="h-4 w-4" />}
        <span>{etiqueta}</span>
        {/* El valor elegido va dentro del boton para no gastar una fila extra. */}
        {valor && <span className="font-semibold">{valor}</span>}
        <ChevronDownIcon
          className={cn('h-4 w-4 transition-transform', abierto && 'rotate-180')}
        />
      </button>

      {abierto && (
        <div
          id={panelId}
          className={cn(
            'surface absolute top-full z-30 mt-2 w-max min-w-56 max-w-[min(20rem,90vw)] p-2 shadow-lg',
            alineacion === 'derecha' ? 'right-0' : 'left-0',
          )}
        >
          {children(cerrar)}
        </div>
      )}
    </div>
  )
}
