import { useMemo, useState } from 'react'
import { Desplegable } from '@components/Desplegable'
import { CalendarIcon, CheckIcon, CloseIcon, SearchIcon } from '@components/icons'
import { normalizar } from '@constants/categories'
import { RANGO_PERSONALIZADO, RANGOS_FECHA, etiquetaDeRango } from '@constants/rangosFecha'
import { ACTIVO, CATALOGO_PARAMS } from '@constants/routes'
import {
  TIEMPOS,
  TIEMPO_POR_DEFECTO,
  etiquetaDeTiempo,
} from '@constants/tiempoEvento'
import { cn } from '@utils/cn'

/**
 * A partir de aquí las categorías dejan de ser chips y pasan a un desplegable
 * con buscador. Seis caben en una fila sin envolver el encabezado; veinte
 * convertirían la barra en un muro y obligarían a leerlas todas para elegir una.
 */
const MAX_CHIPS = 6

/**
 * Barra de filtros del catálogo (RF "Ver catálogo de eventos").
 *
 * Todos los filtros viven en la query string y los resuelve el backend en SQL;
 * este componente sólo los escribe. La barra está pensada para un catálogo que
 * crece: cada filtro ocupa un botón de ancho fijo —abra una lista de tres
 * categorías o de cincuenta— y debajo se resume en chips lo que hay puesto,
 * para que se pueda quitar uno sin tener que abrir el desplegable de donde
 * salió ni perder los demás.
 *
 * @param {{
 *   categorias: import('@/types/event').Category[],
 *   filtros: { q: string, categoriaId: string | null, fecha: string | null,
 *              desde: string, hasta: string, tiempo: string, disponibles: boolean },
 *   rangoInvalido?: boolean,
 *   onFiltrar: (cambios: Record<string, string | number | null>) => void,
 *   onLimpiar: () => void,
 * }} props
 */
export function CatalogoFilters({ categorias, filtros, rangoInvalido = false, onFiltrar, onLimpiar }) {
  const categoriaActiva = categorias.find(
    // El id de la URL es texto y el de la API número: se comparan como texto.
    (categoria) => String(categoria.id) === filtros.categoriaId,
  )

  const etiquetaFecha = etiquetaDeRango(filtros.fecha, filtros)
  const conFechas = etiquetaFecha !== ''

  /** Quita el filtro de fechas entero: el atajo y el rango a medida a la vez. */
  const limpiarFechas = () =>
    onFiltrar({
      [CATALOGO_PARAMS.FECHA]: null,
      [CATALOGO_PARAMS.DESDE]: null,
      [CATALOGO_PARAMS.HASTA]: null,
    })

  /*
   * Resumen de lo que hay puesto, en el mismo orden que la barra. Se arma como
   * lista y no como JSX suelto para que la franja sepa si está vacía sin tener
   * que comprobar seis condiciones por su cuenta.
   */
  const activos = [
    filtros.q.trim() !== '' && {
      clave: 'q',
      texto: `«${filtros.q.trim()}»`,
      quitar: () => onFiltrar({ [CATALOGO_PARAMS.Q]: null }),
    },
    categoriaActiva && {
      clave: 'categoria',
      texto: categoriaActiva.nombre,
      quitar: () => onFiltrar({ [CATALOGO_PARAMS.CATEGORIA]: null }),
    },
    conFechas && { clave: 'fecha', texto: etiquetaFecha, quitar: limpiarFechas },
    /*
     * «Próximos» es lo que el catálogo hace de fábrica, así que no se resume
     * como filtro puesto: sólo aparece cuando se ha pedido otra cosa, y
     * quitarlo devuelve al valor por defecto en vez de dejar el catálogo sin
     * criterio temporal.
     */
    filtros.tiempo !== TIEMPO_POR_DEFECTO && {
      clave: 'tiempo',
      texto: etiquetaDeTiempo(filtros.tiempo),
      quitar: () => onFiltrar({ [CATALOGO_PARAMS.TIEMPO]: null }),
    },
    filtros.disponibles && {
      clave: 'disponibles',
      texto: 'Con cupo',
      quitar: () => onFiltrar({ [CATALOGO_PARAMS.DISPONIBLES]: null }),
    },
  ].filter(Boolean)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FiltroCategoria
          categorias={categorias}
          categoriaId={filtros.categoriaId}
          activa={categoriaActiva}
          onElegir={(id) => onFiltrar({ [CATALOGO_PARAMS.CATEGORIA]: id })}
        />

        <FiltroFecha
          filtros={filtros}
          etiqueta={etiquetaFecha}
          rangoInvalido={rangoInvalido}
          onFiltrar={onFiltrar}
          onLimpiar={limpiarFechas}
        />

        <FiltroTiempo
          tiempo={filtros.tiempo}
          onElegir={(clave) =>
            onFiltrar({
              // El valor por defecto se borra de la URL en vez de escribirse:
              // el catálogo sin filtros tiene la query string vacía.
              [CATALOGO_PARAMS.TIEMPO]: clave === TIEMPO_POR_DEFECTO ? null : clave,
            })
          }
        />

        {/*
          «Con cupo» es de los filtros que más se repiten y no esconde ninguna
          lista, así que va suelto en la barra: uno pulsa, la rejilla responde.
          Lo resuelve el backend (`solo_disponibles`), no el cliente.
        */}
        <Interruptor
          activo={filtros.disponibles}
          onClick={() =>
            onFiltrar({ [CATALOGO_PARAMS.DISPONIBLES]: filtros.disponibles ? null : ACTIVO })
          }
        >
          Con cupo
        </Interruptor>
      </div>

      {activos.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-edge pt-3">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
            Filtros
          </span>

          {activos.map((filtro) => (
            <ChipActivo key={filtro.clave} onQuitar={filtro.quitar}>
              {filtro.texto}
            </ChipActivo>
          ))}

          <button type="button" onClick={onLimpiar} className="link ml-1 text-sm">
            Limpiar todo
          </button>
        </div>
      )}

      {/*
        El navegador ya impide elegir un rango al revés con `min`/`max`, pero la
        URL se puede escribir a mano: si llega invertido, se dice en vez de
        devolver una rejilla vacía sin explicación.
      */}
      {rangoInvalido && (
        <p role="alert" className="text-xs text-danger">
          La fecha final es anterior a la inicial: ningún evento puede coincidir.
        </p>
      )}
    </div>
  )
}

