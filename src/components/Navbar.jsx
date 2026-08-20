import { useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CrearEventoLink } from '@components/CrearEventoLink'
import { PlusIcon, SearchIcon } from '@components/icons'
import { ThemeToggle } from '@components/ThemeToggle'
import { CATALOGO_PARAMS, ROUTES } from '@constants/routes'
import { cn } from '@utils/cn'

/** Link de navegacion: subrayado azul cuando esta activo, como en la maqueta. */
const linkClass = ({ isActive }) =>
  cn(
    'border-b-2 pb-0.5 text-sm transition-colors',
    isActive
      ? 'border-primary font-semibold text-primary'
      : 'border-transparent text-fg-muted hover:text-fg',
  )

/**
 * Barra superior institucional. Azul, nunca ambar (PALETA.md §1).
 * El buscador esta aqui y el listado en el catalogo: el texto se comparte por
 * la query string.
 */
export function Navbar() {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()

  const enCatalogo = pathname === ROUTES.CATALOGO
  const busquedaUrl = params.get(CATALOGO_PARAMS.Q) ?? ''

  // En el catalogo el campo lo gobierna la URL, sin copia local; fuera del
  // catalogo el texto se guarda hasta que se envia.
  const [borrador, setBorrador] = useState('')
  const texto = enCatalogo ? busquedaUrl : borrador

  /** Ruta del catalogo con la busqueda aplicada, conservando la categoria. */
  const rutaConBusqueda = (valor) => {
    const siguientes = new URLSearchParams(enCatalogo ? params : undefined)

    if (valor.trim()) siguientes.set(CATALOGO_PARAMS.Q, valor)
    else siguientes.delete(CATALOGO_PARAMS.Q)

    const query = siguientes.toString()
    return query ? `${ROUTES.CATALOGO}?${query}` : ROUTES.CATALOGO
  }

  const escribir = (valor) => {
    // Filtrado en vivo solo donde hay listado; `replace` para no llenar el
    // historial con una entrada por cada tecla.
    if (enCatalogo) navegar(rutaConBusqueda(valor), { replace: true })
    else setBorrador(valor)
  }

  // Desde otra pagina, buscar significa ir al catalogo con el filtro puesto.
  const buscar = (envio) => {
    envio.preventDefault()
    if (enCatalogo) return

    navegar(rutaConBusqueda(borrador))
    setBorrador('')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-card">
      <nav className="mx-auto flex max-w-container flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-10">
        <NavLink
          to={ROUTES.CATALOGO}
          className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-secondary"
        >
          {/* Decorativo: el nombre de la marca ya va en texto justo al lado. */}
          <span aria-hidden="true" className="brand-mark h-7 shrink-0" />
          EventosESPOL
        </NavLink>

        {/* Pegada a la marca, como en la maqueta. Solo se listan rutas que
            existen, mismo criterio que el footer. */}
        <NavLink to={ROUTES.CATALOGO} end className={linkClass}>
          Explorar
        </NavLink>

        <form onSubmit={buscar} role="search" className="order-last w-full md:order-none md:w-auto md:flex-1">
          <div className="relative max-w-md md:mx-auto">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input
              type="search"
              value={texto}
              onChange={(campo) => escribir(campo.target.value)}
              placeholder="Buscar eventos…"
              aria-label="Buscar eventos"
              className="field pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3">
          <CrearEventoLink className="btn bg-secondary text-secondary-foreground hover:bg-secondary-hover">
            <PlusIcon />
            <span className="hidden sm:inline">Crear evento</span>
            <span className="sr-only sm:hidden">Crear evento</span>
          </CrearEventoLink>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
