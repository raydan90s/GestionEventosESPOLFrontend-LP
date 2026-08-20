/**
 * Columnas del listado de asistentes, en el orden en que se muestran.
 * Viven aqui para que la tabla y la exportacion a CSV no se desincronicen.
 *
 * @typedef {Object} AttendeeColumn
 * @property {keyof import('@/types/event').Attendee} key
 * @property {string} label
 */

/** @type {readonly AttendeeColumn[]} */
export const ASISTENTE_COLUMNAS = Object.freeze([
  { key: 'nombre',           label: 'Nombre' },
  { key: 'matricula',        label: 'Matrícula' },
  { key: 'correo',           label: 'Correo' },
  { key: 'telefono',         label: 'Teléfono' },
  { key: 'fechaInscripcion', label: 'Inscrito el' },
])
