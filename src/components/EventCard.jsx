import { Link } from 'react-router-dom'
import { AforoBar } from '@components/AforoBar'
import { CategoryChip } from '@components/CategoryChip'
import { StatusBadge } from '@components/StatusBadge'
import { CalendarIcon, PinIcon } from '@components/icons'
import { assetUrl } from '@config/api'
import { EVENT_STATUS, EVENT_STATUS_META } from '@constants/eventStatus'
import { eventoDetalle } from '@constants/routes'
import { esPasado } from '@utils/eventoTiempo'
import { formatDateTime } from '@utils/formatDate'

/**
 * Tarjeta del catálogo.
 *
 * Sigue la maqueta institucional: superficie blanca definida por un borde de
 * 1 px (nada de sombra en reposo), titular en serif y metadatos en grotesca
 * con icono. El pie de la tarjeta —aforo y acciones— se ancla abajo con
 * `mt-auto` para que las tarjetas de una misma fila alineen barras y botones
 * aunque los títulos tengan distinto número de líneas; el `pt-6` garantiza el
 * aire mínimo sobre el separador en la tarjeta más alta, donde `mt-auto` ya no
 * deja hueco.
 *
 * El aforo lo manda el servidor (`cuposDisponibles`), no se calcula aquí.
 * Regla de la paleta: el ámbar queda reservado a la acción de inscribirse, que
 * es el único elemento de acento de la tarjeta.
 *
 * `posicion` sólo escalona la animación de entrada para que la rejilla no
 * aparezca de golpe. Se recorta a las primeras filas: más allá, la espera se
 * notaría más que el efecto.
 *
 * La imagen —si el evento tiene una— va pegada al borde superior, con
 * relación de aspecto fija (`aspect-video` + `object-cover`) para que una
 * foto vertical no descuadre la rejilla; sin redondear más que el propio
 * `.surface`, que ya la recorta con `overflow-hidden`. Sin imagen, el mismo
 * hueco lo ocupa `bg-card-muted`: ningún color de categoría ni ámbar, que
 * quedan reservados a lo que sí distingue un dato.
 *
 * @param {{ event: import('@/types/event').Event, posicion?: number }} props
 */
export function EventCard({ event, posicion = 0 }) {
  const lleno = event.cuposDisponibles <= 0
  const activo = event.estado === EVENT_STATUS.ACTIVO
  const meta = EVENT_STATUS_META[event.estado]
  /*
   * Un evento cuya fecha ya pasó no admite inscripciones —el backend las
   * rechaza— así que la tarjeta no ofrece el botón ámbar aunque el evento siga
   * marcado como activo y con cupos. El catálogo sólo los lista si se piden los
   * pasados a propósito.
   */
  const pasado = esPasado(event.fecha)
  const cerrado = lleno || !activo || pasado
  const destino = eventoDetalle(event.id)

  return (
    <article
      className="animate-fade-up surface flex flex-col overflow-hidden transition-shadow hover:shadow-hover"
      style={{ animationDelay: `${Math.min(posicion, 8) * 60}ms` }}
    >
      {event.imagenUrl ? (
        <img
          src={assetUrl(event.imagenUrl)}
          // Decorativa: el título ya está en texto debajo. `lazy` porque en
          // una rejilla de hasta 50 tarjetas se nota cargar todo de golpe.
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="aspect-video w-full bg-card-muted" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CategoryChip nombre={event.categoriaNombre} />
          <StatusBadge estado={event.estado} pasado={pasado} lleno={lleno} />
        </div>

        <h3 className="mt-4 font-serif text-title font-semibold leading-snug">
          <Link to={destino} className="transition-colors hover:text-primary">
            {event.titulo}
          </Link>
        </h3>

        <dl className="mt-3 space-y-1.5 text-sm text-fg-muted">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Fecha</dt>
            <CalendarIcon />
            <dd>{formatDateTime(event.fecha)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Lugar</dt>
            <PinIcon />
            <dd>{event.lugar}</dd>
          </div>
        </dl>

        {event.descripcion && (
          <p className="mt-3 line-clamp-2 text-sm text-fg-muted">{event.descripcion}</p>
        )}

        <div className="mt-auto pt-6">
          <AforoBar
            inscritos={event.inscritos}
            cupoMaximo={event.cupoMaximo}
            cuposDisponibles={event.cuposDisponibles}
            className="border-t border-edge pt-4"
          />

          <div className="mt-4 flex items-center gap-3">
            {/* Ámbar: única acción de acento de la tarjeta. La inscripción se
                completa en el detalle, que es donde vive el formulario. */}
            {cerrado ? (
              <span className="btn flex-1 cursor-not-allowed bg-card-muted text-fg-subtle">
                {/* Mismo orden que el distintivo: estado, luego fecha, luego aforo. */}
                {!activo
                  ? (meta?.label ?? 'No disponible')
                  : pasado
                    ? 'Ya se realizó'
                    : 'Sin cupos'}
              </span>
            ) : (
              <Link to={destino} className="btn btn-accent flex-1">
                Inscribirse
              </Link>
            )}

            <Link to={destino} className="btn btn-ghost flex-1">
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
