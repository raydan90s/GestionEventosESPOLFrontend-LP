/**
 * Estados de un evento.
 *
 * Son exactamente los tres que acepta la columna `estado` de la tabla `eventos`
 * (`CHECK (estado IN ('activo', 'cancelado', 'finalizado'))`). No inventar
 * estados que la base rechazaría al guardar.
 *
 * «Sin cupos» no es un estado: es una consecuencia del aforo y se calcula con
 * `cuposDisponibles` (ver `@utils/aforo`).
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

/** Umbrales de la barra de aforo: verde <60 %, ámbar 60–90 %, rojo >90 %. */
export const AFORO_WARNING_RATIO = 0.6
export const AFORO_DANGER_RATIO = 0.9
