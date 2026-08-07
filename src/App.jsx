import { Route, Routes } from 'react-router-dom'
import { Navbar } from '@components/Navbar'
import { ROUTES } from '@constants/routes'
import CatalogoPage from '@pages/CatalogoPage'
import EventoDetallePage from '@pages/EventoDetallePage'
import EventoNuevoPage from '@pages/EventoNuevoPage'
import NotFoundPage from '@pages/NotFoundPage'

export default function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path={ROUTES.CATALOGO} element={<CatalogoPage />} />
          <Route path={ROUTES.EVENTO_NUEVO} element={<EventoNuevoPage />} />
          <Route path={ROUTES.EVENTO_DETALLE} element={<EventoDetallePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
