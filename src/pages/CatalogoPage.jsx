import { useState } from 'react'
import { EventCard } from '@components/EventCard'
import { CATEGORIES } from '@constants/categories'
import { EVENT_STATUS } from '@constants/eventStatus'
import { cn } from '@utils/cn'

/**
 * Datos de ejemplo para verificar tokens y alias mientras la API no está conectada.
 * Sustituir por `getEvents()` de `@services/eventsService`.
 * @type {import('@/types/event').Event[]}
 */
const EVENTOS_DEMO = [
  {
    id: 1,
    titulo: 'Taller de introducción a React',
    descripcion: 'Sesión práctica de componentes, estado y ruteo para construir tu primera SPA.',
    categoriaId: 'taller',
    fecha: '2026-08-20T15:00:00',
    lugar: 'Laboratorio FIEC 2',
    cupoMaximo: 30,
    inscritos: 12,
    estado: EVENT_STATUS.PUBLICADO,
  },
  {
    id: 2,
    titulo: 'Seminario de Arquitectura de Software',
    descripcion: 'Charla sobre patrones MVC y arquitecturas desacopladas en proyectos reales.',
    categoriaId: 'seminario',
    fecha: '2026-08-22T10:30:00',
    lugar: 'Auditorio Cámara de Comercio',
    cupoMaximo: 120,
    inscritos: 95,
    estado: EVENT_STATUS.PUBLICADO,
  },
  {
    id: 3,
    titulo: 'Torneo interfacultades de fútbol',
    descripcion: 'Inscripción por equipos de la comunidad politécnica. Cupos casi agotados.',
    categoriaId: 'deporte',
    fecha: '2026-08-29T08:00:00',
    lugar: 'Canchas del campus Gustavo Galindo',
    cupoMaximo: 16,
    inscritos: 16,
    estado: EVENT_STATUS.LLENO,
  },
]

/** Catálogo filtrable por categoría. */
export default function CatalogoPage() {
  const [categoria, setCategoria] = useState('')

  const eventos = categoria
    ? EVENTOS_DEMO.filter((evento) => evento.categoriaId === categoria)
    : EVENTOS_DEMO

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Catálogo de eventos</h1>
        <p className="text-sm text-fg-muted">
          Actividades académicas y extracurriculares de la ESPOL.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FiltroChip active={categoria === ''} onClick={() => setCategoria('')}>
          Todas
        </FiltroChip>
        {CATEGORIES.map((cat) => (
          <FiltroChip
            key={cat.id}
            active={categoria === cat.id}
            onClick={() => setCategoria(cat.id)}
          >
            {cat.label}
          </FiltroChip>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {eventos.map((evento) => (
          <EventCard key={evento.id} event={evento} />
        ))}
      </div>
    </section>
  )
}

/** Botón de filtro. Activo en azul institucional. */
function FiltroChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-pill border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-primary bg-primary-soft font-medium text-primary'
          : 'border-edge bg-card text-fg-muted hover:bg-card-hover',
      )}
    >
      {children}
    </button>
  )
}
