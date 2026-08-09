/**
 * Marca de orden de bytes UTF-8. Sin ella Excel abre el CSV en la codificación
 * del sistema y las tildes salen rotas. Va como escape y no como carácter
 * literal porque en el editor sería invisible.
 */
export const CSV_BOM = '\uFEFF'

/**
 * Escapa un valor para CSV (RFC 4180): se entrecomilla si contiene el
 * separador, comillas o saltos de línea, y las comillas internas se duplican.
 * @param {unknown} value
 * @returns {string}
 */
function escapeCell(value) {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * Convierte una lista de objetos en un CSV con cabecera.
 *
 * @param {Record<string, unknown>[]} rows
 * @param {{ key: string, label: string }[]} columns Orden y títulos de las columnas.
 * @returns {string} CSV con saltos `\r\n`, para que Excel lo abra bien en Windows.
 */
export function toCsv(rows, columns) {
  const header = columns.map((column) => escapeCell(column.label)).join(',')
  const body = rows.map((row) => columns.map((column) => escapeCell(row[column.key])).join(','))

  return [header, ...body].join('\r\n')
}
