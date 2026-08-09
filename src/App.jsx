import { Route, Routes, matchPath, useLocation } from 'react-router-dom'
import { Footer } from '@components/Footer'
import { Navbar } from '@components/Navbar'
import { ROUTES } from '@constants/routes'
import AsistentesPage from '@pages/AsistentesPage'
import CatalogoPage from '@pages/CatalogoPage'
import EventoDetallePage from '@pages/EventoDetallePage'
import EventoNuevoPage from '@pages/EventoNuevoPage'
import NotFoundPage from '@pages/NotFoundPage'

export default function App() {
  const location = useLocation()

  /*
   * `/eventos/nuevo` no sustituye a la vista actual: se abre como panel lateral
   * encima de ella. Sigue siendo una ruta —la URL es compartible y el botón
   * «atrás» cierra el panel—, pero se pinta aparte de `<Routes>`.
   *
   * Detrás va la ubicación de la que se venía, que `CrearEventoLink` guarda en
   * `state.background`. Si alguien escribe la URL a mano no hay nada previo que
   * conservar, y el fondo pasa a ser el catálogo.
   */
  const panelAbierto = Boolean(matchPath(ROUTES.EVENTO_NUEVO, location.pathname))
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

      {panelAbierto && <EventoNuevoPage />}
    </div>
  )
}
