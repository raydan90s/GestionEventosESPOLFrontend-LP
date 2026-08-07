import { NavLink } from 'react-router-dom'
import { ThemeToggle } from '@components/ThemeToggle'
import { ROUTES } from '@constants/routes'
import { cn } from '@utils/cn'

/** Clases de un link de navegación, según esté activo. */
const linkClass = ({ isActive }) =>
  cn(
    'rounded-pill px-3 py-1.5 text-sm font-medium transition-colors',
    isActive ? 'bg-primary-soft text-primary' : 'text-fg-muted hover:text-primary',
  )

/** Barra superior. Azul institucional: nunca ámbar. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-edge bg-card">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <NavLink to={ROUTES.CATALOGO} className="mr-auto text-base font-semibold text-primary">
          Eventos ESPOL
        </NavLink>

        <NavLink to={ROUTES.CATALOGO} end className={linkClass}>
          Catálogo
        </NavLink>
        <NavLink to={ROUTES.EVENTO_NUEVO} className={linkClass}>
          Crear evento
        </NavLink>

        <ThemeToggle />
      </nav>
    </header>
  )
}
