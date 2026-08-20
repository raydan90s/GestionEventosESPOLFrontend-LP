import { FormField } from '@components/FormField'
import { COMENTARIO_MAX, COMENTARIO_MIN } from '@services/comentariosService'
import { useComentarios } from '@hooks/useComentarios'
import { cn } from '@utils/cn'
import { formatDateTime } from '@utils/formatDate'

/**
 * Hilo de comentarios de un evento
 * (RF "Ver comentarios" y "Escribir comentario", Eimmy Ochoa).
 *
 * Se pinta sobre `card-muted` y sin bordes de color: nada de `cat-*` ni de
 * ámbar aquí dentro, para que el hilo no compita con la inscripción
 * (ver PALETA.md §5).
 *
 * @param {{ eventoId: string | number }} props
 */
export function ComentariosSection({ eventoId }) {
  const {
    comentarios,
    total,
    cargando,
    error,
    valores,
    cambiar,
    publicar,
    enviando,
    errores,
    errorEnvio,
    cargarMas,
    cargandoMas,
    hayMas,
  } = useComentarios(eventoId)

  const restantes = COMENTARIO_MAX - valores.contenido.length

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-title font-semibold">
        Comentarios {total > 0 && <span className="text-fg-muted">({total})</span>}
      </h2>

      <form onSubmit={publicar} noValidate className="space-y-3">
        <FormField
          label="Tu nombre"
          name="autor"
          value={valores.autor}
          onChange={(valor) => cambiar('autor', valor)}
          error={errores.autor}
          required
          disabled={enviando}
          placeholder="María Salazar"
          maxLength={120}
        />

        <div className="space-y-1.5">
          <label htmlFor="comentario-contenido" className="field-label">
            Comentario
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
          </label>

          <textarea
            id="comentario-contenido"
            name="contenido"
            rows={3}
            value={valores.contenido}
            onChange={(campo) => cambiar('contenido', campo.target.value)}
            disabled={enviando}
            required
            maxLength={COMENTARIO_MAX}
            placeholder="¿Tienes alguna pregunta sobre este evento?"
            aria-invalid={errores.contenido ? true : undefined}
            aria-describedby={errores.contenido ? 'comentario-error' : undefined}
            className={cn('field resize-y', errores.contenido && 'field-invalid')}
          />

          <div className="flex items-baseline justify-between gap-3">
            {errores.contenido ? (
              <p id="comentario-error" role="alert" className="text-xs text-danger">
                {errores.contenido}
              </p>
            ) : (
              <span className="text-xs text-fg-subtle">
                Mínimo {COMENTARIO_MIN} caracteres
              </span>
            )}

            <span className="shrink-0 text-xs text-fg-subtle">
              {restantes} caracteres restantes
            </span>
          </div>
        </div>

        {errorEnvio && (
          <p role="alert" className="rounded-card bg-danger-soft px-3 py-2 text-sm text-danger">
            {errorEnvio}
          </p>
        )}

        {/* Azul, no ámbar: el ámbar es sólo para inscribirse. */}
        <button type="submit" disabled={enviando} className="btn btn-primary">
          {enviando ? 'Publicando…' : 'Publicar comentario'}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-card bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {cargando ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 2 }, (_, fila) => (
            <div key={fila} className="h-20 animate-pulse rounded-card bg-card-muted" />
          ))}
        </div>
      ) : comentarios.length === 0 ? (
        <p className="rounded-card bg-card-muted p-4 text-sm text-fg-muted">
          Sé el primero en preguntar algo sobre este evento.
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {comentarios.map((comentario) => (
              <li
                key={comentario.id}
                className="rounded-card border-l-2 border-edge-strong bg-card-muted p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{comentario.autor}</span>
                  <span className="text-xs text-fg-subtle">
                    {formatDateTime(comentario.fecha)}
                  </span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-sm text-fg-muted">
                  {comentario.contenido}
                </p>
              </li>
            ))}
          </ul>
          {hayMas && (
            <button type="button" onClick={cargarMas} disabled={cargandoMas} className="link text-sm">
              {cargandoMas ? 'Cargando…' : 'Ver más comentarios'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
