import { useSearchParams } from 'react-router-dom'
import { CatalogoFilters } from '@components/CatalogoFilters'
import { CrearEventoLink } from '@components/CrearEventoLink'
import { EventCard } from '@components/EventCard'
import { resolverRango } from '@constants/rangosFecha'
import { ACTIVO, CATALOGO_PARAMS } from '@constants/routes'
import { TIEMPO_EVENTO, TIEMPO_POR_DEFECTO, resolverTiempo } from '@constants/tiempoEvento'
import { useCategorias } from '@hooks/useCategorias'
import { useEventos } from '@hooks/useEventos'

/**
 * Catálogo de eventos (RF "Ver catálogo de eventos", Juliana Burgos).
 *
 * Categorías, eventos y filtrado salen de la API: no hay datos de ejemplo.
 * Los filtros —categoría, fechas, cupo y búsqueda— viajan en la query string y
 * los resuelve el backend en SQL, porque el catálogo va a crecer y no tiene
 * sentido descargarlo entero para filtrarlo en memoria.
 *
 * La búsqueda también vive en la URL porque el campo está en la navbar
 * (ver `@components/Navbar`): así las dos vistas comparten un solo estado.
 *
 * La barra de filtros es `@components/CatalogoFilters`; aquí sólo se leen los
 * parámetros, se escriben y se traducen a la consulta.
 */
