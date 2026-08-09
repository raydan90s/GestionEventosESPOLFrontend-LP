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
  const { evento, asistentes, total, cargando, error } = useAsistentes(id, busqueda)

  /**
   * Descarga el listado visible como CSV, para el control logístico en puerta.
   * El armado del texto es puro y vive en `@utils/csv`; aquí queda sólo el
   * efecto de descarga, que no puede estar en `utils/`.
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
    enlace.download = `asistentes-evento-${id}.csv`
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

        {evento && (
          <AforoBar
            inscritos={evento.inscritos}
            cupoMaximo={evento.cupoMaximo}
            className="max-w-md"
          />
        )}
      </header>

      {error && (
        <p role="alert" className="rounded-card bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
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
          Descargar CSV
        </button>
      </div>

      <p className="text-sm text-fg-muted" aria-live="polite">
        {busqueda.trim()
          ? `${total} ${total === 1 ? 'coincidencia' : 'coincidencias'}`
          : `${total} ${total === 1 ? 'persona inscrita' : 'personas inscritas'}`}
      </p>

      <AsistentesTable asistentes={asistentes} cargando={cargando} busqueda={busqueda} />
    </section>
  )
}