/**
 * Categoría. Con pocas, chips a la vista —elegir es un clic y se ven todas las
 * opciones—; en cuanto son muchas, un desplegable con buscador, que es lo único
 * que aguanta un catálogo que sigue añadiendo categorías.
 */
function FiltroCategoria({ categorias, categoriaId, activa, onElegir }) {
  if (categorias.length === 0) return null

  if (categorias.length <= MAX_CHIPS) {
    return (
      <>
        <FiltroChip active={categoriaId === null} onClick={() => onElegir(null)}>
          Todas
        </FiltroChip>

        {categorias.map((categoria) => (
          <FiltroChip
            key={categoria.id}
            active={String(categoria.id) === categoriaId}
            onClick={() => onElegir(categoria.id)}
          >
            {categoria.nombre}
          </FiltroChip>
        ))}
      </>
    )
  }

  return (
    <Desplegable
      etiqueta="Categoría:"
      valor={activa ? activa.nombre : 'todas'}
      activo={categoriaId !== null}
    >
      {(cerrar) => (
        <ListaCategorias
          categorias={categorias}
          categoriaId={categoriaId}
          onElegir={(id) => {
            onElegir(id)
            // Elegir categoría cierra: es una opción entre muchas, no un ajuste
            // que se retoque varias veces seguidas como el rango de fechas.
            cerrar()
          }}
        />
      )}
    </Desplegable>
  )
}

