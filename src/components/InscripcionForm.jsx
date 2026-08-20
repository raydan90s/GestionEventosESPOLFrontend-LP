import { FormField } from '@components/FormField'
import { useInscripcion } from '@hooks/useInscripcion'

/**
 * Formulario de inscripcion a un evento (RF "Registrar inscripcion", Diego Parrales).
 *
 * El cupo lo descuenta el servidor. `cuposDisponibles` solo adelanta el estado
 * "sin cupos"; si llega `undefined`, avisa el 409 del backend.
 *
 * @param {{
 *   eventoId: string | number,
 *   cuposDisponibles?: number,
 *   onInscrito?: (registro: import('@/types/event').Registration) => void,
 * }} props
 */
export function InscripcionForm({ eventoId, cuposDisponibles, onInscrito }) {
  const { valores, cambiar, enviar, reiniciar, enviando, errores, conflicto, error, registro } =
    useInscripcion(eventoId, onInscrito)

  const sinCupos = cuposDisponibles !== undefined && cuposDisponibles <= 0

  if (registro) {
    return (
      <section className="animate-fade-up surface space-y-3 bg-success-soft p-6">
        <h2 className="font-serif text-lg font-semibold text-success">
          Inscripción confirmada
        </h2>

        {/* No se promete correo de confirmacion: el backend no manda ninguno.
            El correo se repite solo como referencia de lo guardado. */}
        <p className="text-sm text-fg">
          Guardamos tu inscripción a <strong>{registro.eventoTitulo}</strong> a nombre de{' '}
          {registro.nombre} ({registro.correo}).
        </p>

        <p className="text-sm text-fg-muted">
          {registro.cuposRestantes === 0
            ? 'Con tu inscripción se agotaron los cupos del evento.'
            : `Quedan ${registro.cuposRestantes} cupos disponibles.`}
        </p>

        <button type="button" onClick={reiniciar} className="link text-sm">
          Inscribir a otra persona
        </button>
      </section>
    )
  }

  return (
    <section className="surface space-y-4 p-6">
      <header className="space-y-1">
        <h2 className="font-serif text-lg font-semibold">Inscribirme al evento</h2>
        <p className="text-sm text-fg-muted">
          Los cupos se asignan por orden de llegada y se descuentan al confirmar.
        </p>
      </header>

      {sinCupos && (
        <p role="status" className="rounded-card bg-danger-soft px-3 py-2 text-sm text-danger">
          Este evento ya no tiene cupos disponibles.
        </p>
      )}

      {conflicto && (
        <p role="alert" className="rounded-card bg-danger-soft px-3 py-2 text-sm text-danger">
          {conflicto}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-card bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Una columna: el formulario vive en la barra lateral del detalle. */}
      <form onSubmit={enviar} noValidate className="space-y-4">
        <div className="space-y-4">
          <FormField
            label="Nombre completo"
            name="nombre"
            value={valores.nombre}
            onChange={(valor) => cambiar('nombre', valor)}
            error={errores.nombre}
            required
            disabled={sinCupos || enviando}
            placeholder="Ana Vera Moreira"
            autoComplete="name"
            maxLength={120}
          />

          <FormField
            label="Correo institucional"
            name="correo"
            type="email"
            value={valores.correo}
            onChange={(valor) => cambiar('correo', valor)}
            error={errores.correo}
            required
            disabled={sinCupos || enviando}
            placeholder="ana.vera@espol.edu.ec"
            autoComplete="email"
            hint="Un mismo correo no puede inscribirse dos veces al evento."
            maxLength={150}
          />

          <FormField
            label="Matrícula"
            name="matricula"
            value={valores.matricula}
            onChange={(valor) => cambiar('matricula', valor)}
            error={errores.matricula}
            disabled={sinCupos || enviando}
            placeholder="202010123"
            maxLength={20}
          />

          <FormField
            label="Teléfono"
            name="telefono"
            type="tel"
            value={valores.telefono}
            onChange={(valor) => cambiar('telefono', valor)}
            error={errores.telefono}
            disabled={sinCupos || enviando}
            placeholder="0991234567"
            autoComplete="tel"
            maxLength={20}
          />
        </div>

        {/* Ambar: unica accion de acento del formulario. Bold, segun PALETA.md §4. */}
        <button
          type="submit"
          disabled={sinCupos || enviando}
          className="btn btn-accent w-full"
        >
          {enviando ? 'Registrando…' : sinCupos ? 'Sin cupos' : 'Confirmar inscripción'}
        </button>
      </form>
    </section>
  )
}
