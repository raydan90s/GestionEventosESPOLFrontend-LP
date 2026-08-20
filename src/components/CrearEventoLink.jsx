import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@constants/routes'

/**
 * Abre "Crear evento" encima de la vista actual: navega de verdad a
 * `/eventos/nuevo` y lleva la vista de fondo en `state.background` (ver `App`).
 *
 * @param {{ className?: string, children: import('react').ReactNode }} props
 */
export function CrearEventoLink({ className, children }) {
  const location = useLocation()

  return (
    <Link to={ROUTES.EVENTO_NUEVO} state={{ background: location }} className={className}>
      {children}
    </Link>
  )
}
