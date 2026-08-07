/**
 * Categorías preestablecidas de eventos.
 *
 * `color` es el token CSS de la categoría. El chip se pinta con la clase `.chip-cat`
 * (ver `src/style/index.css`), que toma el color de la variable `--chip-color`:
 * texto y borde en el color puro, fondo el mismo color al 12 %.
 * Nunca hardcodear hex en los componentes.
 *
 * @typedef {Object} Category
 * @property {string} id    Identificador que viaja a la API.
 * @property {string} label Nombre visible.
 * @property {string} color Variable CSS del color de la categoría.
 */

/** @type {readonly Category[]} */
export const CATEGORIES = Object.freeze([
  { id: 'taller',    label: 'Taller',    color: 'var(--cat-taller)' },
  { id: 'club',      label: 'Club',      color: 'var(--cat-club)' },
  { id: 'seminario', label: 'Seminario', color: 'var(--cat-seminario)' },
  { id: 'deporte',   label: 'Deporte',   color: 'var(--cat-deporte)' },
  { id: 'cultura',   label: 'Cultura',   color: 'var(--cat-cultura)' },
])

/** @type {Record<string, Category>} */
export const CATEGORIES_BY_ID = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
)

/**
 * Devuelve una categoría por su id.
 * @param {string} id
 * @returns {Category | undefined}
 */
export function getCategory(id) {
  return CATEGORIES_BY_ID[id]
}
