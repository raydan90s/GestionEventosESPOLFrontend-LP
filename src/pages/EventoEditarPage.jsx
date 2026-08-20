import { useLocation, useNavigate } from 'react-router-dom'
import { EventoForm } from '@components/EventoForm'
import { SidePanel } from '@components/SidePanel'
import { eventoDetalle } from '@constants/routes'
import { useEvento } from '@hooks/useEvento'
import { updateEvent, uploadEventImage } from '@services/eventsService'
import { toDatetimeLocal } from '@utils/apiDate'

/**
 * Edicion de un evento. Reutiliza el `EventoForm` de "Crear evento"; `id` llega
 * por prop porque el panel se pinta fuera de `<Routes>` (ver `App`).
 *
 * @param {{ id: string }} props
 */
export default function EventoEditarPage({ id }) {
  const navegar = useNavigate()
  const location = useLocation()
  const { evento, cargando, error } = useEvento(id)

  const cerrar = () => {
    if (location.state?.background) navegar(-1)
    else navegar(eventoDetalle(id), { replace: true })
  }

  const guardar = async (valores, archivoImagen) => {
    await updateEvent(id, valores)

    let imagenFallida = false
    if (archivoImagen) {
      try {
        await uploadEventImage(id, archivoImagen)
      } catch {
        imagenFallida = true
      }
    }

    // `replace`: "atras" no debe reabrir un panel ya enviado. El aviso va en el
    // state porque la pagina de detalle no se desmonta en este viaje.
    navegar(eventoDetalle(id), {
      replace: true,
      state: {
        eventoActualizado: true,
        ...(imagenFallida && {
          imagenFallida: true,
          mensajeImagen: 'Los cambios se guardaron, pero la imagen no se pudo subir.',
        }),
      },
    })
  }

  return (
    <SidePanel titulo="Editar evento" onClose={cerrar}>
      {cargando ? (
        <p className="px-6 py-6 text-sm text-fg-muted" aria-busy="true">
          Cargando evento…
        </p>
      ) : error || !evento ? (
        <p role="alert" className="px-6 py-6 text-sm text-danger">
          {error ?? 'No pudimos cargar el evento.'}
        </p>
      ) : (
        <EventoForm
          valoresIniciales={{
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            categoriaId: String(evento.categoriaId),
            lugar: evento.lugar,
            // El evento trae la fecha en ISO; el campo la necesita en el
            // formato de `<input type="datetime-local">` y en hora local.
            fecha: toDatetimeLocal(evento.fecha),
            cupoMaximo: String(evento.cupoMaximo),
            organizador: evento.organizador,
          }}
          imagenActual={evento.imagenUrl}
          textoAyuda="Los cambios quedan publicados apenas los guardes."
          textoBoton="Guardar cambios"
          textoEnviando="Guardando…"
          onGuardar={guardar}
          onCancelar={cerrar}
        />
      )}
    </SidePanel>
  )
}
