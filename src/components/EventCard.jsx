import { Link } from 'react-router-dom'
import { AforoBar } from '@components/AforoBar'
import { CategoryChip } from '@components/CategoryChip'
import { eventoDetalle } from '@constants/routes'
import { cuposDisponibles } from '@utils/aforo'
import { formatDateTime } from '@utils/formatDate'

/**
 * Tarjeta del catálogo.
 *
 * Demuestra los alias (`@components`, `@constants`, `@utils`) y las reglas de la paleta:
 * el título es azul institucional al pasar el mouse, y el ámbar queda reservado
 * al botón de inscripción.
 *
 * @param {{ event: import('@/types/event').Event }} props
 */
export function EventCard({ event }) {
  const libres = cuposDisponibles(event.inscritos, event.cupoMaximo)
  const lleno = libres === 0

  return (
    <article className="animate-fade-up flex flex-col gap-4 rounded-card border border-edge bg-card p-5 shadow-card transition-colors hover:bg-card-hover">
      <header className="space-y-2">
        <CategoryChip categoryId={event.categoriaId} />

        <h3 className="text-lg font-semibold leading-snug">
          <Link to={eventoDetalle(event.id)} className="hover:text-primary">
            {event.titulo}
          </Link>
        </h3>

        <p className="text-sm text-fg-muted">
          {formatDateTime(event.fecha)} · {event.lugar}
        </p>
      </header>

      <p className="line-clamp-3 text-sm text-fg-muted">{event.descripcion}</p>

      <AforoBar inscritos={event.inscritos} cupoMaximo={event.cupoMaximo} className="mt-auto" />

      <div className="flex items-center gap-3">
        {/* Ámbar: única acción de inscripción de la tarjeta. */}
        <button
          type="button"
          disabled={lleno}
          className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-card-muted disabled:text-fg-subtle"
        >
          {lleno ? 'Sin cupos' : 'Inscribirme'}
        </button>

        <Link
          to={eventoDetalle(event.id)}
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  )
}
