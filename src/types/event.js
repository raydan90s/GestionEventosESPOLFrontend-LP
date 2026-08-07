/**
 * Tipados compartidos (JSDoc typedefs). Este archivo no exporta valores en runtime:
 * sirve para que el editor entienda las formas que devuelve la API.
 *
 * @typedef {Object} Event
 * @property {number}  id
 * @property {string}  titulo
 * @property {string}  descripcion
 * @property {string}  categoriaId   Id de `@constants/categories`.
 * @property {string}  fecha         ISO 8601.
 * @property {string}  lugar         Ubicación dentro del campus.
 * @property {number}  cupoMaximo    Aforo total.
 * @property {number}  inscritos     Inscripciones confirmadas.
 * @property {string}  estado        Ver `@constants/eventStatus`.
 *
 * @typedef {Object} Attendee
 * @property {number} id
 * @property {string} nombre
 * @property {string} correo
 * @property {string} fechaInscripcion ISO 8601.
 *
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} autor
 * @property {string} contenido
 * @property {string} fecha ISO 8601.
 */

export {}
