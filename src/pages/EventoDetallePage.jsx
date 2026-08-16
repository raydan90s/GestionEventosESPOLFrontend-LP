import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AforoBar } from '@components/AforoBar'
import { CategoryChip } from '@components/CategoryChip'
import { ComentariosSection } from '@components/ComentariosSection'
import { InscripcionForm } from '@components/InscripcionForm'
import { StatusBadge } from '@components/StatusBadge'
import { ArrowLeftIcon, CalendarIcon, PinIcon, UsersIcon } from '@components/icons'
import { EVENT_STATUS, EVENT_STATUS_META } from '@constants/eventStatus'
import { ROUTES, eventoAsistentes, eventoEditar } from '@constants/routes'
import { useEvento } from '@hooks/useEvento'
import { mensajeDeError } from '@services/apiErrors'
import { deleteEvent } from '@services/eventsService'
import { formatDateTime } from '@utils/formatDate'

/**
 * Detalle de un evento: datos, aforo, inscripción y comentarios.
 *
 * Dos columnas en escritorio: a la izquierda la lectura (ficha, descripción y
 * comentarios) y a la derecha, fija al hacer scroll, la decisión — el aforo y
 * el formulario de inscripción. Así el CTA no se pierde bajo un hilo largo de
 * comentarios. En móvil todo se apila y la inscripción queda antes del hilo.
 */