/** Lista buscable de categorías. Vive dentro del desplegable, cuando hay muchas. */
function ListaCategorias({ categorias, categoriaId, onElegir }) {
  const [busqueda, setBusqueda] = useState('')

  const visibles = useMemo(() => {
    const termino = normalizar(busqueda.trim())
    if (termino === '') return categorias

    return categorias.filter((categoria) => normalizar(categoria.nombre).includes(termino))
  }, [busqueda, categorias])

  return (
    <div className="space-y-2">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
        <input
          type="search"
          value={busqueda}
          onChange={(campo) => setBusqueda(campo.target.value)}
          placeholder="Buscar categoría…"
          aria-label="Buscar categoría"
          // El foco entra aquí al abrir: con la lista larga, escribir es más
          // rápido que recorrerla, y quien use el teclado ya está en el campo.
          autoFocus
          className="field py-2 pl-9 text-sm"
        />
      </div>

      {/* La altura está acotada: la lista puede crecer sin empujar el panel
          fuera de la pantalla. */}
      <ul className="max-h-64 space-y-0.5 overflow-y-auto">
        <li>
          <OpcionCategoria
            seleccionada={categoriaId === null}
            onClick={() => onElegir(null)}
          >
            Todas las categorías
          </OpcionCategoria>
        </li>

        {visibles.map((categoria) => (
          <li key={categoria.id}>
            <OpcionCategoria
              seleccionada={String(categoria.id) === categoriaId}
              onClick={() => onElegir(categoria.id)}
            >
              {categoria.nombre}
            </OpcionCategoria>
          </li>
        ))}

        {visibles.length === 0 && (
          <li className="px-3 py-2 text-sm text-fg-muted">Ninguna categoría coincide.</li>
        )}
      </ul>
    </div>
  )
}

/**
 * Una fila de la lista de categorías. Es un botón con `aria-pressed` y no una
 * opción de `listbox`: la lista se recorre con el tabulador como cualquier
 * otra, sin el teclado propio que un `listbox` obliga a implementar.
 *
 * La elegida se marca con el check azul y la negrita, no con un color propio:
 * en una lista larga, un color por fila es ruido y ninguno dice cuál está
 * puesta.
 */
function OpcionCategoria({ seleccionada, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={seleccionada}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-card px-3 py-2 text-left text-sm transition-colors hover:bg-card-hover',
        seleccionada ? 'font-semibold text-fg' : 'text-fg-muted',
      )}
    >
      <span className="flex-1 truncate">{children}</span>
      {seleccionada && <CheckIcon className="h-4 w-4 shrink-0 text-secondary" />}
    </button>
  )
}

/**
 * Momento del catálogo: próximos, pasados o todos.
 *
 * Va en un desplegable y no en tres chips porque no es un interruptor: siempre
 * hay una opción puesta —de fábrica, «Próximos»— y el botón tiene que decir
 * cuál es sin que haya que leer una fila de chips para deducirlo.
 *
 * Elegir cierra el panel: es una opción entre tres, no un ajuste que se retoque
 * varias veces seguidas como el rango de fechas.
 */
