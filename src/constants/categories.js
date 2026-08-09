/**
 * Color de cada categoría de evento.
 *
 * Las categorías **las define la base de datos** y se leen de `/api/categorias`
 * (ver `@services/categoriasService`): aquí no hay ninguna lista de categorías.
 * Lo único que vive en el frontend es de qué color se pinta cada una, porque la
 * tabla `categorias` no guarda color — es una decisión de diseño, no un dato.
 *
 * El emparejamiento es por palabra clave y no por id, para que siga funcionando
 * si alguien renombra «Deportes» a «Deportes y recreación» o si los ids cambian
 * al recargar el seed. Una categoría nueva que no reconozcamos se pinta con el
 * color de reserva en vez de romper la vista.
 *
 * Los valores son variables CSS de `@style/tokens.css`; nunca un hex. El chip
 * las consume con la clase `.chip-cat` (ver PALETA.md §3).
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

/** Color de una categoría que la paleta todavía no contempla. */
export const COLOR_CATEGORIA_RESERVA = 'var(--cat-otra)'

/** Minúsculas y sin tildes, para que el emparejamiento no dependa del acento. */
const normalizar = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/**
 * Variable CSS del color que corresponde al nombre de una categoría.
 * @param {string} nombre Nombre tal como lo devuelve la API.
 * @returns {string}
 */
export function colorDeCategoria(nombre) {
  const texto = normalizar(nombre)
  const encontrada = COLOR_POR_PALABRA.find(({ palabra }) => texto.includes(palabra))

  return encontrada ? encontrada.color : COLOR_CATEGORIA_RESERVA
}
