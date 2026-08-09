import { useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CrearEventoLink } from '@components/CrearEventoLink'
import { PlusIcon, SearchIcon } from '@components/icons'
import { ThemeToggle } from '@components/ThemeToggle'
import { CATALOGO_PARAMS, ROUTES } from '@constants/routes'
import { cn } from '@utils/cn'

/** Link de navegación: subrayado azul cuando está activo, como en la maqueta. */
const linkClass = ({ isActive }) =>
  cn(
    'border-b-2 pb-0.5 text-sm transition-colors',
    isActive
      ? 'border-primary font-semibold text-primary'
      : 'border-transparent text-fg-muted hover:text-fg',
  )

/**
 * Barra superior institucional.
 *
 * Azul: nunca ámbar, que está reservado a inscribirse (PALETA.md §1).
 *
 * El buscador vive aquí porque así lo pide la maqueta, pero el listado que
 * filtra está en el catálogo. Para no duplicar estado, el texto se guarda en
 * la query string: la navbar la escribe y el catálogo la lee.
 */
export function Navbar() {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()

  const enCatalogo = pathname === ROUTES.CATALOGO
  const busquedaUrl = params.get(CATALOGO_PARAMS.Q) ?? ''

  /*
   * En el catálogo el campo lo gobierna la URL, sin copia local: así «Limpiar
   * filtros» vacía el input sin tener que sincronizar nada. Fuera del catálogo
   * no hay URL que gobernar todavía, y el texto se guarda hasta que se envía.
   */
  const [borrador, setBorrador] = useState('')
  const texto = enCatalogo ? busquedaUrl : borrador

  /** Ruta del catálogo con la búsqueda aplicada, conservando la categoría. */
  const rutaConBusqueda = (valor) => {
    const siguientes = new URLSearchParams(enCatalogo ? params : undefined)

    if (valor.trim()) siguientes.set(CATALOGO_PARAMS.Q, valor)
    else siguientes.delete(CATALOGO_PARAMS.Q)

    const query = siguientes.toString()
    return query ? `${ROUTES.CATALOGO}?${query}` : ROUTES.CATALOGO
  }

  const escribir = (valor) => {
    // Filtrado en vivo sólo donde hay listado; `replace` para no llenar el
    // historial con una entrada por cada tecla.
    if (enCatalogo) navegar(rutaConBusqueda(valor), { replace: true })
    else setBorrador(valor)
  }

  // Desde otra página, buscar significa ir al catálogo con el filtro puesto.
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

        {/* La navegación va pegada a la marca, como en la maqueta. Sólo se
            listan rutas que existen: un enlace roto se nota más que uno de
            menos (mismo criterio que el footer). */}
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
