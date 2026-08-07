import { useParams } from 'react-router-dom'

/** Detalle de un evento: datos, aforo, asistentes y comentarios. */
export default function EventoDetallePage() {
  const { id } = useParams()

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Detalle del evento #{id}</h1>
      <p className="text-sm text-fg-muted">
        Pendiente: datos del evento, barra de aforo, formulario de inscripción, listado de
        asistentes y comentarios.
      </p>

      {/* Los comentarios usan `card-muted` sin bordes de color. */}
      <div className="rounded-card bg-card-muted p-4 text-sm text-fg-muted">
        Aquí van los comentarios de la comunidad.
      </div>
    </section>
  )
}
