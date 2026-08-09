import { EVENT_STATUS, EVENT_STATUS_META } from '@constants/eventStatus'
import { cn } from '@utils/cn'

/**
 * Distintivo de estado de un evento: «Cancelado», «Finalizado» o «Agotado».
 *
 * Va en versalitas a propósito, para que no se confunda con el chip de
 * categoría, que es del mismo tamaño y vive a su lado en la tarjeta: la
 * categoría describe el evento y se lee en caja baja; el estado interrumpe y se
 * lee en mayúsculas.
 *
 * **El estado manda sobre el aforo**: un evento cancelado no se anuncia como
 * agotado aunque no le queden cupos. Por eso sólo se pinta un distintivo, y la
 * decisión de cuál vive aquí y no en cada vista.
 *
 * Un evento activo con cupos no tiene nada que anunciar: devuelve `null`.
 *
 * @param {{ estado: string, lleno?: boolean, className?: string }} props
 */
export function StatusBadge({ estado, lleno = false, className }) {
  const meta = EVENT_STATUS_META[estado]

  if (estado !== EVENT_STATUS.ACTIVO && meta) {
    return <Badge className={cn(meta.chip, className)}>{meta.label}</Badge>
  }

  if (lleno) {
    return <Badge className={cn('bg-danger-soft text-danger', className)}>Agotado</Badge>
  }

  return null
}

/** Caja común: la forma la comparten los tres estados, sólo cambia el color. */
function Badge({ className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-chip px-2.5 py-1 text-xs font-semibold',
        'uppercase tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  )
}
