import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CrearEventoLink } from '@components/CrearEventoLink'
import { EventCard } from '@components/EventCard'
import { CalendarIcon } from '@components/icons'
import { colorDeCategoria } from '@constants/categories'
import { CATALOGO_PARAMS } from '@constants/routes'
import { useCategorias } from '@hooks/useCategorias'
import { useEventos } from '@hooks/useEventos'
import { cn } from '@utils/cn'

/**
 * Catálogo de eventos (RF "Ver catálogo de eventos", Juliana Burgos).
 *
 * Categorías, eventos y filtrado salen de la API: no hay datos de ejemplo.
 * Los filtros —categoría, rango de fechas y búsqueda— viajan en la query
 * string y los resuelve el backend en SQL.
 *
 * La búsqueda también vive en la URL porque el campo está en la navbar
 * (ver `@components/Navbar`): así las dos vistas comparten un solo estado.
 */
export default function CatalogoPage() {
  const [params, setParams] = useSearchParams()

  const busqueda = params.get(CATALOGO_PARAMS.Q) ?? ''
  const categoriaId = params.get(CATALOGO_PARAMS.CATEGORIA)
  const desde = params.get(CATALOGO_PARAMS.DESDE) ?? ''
  const hasta = params.get(CATALOGO_PARAMS.HASTA) ?? ''

  const filtrando = categoriaId !== null || busqueda.trim() !== '' || desde !== '' || hasta !== ''
  const conFechas = desde !== '' || hasta !== ''
  // Las fechas llegan como `YYYY-MM-DD`: comparadas como texto ya quedan en orden.
  const rangoInvalido = desde !== '' && hasta !== '' && hasta < desde

  /*
   * El rango de fechas se despliega desde el botón del calendario en vez de
   * ocupar una franja permanente: filtrar por categoría es lo habitual y por
   * fecha, la excepción. Arranca abierto si la URL ya trae fechas, para que un
   * enlace compartido no esconda el filtro que lleva puesto.
   */
  const [fechasAbiertas, setFechasAbiertas] = useState(conFechas)

  const { categorias } = useCategorias()
  /*
   * Con el rango al revés no se consulta: la respuesta sería vacía siempre y
   * «ningún evento coincide» haría pensar que el problema son los datos y no
   * las fechas. Se avisa en su lugar, y el rango viaja vacío para no gastar una
   * petición condenada.
   */
  const { eventos, cargando, error, recargar } = useEventos({
    categoriaId,
    q: busqueda,
    desde: rangoInvalido ? '' : desde,
    hasta: rangoInvalido ? '' : hasta,
  })
  // El id de la URL es texto y el de la API número: se comparan como texto.
  const categoriaActiva = categorias.find((categoria) => String(categoria.id) === categoriaId)

  /*
   * Recuento del encabezado. Vacío mientras se carga o si algo falla: el error
   * y el vacío ya se explican solos más abajo, y repetir «0 eventos» arriba no
   * añade nada.
   */
  const resumen =
    cargando || error || eventos.length === 0
      ? ''
      : `${eventos.length === 1 ? '1 evento' : `${eventos.length} eventos`}` +
        (categoriaActiva ? ` en ${categoriaActiva.nombre}` : '')

  /**
   * Escribe un filtro en la query string; un valor vacío lo quita. Sirve para
   * los tres (categoría, desde y hasta) porque todos viven en la misma URL.
   */
  const filtrar = (clave, valor) => {
    const siguientes = new URLSearchParams(params)

    if (valor === null || valor === '') siguientes.delete(clave)
    else siguientes.set(clave, String(valor))

    setParams(siguientes, { replace: true })
  }

  const limpiar = () => {
    setParams(new URLSearchParams(), { replace: true })
    setFechasAbiertas(false)
  }

  return (
    <section>
      {/* `mb-8` se funde con el `my-8` de la franja de filtros cuando la hay, y
          mantiene la separación con la rejilla cuando no. */}
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-headline font-semibold md:text-display">
            Catálogo de eventos
          </h1>
          <p className="text-body-lg text-fg-muted">
            Actividades académicas, deportivas y culturales de la ESPOL.
          </p>

          {/*
            Siempre en el DOM aunque esté vacío: un `aria-live` que aparece a la
            vez que su texto no se anuncia de forma fiable, porque el lector de
            pantalla necesita estar observando la región antes de que cambie.
            `min-h-5` reserva su línea para que el encabezado no dé un salto.
          */}
          <p className="min-h-5 text-sm text-fg-muted" aria-live="polite">
            {resumen}
          </p>
        </div>

        {/*
          Fila de filtros: los chips de categoría y, al final, el botón que
          despliega el rango de fechas. Las categorías vienen de la API; si aún
          no cargan, sólo queda el botón del calendario.
        */}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {categorias.length > 0 && (
            <>
              <FiltroChip
                active={categoriaId === null}
                onClick={() => filtrar(CATALOGO_PARAMS.CATEGORIA, null)}
              >
                Todos
              </FiltroChip>

              {categorias.map((categoria) => (
                <FiltroChip
                  key={categoria.id}
                  color={colorDeCategoria(categoria.nombre)}
                  active={String(categoria.id) === categoriaId}
                  onClick={() => filtrar(CATALOGO_PARAMS.CATEGORIA, categoria.id)}
                >
                  {categoria.nombre}
                </FiltroChip>
              ))}
            </>
          )}

          <button
            type="button"
            onClick={() => setFechasAbiertas((abiertas) => !abiertas)}
            aria-expanded={fechasAbiertas}
            aria-controls="filtro-fechas"
            aria-label="Filtrar por fechas"
            className={cn(
              'btn btn-neutral px-2.5',
              // Con un rango puesto el botón se queda marcado: el filtro sigue
              // actuando aunque el panel esté plegado.
              conFechas && 'border-secondary text-secondary',
            )}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/*
        Rango de fechas. Va en su propia franja y no entre los chips porque son
        dos filtros distintos: la categoría es una elección entre pocas opciones
        y la fecha, un rango que se escribe. Ambos acaban en la misma URL.

        La franja sólo existe cuando hay algo que poner en ella: el rango
        desplegado, o el botón de limpiar si hay cualquier filtro activo.
      */}
      {(fechasAbiertas || filtrando) && (
        <div
          id="filtro-fechas"
          className="my-8 flex flex-wrap items-end gap-x-4 gap-y-3 border-y border-edge py-4"
        >
          {fechasAbiertas && (
            <>
              <FiltroFecha
                id="fecha-desde"
                label="Desde"
                value={desde}
                max={hasta || undefined}
                onChange={(valor) => filtrar(CATALOGO_PARAMS.DESDE, valor)}
              />

              <FiltroFecha
                id="fecha-hasta"
                label="Hasta"
                value={hasta}
                min={desde || undefined}
                onChange={(valor) => filtrar(CATALOGO_PARAMS.HASTA, valor)}
                invalid={rangoInvalido}
              />
            </>
          )}

          {filtrando && (
            <button type="button" onClick={limpiar} className="link py-2.5 text-sm">
              Limpiar filtros
            </button>
          )}

          {/*
            El navegador ya impide elegir un rango al revés con `min`/`max`, pero
            la URL se puede escribir a mano: si llega invertido, se dice en vez de
            devolver una rejilla vacía sin explicación.
          */}
          {rangoInvalido && (
            <p role="alert" className="w-full text-xs text-danger">
              La fecha final es anterior a la inicial: ningún evento puede coincidir.
            </p>
          )}
        </div>
      )}

      {error ? (
        <div className="surface space-y-3 bg-danger-soft px-4 py-10 text-center">
          <p className="text-sm text-danger">{error}</p>
          <button type="button" onClick={recargar} className="link text-sm">
            Reintentar
          </button>
        </div>
      ) : cargando ? (
        <RejillaCargando />
      ) : eventos.length === 0 ? (
        <VacioCatalogo
          filtrando={filtrando}
          categoria={categoriaActiva?.nombre}
          conFechas={conFechas}
          onLimpiar={limpiar}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento, posicion) => (
            <EventCard key={evento.id} event={evento} posicion={posicion} />
          ))}
        </div>
      )}
    </section>
  )
}

