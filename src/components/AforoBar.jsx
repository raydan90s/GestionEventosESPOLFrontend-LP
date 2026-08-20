import { AFORO_BAR_CLASS, aforoNivel, aforoPorcentaje, cuposDisponibles } from '@utils/aforo'
import { cn } from '@utils/cn'

/**
 * Indicador de ocupacion: rotulo, cifra, barra y cupos restantes.
 *
 * Manda el `cuposDisponibles` del servidor; si no llega se deduce del aforo.
 * La barra solo se pone roja cuando no queda ni un cupo (ver PALETA.md §2).
 *
 * @param {{
 *   inscritos: number,
 *   cupoMaximo: number,
 *   cuposDisponibles?: number,
 *   className?: string,
 * }} props
 */
export function AforoBar({ inscritos, cupoMaximo, cuposDisponibles: libresApi, className }) {
  const porcentaje = aforoPorcentaje(inscritos, cupoMaximo)
  const libres = libresApi ?? cuposDisponibles(inscritos, cupoMaximo)
  const lleno = libres <= 0
  const apretado = !lleno && aforoNivel(porcentaje) !== 'success'

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-fg-muted">Ocupación</span>
        <span className="font-medium tabular-nums text-fg">
          {inscritos} / {cupoMaximo}
        </span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-pill bg-card-sunken"
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Ocupación del evento"
      >
        <div
          className={cn(
            'h-full rounded-pill transition-all',
            AFORO_BAR_CLASS[lleno ? 'lleno' : 'libre'],
          )}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <p
        className={cn(
          'text-xs font-medium',
          lleno ? 'text-danger' : apretado ? 'text-primary' : 'text-fg-muted',
        )}
      >
        {lleno ? 'Sin cupos' : libres === 1 ? 'Queda 1 cupo' : `Quedan ${libres} cupos`}
      </p>
    </div>
  )
}
