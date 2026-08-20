/**
 * Estados de un evento: los tres que acepta el CHECK de la columna `estado`.
 * "Sin cupos" no es un estado, sale de `cuposDisponibles` (`@utils/aforo`).
 */
export const EVENT_STATUS = Object.freeze({
  ACTIVO: 'activo',
  CANCELADO: 'cancelado',
  FINALIZADO: 'finalizado',
})

/** Etiqueta visible y clases de color por estado. */
export const EVENT_STATUS_META = Object.freeze({
  [EVENT_STATUS.ACTIVO]:     { label: 'Activo',     chip: 'bg-success-soft text-success' },
  [EVENT_STATUS.CANCELADO]:  { label: 'Cancelado',  chip: 'bg-danger-soft text-danger' },
  [EVENT_STATUS.FINALIZADO]: { label: 'Finalizado', chip: 'bg-card-muted text-fg-subtle' },
})

/** Umbrales de la barra de aforo: verde <60 %, ambar 60-90 %, rojo >90 %. */
export const AFORO_WARNING_RATIO = 0.6
export const AFORO_DANGER_RATIO = 0.9
