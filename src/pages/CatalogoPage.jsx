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
 * Catalogo de eventos (RF "Ver catalogo de eventos", Juliana Burgos).
 *
 * Los filtros viajan en la query string y los resuelve el backend; la busqueda
 * vive ahi porque el campo esta en la navbar y el listado aqui.
 */
export default function CatalogoPage() {
  const [params, setParams] = useSearchParams()

  const filtros = {
    q: params.get(CATALOGO_PARAMS.Q) ?? '',
    categoriaId: params.get(CATALOGO_PARAMS.CATEGORIA),
    fecha: params.get(CATALOGO_PARAMS.FECHA),
    desde: params.get(CATALOGO_PARAMS.DESDE) ?? '',
    hasta: params.get(CATALOGO_PARAMS.HASTA) ?? '',
    // Sin `tiempo` en la URL solo se lista lo que esta por venir; el historico
    // se pide a proposito con `tiempo=pasados`.
    tiempo: resolverTiempo(params.get(CATALOGO_PARAMS.TIEMPO)),
    disponibles: params.get(CATALOGO_PARAMS.DISPONIBLES) === ACTIVO,
  }

  // El atajo (`fecha=semana`) se resuelve en el render y no al pulsarlo: como
  // fechas concretas en la URL, un enlace compartido caducaria.
  const { desde, hasta } = resolverRango(filtros.fecha, filtros)

  // "Proximos" es el valor por defecto de `tiempo`, asi que solo cuenta como
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
  // Con el rango al reves no se consulta: se avisa en su lugar, para no dar un
  // "ningun evento coincide" que senalaria a los datos y no a las fechas.
  const { eventos, total, cargando, cargandoMas, hayMas, error, recargar, cargarMas } = useEventos({
    categoriaId: filtros.categoriaId,
    q: filtros.q,
    desde: rangoInvalido ? '' : desde,
    hasta: rangoInvalido ? '' : hasta,
    soloProximos: filtros.tiempo === TIEMPO_EVENTO.PROXIMOS,
    soloPasados: filtros.tiempo === TIEMPO_EVENTO.PASADOS,
    soloDisponibles: filtros.disponibles,
  })
  // El id de la URL es texto y el de la API numero: se comparan como texto.
  const categoriaActiva = categorias.find(
    (categoria) => String(categoria.id) === filtros.categoriaId,
  )

  // Recuento del encabezado: usa `total` y no `eventos.length`, que solo cuenta
  // lo ya cargado. Vacio mientras se carga o si algo falla.
  const resumen =
    cargando || error || total === 0
      ? ''
      : `${total === 1 ? '1 evento' : `${total} eventos`}` +
        (categoriaActiva ? ` en ${categoriaActiva.nombre}` : '')

  /**
   * Escribe filtros en la query string; un valor vacio o nulo los quita.
   * Acepta varios de golpe porque hay cambios atomicos (el atajo de fecha).
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

          {/* Siempre en el DOM aunque este vacio: un `aria-live` que aparece
              a la vez que su texto no se anuncia. `min-h-5` reserva la linea. */}
          <p className="min-h-5 text-sm text-fg-muted" aria-live="polite">
            {resumen}
          </p>
        </div>

      </header>

      {/* Franja de filtros, a todo el ancho y fuera del encabezado para que
          pueda crecer sin empujar el titulo. */}
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

          {/* Solo si queda algo detras de esta tanda. Nunca ambar: ese color
              esta reservado a inscribirse, y este boton no lo es. */}
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
 * Dos vacios distintos: no es lo mismo que el filtro no devuelva nada que
 * que todavia no exista ningun evento publicado.
 */
function VacioCatalogo({ filtrando, categoria, conFechas, tiempo, onVerPasados, onLimpiar }) {
  // "No hay nada proximo" no es "no hay nada publicado", y el unico filtro
  // puesto es el de fabrica: se ofrece el historico, no "limpiar filtros".
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
          {/* Si el rango es lo que esta vaciando la rejilla, se sugiere ampliarlo. */}
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
