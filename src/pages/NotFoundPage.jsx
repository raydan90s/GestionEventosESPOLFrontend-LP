import { Link } from 'react-router-dom'
import { ROUTES } from '@constants/routes'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg space-y-4 py-20 text-center">
      <p className="text-label font-semibold uppercase text-fg-subtle">Error 404</p>
      <h1 className="font-serif text-headline font-semibold">Página no encontrada</h1>
      <p className="text-fg-muted">La ruta solicitada no existe.</p>
      <Link to={ROUTES.CATALOGO} className="btn btn-primary mt-2">
        Volver al catálogo
      </Link>
    </section>
  )
}