/**
 * Filtro de categoría. En reposo lleva el color de su categoría; activo, el
 * azul institucional, nunca el ámbar. «Todos» va sin color y usa los neutros.
 *
 * El color se pasa como `--chip-color` y lo resuelve `.filter-chip` en CSS: es
 * la misma variable que consume el chip de la tarjeta, así que una categoría se
 * ve del mismo color en el filtro y en el evento.
 */
function FiltroChip({ active, color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={color ? { '--chip-color': color } : undefined}
      className={cn('filter-chip', active && 'filter-chip-active')}
    >
      {children}
    </button>
  )
}

/**
 * Un extremo del rango de fechas. `min`/`max` los pone quien lo usa con el otro
 * extremo, para que el propio calendario del navegador no deje invertirlo.
 */
function FiltroFecha({ id, label, value, onChange, min, max, invalid }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="field-label text-xs font-medium text-fg-muted">
        {label}
      </label>

      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(campo) => onChange(campo.target.value)}
        aria-invalid={invalid ? true : undefined}
        // `w-auto` gana a `w-full` de `.field`: aquí el campo no ocupa la fila.
        className={cn('field w-auto', invalid && 'field-invalid')}
      />
    </div>
  )
}

/** Esqueletos con la silueta de la tarjeta, para que la vista no salte al cargar. */
function RejillaCargando() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }, (_, tarjeta) => (
        <div key={tarjeta} className="surface space-y-4 p-6">
          <div className="h-6 w-24 animate-pulse rounded-chip bg-card-muted" />
          <div className="h-7 w-3/4 animate-pulse rounded bg-card-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-card-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-card-muted" />
          <div className="h-1.5 w-full animate-pulse rounded-pill bg-card-muted" />
          <div className="h-10 w-full animate-pulse rounded-card bg-card-muted" />
        </div>
      ))}
    </div>
  )
}

/**
 * Dos vacíos distintos: no es lo mismo que el filtro no devuelva nada que
 * que todavía no exista ningún evento publicado.
 */
function VacioCatalogo({ filtrando, categoria, conFechas, onLimpiar }) {
  if (filtrando) {
    return (
      <div className="surface space-y-3 bg-card-muted px-4 py-16 text-center">
        <p className="text-fg-muted">
          {categoria
            ? `No hay eventos de ${categoria} que coincidan con tu búsqueda.`
            : 'Ningún evento coincide con tu búsqueda.'}
          {/* Si el rango es lo que está vaciando la rejilla, se sugiere ampliarlo. */}
          {conFechas && ' Prueba a ampliar el rango de fechas.'}
        </p>
        <button type="button" onClick={onLimpiar} className="link text-sm">
          Limpiar filtros
        </button>
      </div>
    )
  }

  return (
    <div className="surface space-y-3 bg-card-muted px-4 py-16 text-center">
      <p className="text-fg-muted">
        Todavía no hay eventos publicados. Si organizas uno, publícalo aquí para que lo vea
        toda la ESPOL.
      </p>
      <CrearEventoLink className="link inline-block text-sm">
        Crear evento
      </CrearEventoLink>
    </div>
  )
}
