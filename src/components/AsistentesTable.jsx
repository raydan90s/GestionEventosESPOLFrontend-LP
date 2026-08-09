import { ASISTENTE_COLUMNAS } from '@constants/asistentes'
import { formatDateTime } from '@utils/formatDate'

/**
 * Tabla de asistentes de un evento (RF "Ver asistentes", Diego Parrales).
 *
 * Vista de sólo lectura para el control logístico. Sin colores de acento ni
 * `cat-*`: es una herramienta de trabajo, no una tarjeta de catálogo.
 *
 * @param {{
 *   asistentes: import('@/types/event').Attendee[],
 *   cargando?: boolean,
 *   busqueda?: string,
 * }} props
 */
export function AsistentesTable({ asistentes, cargando = false, busqueda = '' }) {
  if (cargando) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Cargando asistentes">
        {Array.from({ length: 4 }, (_, fila) => (
          <div key={fila} className="h-11 animate-pulse rounded-card bg-card-muted" />
        ))}
      </div>
    )
  }

  if (asistentes.length === 0) {
    return (
      <p className="surface bg-card-muted px-4 py-12 text-center text-sm text-fg-muted">
        {busqueda.trim()
          ? `Ningún asistente coincide con «${busqueda.trim()}».`
          : 'Todavía no hay personas inscritas en este evento.'}
      </p>
    )
  }

  return (
    // La tabla desborda antes que la página: el scroll horizontal vive aquí.
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <caption className="sr-only">Personas inscritas en el evento</caption>

        <thead>
          <tr className="border-b border-edge bg-card-muted text-xs uppercase tracking-wide text-fg-muted">
            <th scope="col" className="px-4 py-3 font-semibold">
              #
            </th>
            {ASISTENTE_COLUMNAS.map((columna) => (
              <th key={columna.key} scope="col" className="px-4 py-3 font-semibold">
                {columna.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {asistentes.map((asistente, indice) => (
            <tr
              key={asistente.id}
              className="border-b border-edge transition-colors last:border-0 hover:bg-card-hover"
            >
              <td className="px-4 py-3 font-mono text-xs text-fg-subtle">{indice + 1}</td>
              <td className="px-4 py-3 font-medium">{asistente.nombre}</td>
              <td className="px-4 py-3 font-mono text-xs text-fg-muted">
                {asistente.matricula || '—'}
              </td>
              <td className="px-4 py-3 text-fg-muted">{asistente.correo}</td>
              <td className="px-4 py-3 text-fg-muted">{asistente.telefono || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-fg-muted">
                {formatDateTime(asistente.fechaInscripcion)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
