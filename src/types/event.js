/**
 * Tipados compartidos (JSDoc typedefs); no exporta nada en runtime.
 * Son las formas que salen de la capa de servicios, ya en camelCase.
 *
 * @typedef {Object} Event
 * @property {number}  id
 * @property {string}  titulo
 * @property {string}  descripcion
 * @property {number}  categoriaId       Id de la tabla `categorias`.
 * @property {string}  categoriaNombre   Nombre resuelto por el JOIN de la API.
 * @property {string}  lugar             Ubicacion dentro del campus.
 * @property {string}  fecha             ISO 8601.
 * @property {number}  cupoMaximo        Aforo total.
 * @property {number}  cuposDisponibles  Cupos libres, segun el servidor.
 * @property {number}  inscritos         Inscripciones confirmadas.
 * @property {string}  organizador
 * @property {string}  estado            Ver `@constants/eventStatus`.
 *
 * El `color` de `Category` lo anade el frontend (ver `@constants/categories`).
 *
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} totalEventos  Eventos activos de esa categoria.
 * @property {string} color         Variable CSS, nunca un hex.
 *
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} autor
 * @property {string} contenido
 * @property {string} fecha ISO 8601.
 *
 * Asistente inscrito, ya normalizado por `@services/inscripcionesService`.
 *
 * @typedef {Object} Attendee
 * @property {number} id
 * @property {string} nombre
 * @property {string} matricula        Cadena vacia si el estudiante no la registro.
 * @property {string} correo
 * @property {string} telefono         Cadena vacia si no lo registro.
 * @property {string} fechaInscripcion ISO 8601.
 *
 * Cabecera del listado de asistentes: evita pedir el evento por separado.
 *
 * @typedef {Object} EventSummary
 * @property {number} id
 * @property {string} titulo
 * @property {string} fecha             ISO 8601.
 * @property {string} lugar
 * @property {number} cupoMaximo
 * @property {number} cuposDisponibles
 * @property {number} inscritos
 *
 * Respuesta de `getAsistentes`.
 *
 * @typedef {Object} AttendeeList
 * @property {EventSummary}  evento
 * @property {number}        total
 * @property {Attendee[]}    asistentes
 *
 * Inscripcion recien creada, tal como la devuelve `registrarInscripcion`.
 *
 * @typedef {Object} Registration
 * @property {number} id
 * @property {number} eventoId
 * @property {string} eventoTitulo
 * @property {string} nombre
 * @property {string} matricula
 * @property {string} correo
 * @property {string} telefono
 * @property {string} fechaInscripcion ISO 8601.
 * @property {number} cuposRestantes   Aforo libre despues de descontar esta inscripcion.
 */

export {}