export default function CatalogoPage() {
  const [params, setParams] = useSearchParams()

  const filtros = {
    q: params.get(CATALOGO_PARAMS.Q) ?? '',
    categoriaId: params.get(CATALOGO_PARAMS.CATEGORIA),
    fecha: params.get(CATALOGO_PARAMS.FECHA),
    desde: params.get(CATALOGO_PARAMS.DESDE) ?? '',
    hasta: params.get(CATALOGO_PARAMS.HASTA) ?? '',
    /*
     * Sin `tiempo` en la URL el catálogo lista sólo lo que está por venir: un
     * evento cuya fecha ya pasó no admite inscripciones, así que mezclarlo con
     * los demás sólo lleva a intentar apuntarse a algo que el backend rechaza.
     * El histórico se pide a propósito con `tiempo=pasados`.
     */
    tiempo: resolverTiempo(params.get(CATALOGO_PARAMS.TIEMPO)),
    disponibles: params.get(CATALOGO_PARAMS.DISPONIBLES) === ACTIVO,
  }

  /*
   * El rango que se consulta. Un atajo (`fecha=semana`) se resuelve aquí, en el
   * render, y no al pulsarlo: guardado en la URL como fechas concretas, un
   * enlace compartido hoy seguiría filtrando por la semana pasada mañana.
   */
  const { desde, hasta } = resolverRango(filtros.fecha, filtros)

  // «Próximos» es el valor por defecto de `tiempo`, así que sólo cuenta como
  // filtro puesto cuando se ha pedido otra cosa (pasados o todos).
  const filtrando =
    filtros.categoriaId !== null ||
    filtros.q.trim() !== '' ||
    filtros.tiempo !== TIEMPO_POR_DEFECTO ||
    filtros.disponibles ||
    desde !== '' ||
    hasta !== ''
  const conFechas = desde !== '' || hasta !== ''
  // Las fechas son `YYYY-MM-DD`: comparadas como texto ya quedan en orden.
  const rangoInvalido = desde !== '' && hasta !== '' && hasta < desde

  const { categorias } = useCategorias()
  /*
   * Con el rango al revés no se consulta: la respuesta sería vacía siempre y
   * «ningún evento coincide» haría pensar que el problema son los datos y no
   * las fechas. Se avisa en su lugar, y el rango viaja vacío para no gastar una
   * petición condenada.
   */
  const { eventos, total, cargando, cargandoMas, hayMas, error, recargar, cargarMas } = useEventos({
    categoriaId: filtros.categoriaId,
    q: filtros.q,
    desde: rangoInvalido ? '' : desde,
    hasta: rangoInvalido ? '' : hasta,
    soloProximos: filtros.tiempo === TIEMPO_EVENTO.PROXIMOS,
    soloPasados: filtros.tiempo === TIEMPO_EVENTO.PASADOS,
    soloDisponibles: filtros.disponibles,
  })
  // El id de la URL es texto y el de la API número: se comparan como texto.
  const categoriaActiva = categorias.find(
    (categoria) => String(categoria.id) === filtros.categoriaId,
  )

  /*
   * Recuento del encabezado. Usa `total` —el de la consulta completa— y no
   * `eventos.length` —el de lo ya cargado—: con 60 eventos y 50 en pantalla,
   * `eventos.length` diría «50 eventos» aunque hay diez más detrás. Vacío
   * mientras se carga o si algo falla: el error y el vacío ya se explican
   * solos más abajo, y repetir «0 eventos» arriba no añade nada.
   */
  const resumen =
    cargando || error || total === 0
      ? ''
      : `${total === 1 ? '1 evento' : `${total} eventos`}` +
        (categoriaActiva ? ` en ${categoriaActiva.nombre}` : '')

  /**
   * Escribe filtros en la query string; un valor vacío o nulo los quita.
   *
   * Acepta varios de golpe porque algunos cambios son atómicos: elegir el atajo
   * «esta semana» pone `fecha` y borra `desde`/`hasta` en la misma pasada, y
   * hacerlo en dos llamadas dejaría la URL medio escrita entre renders.
   *
   * @param {Record<string, string | number | null>} cambios
   */
  const filtrar = (cambios) => {
    const siguientes = new URLSearchParams(params)

    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === null || valor === '') siguientes.delete(clave)
      else siguientes.set(clave, String(valor))
    }

    setParams(siguientes, { replace: true })
  }

  const limpiar = () => setParams(new URLSearchParams(), { replace: true })

  return (
    <section>
      <header className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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

      </header>

      {/*
        Franja de filtros. Va a todo el ancho y no dentro del encabezado porque
        crece: cada filtro nuevo cabe en la fila sin empujar el título, y el
        resumen de lo puesto aparece debajo cuando hay algo que resumir.
      */}
      <div className="mb-8 border-y border-edge py-4">
        <CatalogoFilters
          categorias={categorias}
          filtros={filtros}
          rangoInvalido={rangoInvalido}
          onFiltrar={filtrar}
          onLimpiar={limpiar}
        />
      </div>

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
          tiempo={filtros.tiempo}
          onVerPasados={() => filtrar({ [CATALOGO_PARAMS.TIEMPO]: TIEMPO_EVENTO.PASADOS })}
          onLimpiar={limpiar}
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento, posicion) => (
              <EventCard key={evento.id} event={evento} posicion={posicion} />
            ))}
          </div>

          {/* Sólo si queda algo detrás de esta tanda. Nunca ámbar: ese color
              está reservado a inscribirse, y este botón no lo es. */}
          {hayMas && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={cargarMas}
                disabled={cargandoMas}
                className="btn btn-neutral"
              >
                {cargandoMas ? 'Cargando…' : 'Ver más eventos'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
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
function VacioCatalogo({ filtrando, categoria, conFechas, tiempo, onVerPasados, onLimpiar }) {
  /*
   * «No hay nada próximo» no es lo mismo que «no hay nada publicado», y el
   * único filtro puesto es el que trae el catálogo de fábrica: en vez de
   * ofrecer «limpiar filtros» —que no quitaría ninguno visible— se ofrece la
   * puerta al histórico, que es lo que queda por mirar.
   */
  if (!filtrando && tiempo === TIEMPO_EVENTO.PROXIMOS) {
    return (
      <div className="surface space-y-3 bg-card-muted px-4 py-16 text-center">
        <p className="text-fg-muted">
          No hay eventos próximos. Los que ya se realizaron siguen en el histórico.
        </p>
        <button type="button" onClick={onVerPasados} className="link text-sm">
          Ver eventos pasados
        </button>
      </div>
    )
  }

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
