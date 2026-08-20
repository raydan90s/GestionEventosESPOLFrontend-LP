import { EVENT_STATUS, EVENT_STATUS_META } from '@constants/eventStatus'
import { cn } from '@utils/cn'

/**
 * Distintivo de estado de un evento: «Cancelado», «Finalizado», «Ya pasó» o
 * «Agotado».
 *
 * Va en versalitas a propósito, para que no se confunda con el chip de
 * categoría, que es del mismo tamaño y vive a su lado en la tarjeta: la
 * categoría describe el evento y se lee en caja baja; el estado interrumpe y se
 * lee en mayúsculas.
 *
 * **El estado manda sobre la fecha, y la fecha sobre el aforo**: un evento
 * cancelado no se anuncia como pasado, y uno que ya se realizó no se anuncia
 * como agotado —que no queden cupos da igual cuando ya no se puede asistir—.
 * Por eso sólo se pinta un distintivo, y la decisión de cuál vive aquí y no en
 * cada vista.
 *
 * «Ya pasó» no es el estado `finalizado` de la base: es la fecha, que ya quedó
 * atrás aunque nadie haya cerrado el evento a mano. Se anuncia igual porque
 * para quien lee tiene la misma consecuencia —no hay inscripción posible— y
 * porque el catálogo puede listarlo si se piden los eventos pasados.
 *
 * Un evento activo, por venir y con cupos no tiene nada que anunciar: devuelve
 * `null`.
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
