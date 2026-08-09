import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@constants/routes'

/**
 * Enlace que abre el panel de «Crear evento» encima de la vista actual.
 *
 * Sigue siendo una navegación de verdad a `/eventos/nuevo` —la URL cambia y se
 * puede compartir—, pero se lleva la ubicación de partida en el `state` con la
 * clave `background`. `App` la usa para seguir pintando esa vista detrás del
 * panel en lugar de sustituirla (ver el patrón de rutas modales de React
 * Router).
 *
 * Existe como componente porque son tres los sitios que abren el panel y
 * ninguno debería tener que acordarse del `state`.
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
