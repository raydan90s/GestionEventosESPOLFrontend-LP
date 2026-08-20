/**
 * Color de cada categoria, lo unico que el frontend anade a lo que da la API.
 * Empareja por palabra clave y no por id; los valores salen de `tokens.css`
 * (PALETA.md §3).
 */

/** @type {readonly { palabra: string, color: string }[]} */
const COLOR_POR_PALABRA = Object.freeze([
  { palabra: 'taller',         color: 'var(--cat-taller)' },
  { palabra: 'seminario',      color: 'var(--cat-seminario)' },
  { palabra: 'club',           color: 'var(--cat-club)' },
  { palabra: 'deporte',        color: 'var(--cat-deporte)' },
  { palabra: 'cultura',        color: 'var(--cat-cultura)' },
  { palabra: 'arte',           color: 'var(--cat-cultura)' },
  { palabra: 'emprendimiento', color: 'var(--cat-emprendimiento)' },
])

/** Color de una categoria que la paleta todavia no contempla. */
export const COLOR_CATEGORIA_RESERVA = 'var(--cat-otra)'

/**
 * Minusculas y sin tildes. Se exporta porque el buscador de categorias del
 * catalogo tiene que comparar igual.
 */
export const normalizar = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/**
 * Variable CSS del color que corresponde al nombre de una categoria.
 * @param {string} nombre Nombre tal como lo devuelve la API.
 * @returns {string}
 */
export function colorDeCategoria(nombre) {
  const texto = normalizar(nombre)
  const encontrada = COLOR_POR_PALABRA.find(({ palabra }) => texto.includes(palabra))

  return encontrada ? encontrada.color : COLOR_CATEGORIA_RESERVA
}
