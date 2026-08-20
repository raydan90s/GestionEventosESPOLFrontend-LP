import { useLocation, useNavigate } from 'react-router-dom'
import { EventoForm } from '@components/EventoForm'
import { SidePanel } from '@components/SidePanel'
import { ROUTES, eventoDetalle } from '@constants/routes'
import { createEvent, uploadEventImage } from '@services/eventsService'

/**
 * Creacion de un evento (RF "Crear evento", Juliana Burgos).
 *
 * Se abre como panel lateral encima de la vista actual, con ruta propia
 * (`/eventos/nuevo`). El formulario vive en `@components/EventoForm`.
 */
export default function EventoNuevoPage() {
  const navegar = useNavigate()
  const location = useLocation()

  /**
   * Cierra el panel volviendo a lo que habia detras. Si se entro escribiendo la
   * URL no hay nada atras a lo que volver, asi que se va al catalogo.
   */
  const cerrar = () => {
    if (location.state?.background) navegar(-1)
    else navegar(ROUTES.CATALOGO, { replace: true })
  }

  const guardar = async (valores, archivoImagen) => {
    const creado = await createEvent(valores)

    // El evento ya existe aunque la imagen falle: no se muestra un error de
    // creacion que seria mentira, sino un aviso aparte en el detalle.
    let imagenFallida = false
    if (archivoImagen) {
      try {
        await uploadEventImage(creado.id, archivoImagen)
      } catch {
        imagenFallida = true
      }
    }

    // `replace`: el panel deja de existir, asi que "atras" debe llevar a la
    // vista desde la que se abrio y no reabrir un formulario ya enviado.
    navegar(eventoDetalle(creado.id), {
      replace: true,
      state: imagenFallida
        ? { imagenFallida: true, mensajeImagen: 'El evento se creó, pero la imagen no se pudo subir.' }
        : undefined,
    })
  }

  return (
    <SidePanel titulo="Crear nuevo evento" onClose={cerrar}>
      <EventoForm
        textoAyuda="El evento queda publicado en el catálogo apenas lo guardes."
        textoBoton="Publicar evento"
        textoEnviando="Publicando…"
        onGuardar={guardar}
        onCancelar={cerrar}
      />
    </SidePanel>
  )
}
