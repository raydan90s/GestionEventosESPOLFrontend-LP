import { EVENT_STATUS, EVENT_STATUS_META } from '@constants/eventStatus'
import { cn } from '@utils/cn'

/**
 * Distintivo de estado: "Cancelado", "Finalizado", "Ya paso" o "Agotado".
 *
 * Solo se pinta uno: manda el estado sobre la fecha, y la fecha sobre el aforo.
 * Un evento activo, por venir y con cupos devuelve `null`.
 *
 * @param {{ estado: string, pasado?: boolean, lleno?: boolean, className?: string }} props
 */
export function StatusBadge({ estado, pasado = false, lleno = false, className }) {
  const meta = EVENT_STATUS_META[estado]

  if (estado !== EVENT_STATUS.ACTIVO && meta) {
    return <Badge className={cn(meta.chip, className)}>{meta.label}</Badge>
  }

  if (pasado) {
    return <Badge className={cn('bg-card-muted text-fg-subtle', className)}>Ya pasó</Badge>
  }

  if (lleno) {
    return <Badge className={cn('bg-danger-soft text-danger', className)}>Agotado</Badge>
  }

  return null
}

/** Caja comun: la forma la comparten los tres estados, solo cambia el color. */
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