export default function EventoDetallePage() {
  const { id } = useParams()
  const location = useLocation()
  const { evento, cargando, error, recargar } = useEvento(id)

  /*
   * El panel de editar cierra volviendo a esta misma URL, así que esta página
   * nunca se desmonta durante el viaje de ida y vuelta y `useEvento` no vuelve
   * a pedir el evento por sí solo. `EventoEditarPage` avisa con esta marca en
   * el `state` de la navegación, y aquí se traduce a un `recargar()` explícito.
   */
  useEffect(() => {
    if (location.state?.eventoActualizado) recargar()
  }, [location.state?.eventoActualizado, recargar])

  if (cargando) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Cargando evento">
        <div className="h-6 w-24 animate-pulse rounded-chip bg-card-muted" />
        <div className="h-12 w-2/3 animate-pulse rounded bg-card-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-card-muted" />
        <div className="h-64 w-full animate-pulse rounded-card bg-card-muted" />
      </div>
    )
  }

  if (error || !evento) {
    return (
      <section className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <h1 className="font-serif text-headline font-semibold">
          No pudimos mostrar el evento
        </h1>
        <p className="text-fg-muted">{error}</p>
        <div className="flex justify-center gap-4">
          <button type="button" onClick={recargar} className="btn btn-primary">
            Reintentar
          </button>
          <Link to={ROUTES.CATALOGO} className="btn btn-ghost">
            Volver al catálogo
          </Link>
        </div>
      </section>
    )
  }

  const activo = evento.estado === EVENT_STATUS.ACTIVO
  const meta = EVENT_STATUS_META[evento.estado]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to={ROUTES.CATALOGO} className="link inline-flex items-center gap-2 text-sm">
          <ArrowLeftIcon />
          Volver al catálogo
        </Link>

        <AccionesOrganizador evento={evento} />
      </div>

      {/*
        La cabecera va fuera de la rejilla a propósito: si viviera en la columna
        izquierda, en móvil la barra lateral se apilaría entera antes o después
        de ella, y el título tiene que ir siempre primero.
      */}
      <header className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip nombre={evento.categoriaNombre} />
          <StatusBadge estado={evento.estado} />
        </div>

        <h1 className="font-serif text-headline font-semibold leading-tight md:text-display">
          {evento.titulo}
        </h1>

        <dl className="space-y-2 text-body-lg text-fg-muted">
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Fecha</dt>
            <CalendarIcon />
            <dd>{formatDateTime(evento.fecha)}</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Lugar</dt>
            <PinIcon />
            <dd>{evento.lugar}</dd>
          </div>
          {evento.organizador && (
            <div className="flex items-center gap-2.5">
              <dt className="sr-only">Organiza</dt>
              <UsersIcon />
              <dd>{evento.organizador}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {evento.descripcion && (
            <p className="whitespace-pre-line text-body-lg leading-relaxed text-fg-muted">
              {evento.descripcion}
            </p>
          )}

          <ComentariosSection eventoId={evento.id} />
        </div>

        {/* La inscripción se apila antes del hilo en móvil y se fija en escritorio. */}
        <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-24 lg:self-start">
          <div className="surface space-y-4 p-6">
            <AforoBar
              inscritos={evento.inscritos}
              cupoMaximo={evento.cupoMaximo}
              cuposDisponibles={evento.cuposDisponibles}
            />

            <Link
              to={eventoAsistentes(evento.id)}
              className="link inline-flex items-center gap-2 text-sm"
            >
              <UsersIcon />
              Ver asistentes inscritos
            </Link>
          </div>

          {activo ? (
            /*
             * `cuposDisponibles` viene del servidor, así que el botón ya se puede
             * deshabilitar antes de enviar. Aun así el backend vuelve a validar el
             * aforo dentro de una transacción: esta prop es comodidad, no control.
             * Tras inscribirse se recarga el evento para que la barra refleje el
             * cupo que acaba de descontar el servidor.
             */
            <InscripcionForm
              eventoId={evento.id}
              cuposDisponibles={evento.cuposDisponibles}
              onInscrito={recargar}
            />
          ) : (
            <p className="surface bg-card-muted px-4 py-3 text-sm text-fg-muted">
              Este evento está {meta?.label.toLowerCase() ?? evento.estado} y no admite
              inscripciones.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}

/**
 * Editar y eliminar el evento (Tarea 5 — "sólo si da el tiempo").
 *
 * Sin verificación de quién organiza —la app no tiene sesión de usuario—, así
 * que quedan visibles para cualquiera que abra el detalle, igual que el resto
 * de la vista.
 *
 * La confirmación de borrado es en línea y no un modal, mismo patrón que
 * `AccionesFila` en `AsistentesTable`: el evento que se va a eliminar sigue
 * delante mientras se decide.
 *
 * @param {{ evento: import('@/types/event').Event }} props
 */
function AccionesOrganizador({ evento }) {
  const navegar = useNavigate()
  const location = useLocation()
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const eliminar = async () => {
    setEliminando(true)
    setError(null)

    try {
      await deleteEvent(evento.id)
      navegar(ROUTES.CATALOGO, { replace: true })
    } catch (fallo) {
      setError(mensajeDeError(fallo, 'No se pudo eliminar el evento. Intenta de nuevo.'))
      setEliminando(false)
      setConfirmando(false)
    }
  }

  if (eliminando) {
    return (
      <span className="text-xs text-fg-muted" aria-live="polite">
        Eliminando…
      </span>
    )
  }

  if (confirmando) {
    return (
      <div className="inline-flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-muted">¿Eliminar este evento?</span>

        <button
          type="button"
          onClick={eliminar}
          aria-label={`Confirmar la eliminación de ${evento.titulo}`}
          className="btn btn-neutral px-3 py-1.5 text-xs"
        >
          Sí, eliminar
        </button>

        <button
          type="button"
          onClick={() => setConfirmando(false)}
          aria-label="Cancelar la eliminación"
          className="link text-xs"
        >
          No
        </button>

        {error && (
          <p role="alert" className="w-full text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        to={eventoEditar(evento.id)}
        state={{ background: location }}
        className="btn btn-neutral px-3 py-1.5 text-xs"
      >
        Editar evento
      </Link>

      <button
        type="button"
        onClick={() => setConfirmando(true)}
        aria-label={`Eliminar ${evento.titulo}`}
        className="btn btn-neutral px-3 py-1.5 text-xs"
      >
        Eliminar evento
      </button>
    </div>
  )
}
