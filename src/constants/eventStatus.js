/** Estados posibles de un evento. */
export const EVENT_STATUS = Object.freeze({
  BORRADOR: 'borrador',
  PUBLICADO: 'publicado',
  LLENO: 'lleno',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado',
})

/** Etiqueta visible y clases de color por estado. */
export const EVENT_STATUS_META = Object.freeze({
  [EVENT_STATUS.BORRADOR]:   { label: 'Borrador',   chip: 'bg-card-muted text-fg-muted' },
  [EVENT_STATUS.PUBLICADO]:  { label: 'Publicado',  chip: 'bg-success-soft text-success' },
  [EVENT_STATUS.LLENO]:      { label: 'Sin cupos',  chip: 'bg-danger-soft text-danger' },
  [EVENT_STATUS.FINALIZADO]: { label: 'Finalizado', chip: 'bg-card-muted text-fg-subtle' },
  [EVENT_STATUS.CANCELADO]:  { label: 'Cancelado',  chip: 'bg-danger-soft text-danger' },
})

/** Umbrales de la barra de aforo: verde <60 %, ámbar 60–90 %, rojo >90 %. */
export const AFORO_WARNING_RATIO = 0.6
export const AFORO_DANGER_RATIO = 0.9
