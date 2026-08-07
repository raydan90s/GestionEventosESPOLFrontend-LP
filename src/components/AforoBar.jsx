import { AFORO_BAR_CLASS, aforoNivel, aforoPorcentaje, cuposDisponibles } from '@utils/aforo'
import { cn } from '@utils/cn'

/**
 * Barra de aforo. Verde hasta 60 %, ámbar 60–90 %, rojo por encima de 90 %.
 * @param {{ inscritos: number, cupoMaximo: number, className?: string }} props
 */
export function AforoBar({ inscritos, cupoMaximo, className }) {
  const porcentaje = aforoPorcentaje(inscritos, cupoMaximo)
  const nivel = aforoNivel(porcentaje)
  const libres = cuposDisponibles(inscritos, cupoMaximo)

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-fg-muted">
          {inscritos} / {cupoMaximo} inscritos
        </span>
        <span
          className={cn(
            'font-medium',
            nivel === 'danger' && 'text-danger',
            nivel === 'warning' && 'text-warning',
            nivel === 'success' && 'text-fg-subtle',
          )}
        >
          {libres === 0 ? 'Sin cupos' : `${libres} disponibles`}
        </span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-pill bg-card-muted"
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Ocupación del evento"
      >
        <div
          className={cn('h-full rounded-pill transition-all', AFORO_BAR_CLASS[nivel])}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}