function FiltroTiempo({ tiempo, onElegir }) {
  return (
    <Desplegable
      etiqueta="Mostrar:"
      valor={etiquetaDeTiempo(tiempo).toLowerCase()}
      activo={tiempo !== TIEMPO_POR_DEFECTO}
    >
      {(cerrar) => (
        <ul className="space-y-0.5">
          {TIEMPOS.map((opcion) => (
            <li key={opcion.clave}>
              <button
                type="button"
                aria-pressed={tiempo === opcion.clave}
                onClick={() => {
                  onElegir(opcion.clave)
                  cerrar()
                }}
                className={cn(
                  'flex w-full items-start gap-2 rounded-card px-3 py-2 text-left transition-colors hover:bg-card-hover',
                  tiempo === opcion.clave ? 'text-fg' : 'text-fg-muted',
                )}
              >
                <span className="flex-1">
                  <span
                    className={cn(
                      'block text-sm',
                      tiempo === opcion.clave && 'font-semibold',
                    )}
                  >
                    {opcion.etiqueta}
                  </span>
                  {/* El resumen explica qué se deja fuera: «pasados» sin más no
                      dice que esos eventos ya no admitan inscripción. */}
                  <span className="block text-xs text-fg-subtle">{opcion.resumen}</span>
                </span>

                {tiempo === opcion.clave && (
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Desplegable>
  )
}

/**
 * Fechas. Los atajos resuelven el caso normal («esta semana») en un clic y sin
 * escribir dos fechas; el rango a medida sigue debajo para lo demás.
 *
 * Elegir no cierra el panel: encadenar atajo y ajuste a mano es lo habitual, y
 * cerrarlo obligaría a volver a abrirlo para corregir un día.
 */
function FiltroFecha({ filtros, etiqueta, rangoInvalido, onFiltrar, onLimpiar }) {
  const aMedida = filtros.fecha === RANGO_PERSONALIZADO || filtros.fecha === null

  return (
    <Desplegable
      etiqueta="Fecha:"
      valor={etiqueta || 'cualquiera'}
      activo={etiqueta !== ''}
      icono={CalendarIcon}
    >
      {() => (
        <div className="space-y-2">
          <ul className="space-y-0.5">
            {RANGOS_FECHA.map((rango) => (
              <li key={rango.clave}>
                <button
                  type="button"
                  aria-pressed={filtros.fecha === rango.clave}
                  onClick={() =>
                    onFiltrar({
                      [CATALOGO_PARAMS.FECHA]: rango.clave,
                      // El atajo manda: un rango escrito antes dejaría la URL
                      // con dos filtros de fecha y sólo uno visible.
                      [CATALOGO_PARAMS.DESDE]: null,
                      [CATALOGO_PARAMS.HASTA]: null,
                    })
                  }
                  className={cn(
                    'flex w-full items-center justify-between rounded-card px-3 py-2 text-left text-sm transition-colors hover:bg-card-hover',
                    filtros.fecha === rango.clave ? 'font-semibold text-fg' : 'text-fg-muted',
                  )}
                >
                  {rango.etiqueta}
                  {filtros.fecha === rango.clave && (
                    <CheckIcon className="h-4 w-4 shrink-0 text-secondary" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-edge pt-2">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-fg-subtle">
              Rango a medida
            </p>

            <div className="flex items-end gap-2 px-1">
              <CampoFecha
                id="fecha-desde"
                label="Desde"
                value={aMedida ? filtros.desde : ''}
                max={aMedida ? filtros.hasta || undefined : undefined}
                onChange={(valor) =>
                  onFiltrar({
                    [CATALOGO_PARAMS.DESDE]: valor,
                    // Escribir una fecha convierte el filtro en «a medida»:
                    // si venía de un atajo, deja de estar elegido.
                    [CATALOGO_PARAMS.FECHA]: valor ? RANGO_PERSONALIZADO : null,
                    ...(aMedida ? {} : { [CATALOGO_PARAMS.HASTA]: null }),
                  })
                }
              />

              <CampoFecha
                id="fecha-hasta"
                label="Hasta"
                value={aMedida ? filtros.hasta : ''}
                min={aMedida ? filtros.desde || undefined : undefined}
                invalid={rangoInvalido}
                onChange={(valor) =>
                  onFiltrar({
                    [CATALOGO_PARAMS.HASTA]: valor,
                    [CATALOGO_PARAMS.FECHA]: valor ? RANGO_PERSONALIZADO : null,
                    ...(aMedida ? {} : { [CATALOGO_PARAMS.DESDE]: null }),
                  })
                }
              />
            </div>
          </div>

          {etiqueta !== '' && (
            <button type="button" onClick={onLimpiar} className="link px-3 pb-1 text-sm">
              Quitar fechas
            </button>
          )}
        </div>
      )}
    </Desplegable>
  )
}

/**
 * Un extremo del rango. `min`/`max` los pone quien lo usa con el otro extremo,
 * para que el propio calendario del navegador no deje invertirlo.
 */
function CampoFecha({ id, label, value, onChange, min, max, invalid }) {
  return (
    <div className="min-w-0 flex-1 space-y-1">
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
        className={cn('field px-2 py-2 text-sm', invalid && 'field-invalid')}
      />
    </div>
  )
}

/**
 * Filtro de categoría en chip: gris en reposo y azul institucional cuando está
 * puesto, nunca ámbar. Un único color para toda la fila —lo decide
 * `.filter-chip`— para que el que está elegido sea lo único que resalte.
 */
function FiltroChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn('filter-chip', active && 'filter-chip-active')}
    >
      {children}
    </button>
  )
}

/** Filtro de sí/no. Mismo chip que las categorías, sin color propio. */
function Interruptor({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn('filter-chip py-2', activo && 'filter-chip-active')}
    >
      {children}
    </button>
  )
}

/**
 * Un filtro puesto, en el resumen. La × quita sólo ése: los demás siguen, que
 * es la diferencia con «Limpiar todo».
 */
function ChipActivo({ onQuitar, children }) {
  return (
    <span className="filter-chip inline-flex items-center gap-1.5 py-1">
      {children}
      <button
        type="button"
        onClick={onQuitar}
        aria-label={`Quitar filtro ${children}`}
        className="rounded-pill p-0.5 transition-colors hover:bg-card-muted"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </span>
  )
}
