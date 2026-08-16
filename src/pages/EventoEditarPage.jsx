import { useLocation, useNavigate } from 'react-router-dom'
import { EventoForm } from '@components/EventoForm'
import { SidePanel } from '@components/SidePanel'
import { eventoDetalle } from '@constants/routes'
import { useEvento } from '@hooks/useEvento'
import { updateEvent } from '@services/eventsService'
import { toDatetimeLocal } from '@utils/apiDate'

/**
 * Edición de un evento existente (Tarea 5 — "sólo si da el tiempo").
 *
 * Reutiliza el mismo panel lateral y el mismo `EventoForm` que «Crear
 * evento»: el formulario es idéntico, sólo cambian los valores de partida
 * (los del evento cargado) y qué pasa al guardar (`updateEvent` en vez de
 * `createEvent`, y volver al detalle en vez de ir a uno nuevo).
 *
 * `id` llega por prop, no por `useParams`: este panel se pinta fuera de
 * `<Routes>` (ver `App`, igual que `EventoNuevoPage`), así que no hay una
 * ruta activa de la que leer el parámetro.
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

  const guardar = async (valores) => {
    await updateEvent(id, valores)
    // `replace`: igual que al crear, «atrás» no debe reabrir un panel ya enviado.
    // `eventoActualizado` en el state: la página de detalle no se desmonta en
    // este viaje de ida y vuelta, así que necesita el aviso para recargar.
    navegar(eventoDetalle(id), { replace: true, state: { eventoActualizado: true } })
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
