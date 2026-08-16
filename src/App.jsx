import { Route, Routes, matchPath, useLocation } from 'react-router-dom'
import { Footer } from '@components/Footer'
import { Navbar } from '@components/Navbar'
import { ROUTES } from '@constants/routes'
import AsistentesPage from '@pages/AsistentesPage'
import CatalogoPage from '@pages/CatalogoPage'
import EventoDetallePage from '@pages/EventoDetallePage'
import EventoEditarPage from '@pages/EventoEditarPage'
import EventoNuevoPage from '@pages/EventoNuevoPage'
import NotFoundPage from '@pages/NotFoundPage'

export default function App() {
  const location = useLocation()

  /*
   * `/eventos/nuevo` y `/eventos/:id/editar` no sustituyen a la vista actual:
   * se abren como panel lateral encima de ella. Siguen siendo rutas de verdad
   * —la URL es compartible y el botón «atrás» cierra el panel—, pero se pintan
   * aparte de `<Routes>`.
   *
   * Detrás va la ubicación de la que se venía, que `CrearEventoLink` (o el
   * enlace de editar) guarda en `state.background`. Si alguien escribe la URL
   * a mano no hay nada previo que conservar, y el fondo pasa a ser el catálogo.
   */
  const matchNuevo = matchPath(ROUTES.EVENTO_NUEVO, location.pathname)
  const matchEditar = matchPath(ROUTES.EVENTO_EDITAR, location.pathname)
  const panelAbierto = Boolean(matchNuevo || matchEditar)
  const fondo = panelAbierto
    ? (location.state?.background ?? ROUTES.CATALOGO)
    : location

  return (
    // El footer se queda abajo aunque la página sea corta.
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      {/* Rejilla fija de 1280 px; márgenes de 16 px en móvil y 40 px en escritorio. */}
      <main className="mx-auto w-full max-w-container flex-1 px-4 py-10 md:px-10">
        <Routes location={fondo}>
          <Route path={ROUTES.CATALOGO} element={<CatalogoPage />} />
          <Route path={ROUTES.EVENTO_DETALLE} element={<EventoDetallePage />} />
          <Route path={ROUTES.EVENTO_ASISTENTES} element={<AsistentesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {matchNuevo && <EventoNuevoPage />}
      {matchEditar && <EventoEditarPage id={matchEditar.params.id} />}
    </div>
  )
}
