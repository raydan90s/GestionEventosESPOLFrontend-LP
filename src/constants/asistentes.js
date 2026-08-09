/**
 * Columnas del listado de asistentes, en el orden en que se muestran.
 *
 * Viven en `constants/` y no dentro del componente porque la tabla y la
 * exportación a CSV deben coincidir: si se añade una columna, aparece en las dos.
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
