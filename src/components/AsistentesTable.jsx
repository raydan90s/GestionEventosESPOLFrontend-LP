import { useState } from 'react'
import { ASISTENTE_COLUMNAS } from '@constants/asistentes'
import { formatDateTime } from '@utils/formatDate'

/**
 * Tabla de asistentes de un evento (RF "Ver asistentes", Diego Parrales).
 *
 * Herramienta de trabajo para el control logístico: sin colores de acento ni
 * `cat-*`, que son de la tarjeta de catálogo. La única acción, dar de baja a
 * alguien, va en `.btn-neutral`; ni ámbar (reservado a inscribirse) ni rojo de
 * fondo (reservado a errores y a «sin cupos»).
 *
 * La columna de acciones sólo aparece si se pasa `onCancelar`, para que la tabla
 * siga sirviendo como listado de sólo lectura donde no toque.
 *
 * @param {{
 *   asistentes: import('@/types/event').Attendee[],
 *   cargando?: boolean,
 *   busqueda?: string,
 *   onCancelar?: (asistente: import('@/types/event').Attendee) => void,
 *   cancelandoId?: number | null,
 * }} props
 */
export function AsistentesTable({
  asistentes,
  cargando = false,
  busqueda = '',
  onCancelar,
  cancelandoId = null,
}) {
  /*
   * Fila que está pidiendo confirmación. Va aquí y no en la página porque es
   * estado de interacción, no de datos: dar de baja libera un cupo y no se puede
   * deshacer, así que nunca se borra al primer clic.
   */
  const [confirmandoId, setConfirmandoId] = useState(/** @type {number | null} */ (null))

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
      <table
        className={`w-full border-collapse text-left text-sm ${
          onCancelar ? 'min-w-[56rem]' : 'min-w-[44rem]'
        }`}
      >
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
            {onCancelar && (
              <th scope="col" className="px-4 py-3 text-right font-semibold">
                Acciones
              </th>
            )}
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

              {onCancelar && (
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <AccionesFila
                    asistente={asistente}
                    confirmando={confirmandoId === asistente.id}
                    cancelando={cancelandoId === asistente.id}
                    // Con una baja en curso se bloquea toda la columna: al
                    // terminar se recarga el listado entero y los índices bailan.
                    bloqueado={cancelandoId !== null}
                    onPedirConfirmacion={() => setConfirmandoId(asistente.id)}
                    onDesistir={() => setConfirmandoId(null)}
                    onConfirmar={() => {
                      setConfirmandoId(null)
                      onCancelar(asistente)
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Celda de acciones de una fila: un botón que, al pulsarlo, se convierte en la
 * pregunta de confirmación en el mismo sitio.
 *
 * La confirmación es en línea y no un modal a propósito: el organizador está
 * dando de baja a *esta* persona y la fila con su nombre sigue delante mientras
 * decide, que es justo el contexto que un diálogo aparte le quitaría.
 *
 * @param {{
 *   asistente: import('@/types/event').Attendee,
 *   confirmando: boolean,
 *   cancelando: boolean,
 *   bloqueado: boolean,
 *   onPedirConfirmacion: () => void,
 *   onDesistir: () => void,
 *   onConfirmar: () => void,
 * }} props
 */
function AccionesFila({
  asistente,
  confirmando,
  cancelando,
  bloqueado,
  onPedirConfirmacion,
  onDesistir,
  onConfirmar,
}) {
  if (cancelando) {
    return (
      <span className="text-xs text-fg-muted" aria-live="polite">
        Dando de baja…
      </span>
    )
  }

  if (confirmando) {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="text-xs text-fg-muted">¿Liberar su cupo?</span>

        <button
          type="button"
          onClick={onConfirmar}
          disabled={bloqueado}
          aria-label={`Confirmar la baja de ${asistente.nombre}`}
          className="btn btn-neutral px-3 py-1.5 text-xs"
        >
          Sí, dar de baja
        </button>

        <button
          type="button"
          onClick={onDesistir}
          aria-label={`Conservar la inscripción de ${asistente.nombre}`}
          className="link text-xs"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onPedirConfirmacion}
      disabled={bloqueado}
      aria-label={`Dar de baja a ${asistente.nombre}`}
      className="btn btn-neutral px-3 py-1.5 text-xs"
    >
      Dar de baja
    </button>
  )
}
