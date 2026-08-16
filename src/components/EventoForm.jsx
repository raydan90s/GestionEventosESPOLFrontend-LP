import { useEffect, useId, useState } from 'react'
import { FormField } from '@components/FormField'
import { assetUrl } from '@config/api'
import { useCategorias } from '@hooks/useCategorias'
import { mensajeDeError } from '@services/apiErrors'
import { erroresDeCampo } from '@services/eventsService'
import { cn } from '@utils/cn'

/** Tipos de imagen aceptados; el backend los revalida por contenido, no por nombre. */
const TIPOS_IMAGEN = 'image/jpeg,image/png,image/webp'

/** Formulario vacío, punto de partida al crear. */
const EVENTO_VACIO = Object.freeze({
  titulo: '',
  descripcion: '',
  categoriaId: '',
  lugar: '',
  fecha: '',
  cupoMaximo: '',
  organizador: '',
})

/**
 * Formulario de evento, compartido entre «Crear evento» y «Editar evento».
 *
 * Los campos, la validación en el submit y la traducción de errores 422 son
 * exactamente iguales en los dos casos — sólo cambian los valores de partida,
 * el texto del botón y qué hace `onGuardar` con lo que se envía (crear uno
 * nuevo o actualizar el existente, y a dónde navegar después). Duplicar este
 * formulario para editar lo habría desincronizado del de crear en una semana.
 *
 * No incluye el `SidePanel`: cada página decide su propio título y lo envuelve
 * ella misma, igual que hacía `EventoNuevoPage` antes de este refactor.
 *
 * La imagen viaja aparte: `onGuardar` recibe también el archivo elegido (o
 * `null`) y decide qué hacer con él, porque subirla es una petición distinta
 * a crear o actualizar el evento (ver `uploadEventImage`).
 *
 * @param {{
 *   valoresIniciales?: typeof EVENTO_VACIO,
 *   imagenActual?: string,
 *   textoAyuda: string,
 *   textoBoton: string,
 *   textoEnviando: string,
 *   onGuardar: (valores: typeof EVENTO_VACIO, archivoImagen: File | null) => Promise<unknown>,
 *   onCancelar: () => void,
 * }} props
 */
export function EventoForm({
  valoresIniciales = EVENTO_VACIO,
  imagenActual = '',
  textoAyuda,
  textoBoton,
  textoEnviando,
  onGuardar,
  onCancelar,
}) {
  const { categorias, cargando: cargandoCategorias } = useCategorias()
  const idImagen = useId()

  const [valores, setValores] = useState(valoresIniciales)
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState(/** @type {Record<string, string>} */ ({}))
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const [archivoImagen, setArchivoImagen] = useState(/** @type {File | null} */ (null))
  const [previsualizacion, setPrevisualizacion] = useState('')

  // El `object URL` de la previsualización es un recurso del navegador: hay
  // que liberarlo al cambiar de archivo o al desmontar, o gotea memoria.
  useEffect(() => {
    return () => {
      if (previsualizacion) URL.revokeObjectURL(previsualizacion)
    }
  }, [previsualizacion])

  const elegirImagen = (evento) => {
    const archivo = evento.target.files?.[0] ?? null
    setArchivoImagen(archivo)
    setPrevisualizacion((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior)
      return archivo ? URL.createObjectURL(archivo) : ''
    })
  }

  // Lo que se ve en la previsualización: el archivo recién elegido si hay
  // uno, si no la imagen que ya tenía el evento (al editar).
  const vistaPrevia = previsualizacion || (imagenActual ? assetUrl(imagenActual) : '')

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
      // `onGuardar` hace la llamada a la API y navega al terminar: si no
      // lanza, este formulario está a punto de desmontarse y no hace falta
      // apagar `enviando`.
      await onGuardar(valores, archivoImagen)
    } catch (fallo) {
      const porCampo = erroresDeCampo(fallo)

      if (Object.keys(porCampo).length > 0) {
        setErrores(porCampo)
      } else {
        setError(mensajeDeError(fallo, 'No se pudo guardar el evento. Intenta de nuevo.'))
      }
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-0 flex-1 flex-col">
      {/* `min-h-0` es lo que deja encoger a la zona de campos: sin él crece
          sin límite y el pie de botones se sale del panel. */}
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6">
        <p className="text-sm text-fg-muted">{textoAyuda}</p>

        {error && (
          <p role="alert" className="rounded-card bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <fieldset className="space-y-4">
          <legend className="mb-4 text-label font-semibold uppercase text-fg-muted">Qué</legend>

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

        <fieldset className="space-y-4 border-t border-edge pt-8">
          <legend className="mb-4 text-label font-semibold uppercase text-fg-muted">Imagen</legend>

          <div className="space-y-1.5">
            <label htmlFor={idImagen} className="field-label">
              Imagen del evento
              <span className="ml-1 font-normal text-fg-subtle">(opcional)</span>
            </label>

            {/* Aspecto fijo para que la previsualización no salte al elegir
                una foto de otra proporción; mismo tratamiento que la tarjeta
                del catálogo (EventCard). */}
            {vistaPrevia && (
              <img
                src={vistaPrevia}
                alt=""
                className="aspect-video w-full max-w-xs rounded-card border border-edge object-cover"
              />
            )}

            <input
              id={idImagen}
              type="file"
              accept={TIPOS_IMAGEN}
              onChange={elegirImagen}
              disabled={enviando}
              className="field cursor-pointer file:mr-3 file:cursor-pointer file:rounded-card
                         file:border-0 file:bg-card-muted file:px-3 file:py-1.5 file:text-sm
                         file:font-medium"
            />

            <p className="text-xs text-fg-subtle">JPEG, PNG o WEBP. Máximo 2 MB.</p>
          </div>
        </fieldset>
      </div>

      {/* Pie fijo: los botones no se van con el scroll de los campos. */}
      <footer className="flex flex-wrap justify-end gap-3 border-t border-edge px-6 py-4">
        <button type="button" onClick={onCancelar} disabled={enviando} className="btn btn-neutral">
          Cancelar
        </button>

        {/* Azul: el ámbar está reservado a la acción de inscribirse. */}
        <button type="submit" disabled={enviando} className="btn btn-primary">
          {enviando ? textoEnviando : textoBoton}
        </button>
      </footer>
    </form>
  )
}
