import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AforoBar } from '@components/AforoBar'
import { AsistentesTable } from '@components/AsistentesTable'
import { ArrowLeftIcon, DownloadIcon, SearchIcon } from '@components/icons'
import { ASISTENTE_COLUMNAS } from '@constants/asistentes'
import { eventoDetalle } from '@constants/routes'
import { useAsistentes } from '@hooks/useAsistentes'
import { CSV_BOM, toCsv } from '@utils/csv'
import { formatDateTime } from '@utils/formatDate'

/**
 * Vista de organizador: listado de personas inscritas en un evento
 * (RF "Ver asistentes", Diego Parrales).
 */
export default function AsistentesPage() {
  const { id } = useParams()
  const [busqueda, setBusqueda] = useState('')
  const {
    evento,
    asistentes,
    total,
    cargando,
    error,
    recargar,
    cancelar,
    cancelandoId,
    errorCancelar,
  } = useAsistentes(id, busqueda)

  const filtrando = busqueda.trim() !== ''

  /**
   * Descarga el listado visible como CSV, para el control logístico en puerta.
   * El armado del texto es puro y vive en `@utils/csv`; aquí queda sólo el
   * efecto de descarga, que no puede estar en `utils/`.
   *
   * Exporta **lo que hay en pantalla**: con una búsqueda puesta salen sólo las
   * coincidencias. Por eso, cuando hay filtro, cambian tanto la etiqueta del
   * botón como el nombre del archivo; bajar el CSV en la puerta creyendo que
   * lleva la lista completa cuando no es así es un problema real.
   */
  const descargarCsv = () => {
    const filas = asistentes.map((asistente) => ({
      ...asistente,
      fechaInscripcion: formatDateTime(asistente.fechaInscripcion),
    }))

    // El BOM hace que Excel abra el archivo como UTF-8 y respete las tildes.
    const blob = new Blob([CSV_BOM, toCsv(filas, ASISTENTE_COLUMNAS)], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')

    enlace.href = url
    enlace.download = filtrando
      ? `asistentes-evento-${id}-coincidencias.csv`
      : `asistentes-evento-${id}.csv`
    enlace.click()

    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-6">
      <Link to={eventoDetalle(id)} className="link inline-flex items-center gap-2 text-sm">
        <ArrowLeftIcon />
        Volver al evento
      </Link>

      <header className="space-y-3">
        <div className="space-y-1">
          <h1 className="font-serif text-headline font-semibold">Asistentes</h1>
          <p className="text-fg-muted">
            {evento
              ? `${evento.titulo} · ${formatDateTime(evento.fecha)} · ${evento.lugar}`
              : 'Cargando datos del evento…'}
          </p>
        </div>

        {/*
          `cuposDisponibles` viaja explícito: es la cifra que calcula la misma
          transacción que descuenta el cupo, y aquí importa de más porque dar de
          baja a alguien lo devuelve. Restarlo en el cliente sería decidir el
          aforo por nuestra cuenta.
        */}
        {evento && (
          <AforoBar
            inscritos={evento.inscritos}
            cupoMaximo={evento.cupoMaximo}
            cuposDisponibles={evento.cuposDisponibles}
            className="max-w-md"
          />
        )}
      </header>

      {/*
        La baja falla aparte de la carga: el listado que se está viendo sigue
        siendo válido, así que se avisa sin tirar la tabla.
      */}
      {errorCancelar && (
        <p role="alert" className="rounded-card bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorCancelar}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input
            type="search"
            value={busqueda}
            onChange={(campo) => setBusqueda(campo.target.value)}
            placeholder="Buscar por nombre, matrícula o correo"
            aria-label="Buscar asistentes"
            className="field pl-9"
          />
        </div>

        <button
          type="button"
          onClick={descargarCsv}
          disabled={asistentes.length === 0}
          className="btn btn-neutral"
        >
          <DownloadIcon />
          {filtrando ? 'Descargar coincidencias' : 'Descargar CSV'}
        </button>
      </div>

      {/*
        Siempre en el DOM aunque esté vacío: un `aria-live` que aparece a la vez
        que su texto no se anuncia de forma fiable.
      */}
      <p className="min-h-5 text-sm text-fg-muted" aria-live="polite">
        {error
          ? ''
          : filtrando
            ? `${total} ${total === 1 ? 'coincidencia' : 'coincidencias'}. El CSV exporta sólo estas.`
            : `${total} ${total === 1 ? 'persona inscrita' : 'personas inscritas'}`}
      </p>

      {error ? (
        <div className="surface space-y-3 bg-danger-soft px-4 py-10 text-center">
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
          <button type="button" onClick={recargar} className="link text-sm">
            Reintentar
          </button>
        </div>
      ) : (
        <AsistentesTable
          asistentes={asistentes}
          cargando={cargando}
          busqueda={busqueda}
          onCancelar={(asistente) => cancelar(asistente.id)}
          cancelandoId={cancelandoId}
        />
      )}
    </section>
  )
}
