import { Link } from 'react-router-dom'
import { ROUTES } from '@constants/routes'

export default function NotFoundPage() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="text-sm text-fg-muted">La ruta solicitada no existe.</p>
      <Link
        to={ROUTES.CATALOGO}
        className="inline-block text-sm font-medium text-primary hover:text-primary-hover"
      >
        Volver al catálogo
      </Link>
    </section>
  )
}
