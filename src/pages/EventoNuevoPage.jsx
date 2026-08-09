import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '@components/FormField'
import { SidePanel } from '@components/SidePanel'
import { ROUTES, eventoDetalle } from '@constants/routes'
import { useCategorias } from '@hooks/useCategorias'
import { mensajeDeError } from '@services/apiErrors'
import { createEvent, erroresDeCampo } from '@services/eventsService'
import { cn } from '@utils/cn'

/** Formulario vacío. */
const VACIO = Object.freeze({
  titulo: '',
  descripcion: '',
  categoriaId: '',
  lugar: '',
  fecha: '',
  cupoMaximo: '',
  organizador: '',
})

/**
 * Creación de un evento (RF "Crear evento", Juliana Burgos).
 *
 * Se abre como **panel lateral** encima de la vista en la que estabas, no como
 * una página aparte: crear un evento es una tarea, y sacarte del catálogo para
 * hacerla te obliga a volver luego. Sigue teniendo ruta propia
 * (`/eventos/nuevo`), y `App` decide qué pintar detrás — ver `CrearEventoLink`.
 *
 * Las categorías del desplegable salen de `/api/categorias`: no hay ninguna
 * lista escrita a mano. Al guardar, la API iguala los cupos disponibles al
 * aforo máximo, así que ese campo no se envía.
 */
export default function EventoNuevoPage() {
  const navegar = useNavigate()
  const location = useLocation()
  const { categorias, cargando: cargandoCategorias } = useCategorias()

  const [valores, setValores] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState(/** @type {Record<string, string>} */ ({}))
  const [error, setError] = useState(/** @type {string | null} */ (null))

  /**
   * Cierra el panel volviendo a lo que había detrás. Si se entró escribiendo la
   * URL no hay nada atrás a lo que volver, así que se va al catálogo.
   */
  const cerrar = () => {
    if (location.state?.background) navegar(-1)
    else navegar(ROUTES.CATALOGO, { replace: true })
  }

  /** Actualiza un campo y limpia su error, para que desaparezca al corregirlo. */
  const cambiar = (campo, valor) => {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => {
      if (!(campo in previos)) return previos
      const { [campo]: _descartado, ...resto } = previos
      return resto
    })
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    if (enviando) return

    setEnviando(true)
    setErrores({})
    setError(null)

    try {
      const creado = await createEvent(valores)
      // `replace`: el panel deja de existir, así que «atrás» debe llevar a la
      // vista desde la que se abrió y no reabrir un formulario ya enviado.
      navegar(eventoDetalle(creado.id), { replace: true })
    } catch (fallo) {
      const porCampo = erroresDeCampo(fallo)

      if (Object.keys(porCampo).length > 0) {
        setErrores(porCampo)
      } else {
        setError(mensajeDeError(fallo, 'No se pudo crear el evento. Intenta de nuevo.'))
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <SidePanel titulo="Crear nuevo evento" onClose={cerrar}>
      {/* `min-h-0` es lo que deja encoger al hijo flexible: sin él la zona de
          campos crece sin límite y el pie de botones se sale del panel. */}
      <form onSubmit={enviar} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6">
          <p className="text-sm text-fg-muted">
            El evento queda publicado en el catálogo apenas lo guardes.
          </p>

          {error && (
            <p
              role="alert"
              className="rounded-card bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <fieldset className="space-y-4">
            <legend className="mb-4 text-label font-semibold uppercase text-fg-muted">
              Qué
            </legend>

            <FormField
              label="Título"
              name="titulo"
              value={valores.titulo}
              onChange={(valor) => cambiar('titulo', valor)}
              error={errores.titulo}
              required
              disabled={enviando}
              placeholder="Taller de introducción a React"
              hint="Entre 5 y 150 caracteres."
              maxLength={150}
            />

            <div className="space-y-1.5">
              <label htmlFor="categoria" className="field-label">
                Categoría
                <span className="ml-1 text-danger" aria-hidden="true">
                  *
                </span>
              </label>

              <select
                id="categoria"
                name="categoriaId"
                value={valores.categoriaId}
                onChange={(campo) => cambiar('categoriaId', campo.target.value)}
                disabled={enviando || cargandoCategorias}
                aria-invalid={errores.categoriaId ? true : undefined}
                aria-describedby={errores.categoriaId ? 'categoria-error' : undefined}
                className={cn('field', errores.categoriaId && 'field-invalid')}
              >
                <option value="">
                  {cargandoCategorias ? 'Cargando categorías…' : 'Elige una categoría'}
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              {errores.categoriaId && (
                <p id="categoria-error" role="alert" className="text-xs text-danger">
                  {errores.categoriaId}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="descripcion" className="field-label">
                Descripción
                <span className="ml-1 font-normal text-fg-subtle">(opcional)</span>
              </label>

              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                value={valores.descripcion}
                onChange={(campo) => cambiar('descripcion', campo.target.value)}
                disabled={enviando}
                maxLength={2000}
                placeholder="Qué se va a hacer, a quién está dirigido y qué hay que llevar."
                className={cn('field resize-y', errores.descripcion && 'field-invalid')}
              />

              {errores.descripcion && (
                <p role="alert" className="text-xs text-danger">
                  {errores.descripcion}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t border-edge pt-8">
            <legend className="mb-4 text-label font-semibold uppercase text-fg-muted">
              Cuándo y dónde
            </legend>

            <FormField
              label="Fecha y hora"
              name="fecha"
              type="datetime-local"
              value={valores.fecha}
              onChange={(valor) => cambiar('fecha', valor)}
              error={errores.fecha}
              required
              disabled={enviando}
              hint="Debe ser una fecha futura."
            />

            <FormField
              label="Aforo"
              name="cupoMaximo"
              type="number"
              value={valores.cupoMaximo}
              onChange={(valor) => cambiar('cupoMaximo', valor)}
              error={errores.cupoMaximo}
              required
              disabled={enviando}
              placeholder="30"
              hint="Número máximo de personas que entran en el espacio."
            />

            <FormField
              label="Lugar"
              name="lugar"
              value={valores.lugar}
              onChange={(valor) => cambiar('lugar', valor)}
              error={errores.lugar}
              required
              disabled={enviando}
              placeholder="Laboratorio de Cómputo FIEC 1"
              maxLength={150}
            />

            <FormField
              label="Organizador"
              name="organizador"
              value={valores.organizador}
              onChange={(valor) => cambiar('organizador', valor)}
              error={errores.organizador}
              disabled={enviando}
              placeholder="Capítulo ACM ESPOL"
              maxLength={120}
            />
          </fieldset>
        </div>

        {/* Pie fijo: los botones no se van con el scroll de los campos. */}
        <footer className="flex flex-wrap justify-end gap-3 border-t border-edge px-6 py-4">
          <button type="button" onClick={cerrar} disabled={enviando} className="btn btn-neutral">
            Cancelar
          </button>

          {/* Azul: el ámbar está reservado a la acción de inscribirse. */}
          <button type="submit" disabled={enviando} className="btn btn-primary">
            {enviando ? 'Publicando…' : 'Publicar evento'}
          </button>
        </footer>
      </form>
    </SidePanel>
  )
}
