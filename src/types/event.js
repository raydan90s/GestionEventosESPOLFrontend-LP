/**
 * Tipados compartidos (JSDoc typedefs). Este archivo no exporta valores en runtime:
 * sirve para que el editor entienda las formas que devuelve la API.
 *
 * Todas estas formas son las que sale de la capa de servicios, ya traducidas a
 * camelCase. La API responde en snake_case (`cupos_maximos`, `fecha_evento`,
 * `nombre_estudiante`) y ningún componente debería ver esas claves.
 *
 * @typedef {Object} Event
 * @property {number}  id
 * @property {string}  titulo
 * @property {string}  descripcion
 * @property {number}  categoriaId       Id de la tabla `categorias`.
 * @property {string}  categoriaNombre   Nombre resuelto por el JOIN de la API.
 * @property {string}  lugar             Ubicación dentro del campus.
 * @property {string}  fecha             ISO 8601.
 * @property {number}  cupoMaximo        Aforo total.
 * @property {number}  cuposDisponibles  Cupos libres, según el servidor.
 * @property {number}  inscritos         Inscripciones confirmadas.
 * @property {string}  organizador
 * @property {string}  estado            Ver `@constants/eventStatus`.
 *
 * Categoría preestablecida. Las define la base; el `color` lo añade el
 * frontend, porque la tabla no guarda color (ver `@constants/categories`).
 *
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} totalEventos  Eventos activos de esa categoría.
 * @property {string} color         Variable CSS, nunca un hex.
 *
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} autor
 * @property {string} contenido
 * @property {string} fecha ISO 8601.
 *
 * Un asistente inscrito. La API lo devuelve en snake_case
 * (`nombre_estudiante`, `fecha_inscripcion`); `@services/inscripcionesService`
 * lo normaliza a estas claves antes de que llegue a los componentes.
 *
 * @typedef {Object} Attendee
 * @property {number} id
 * @property {string} nombre
 * @property {string} matricula        Cadena vacía si el estudiante no la registró.
 * @property {string} correo
 * @property {string} telefono         Cadena vacía si no lo registró.
 * @property {string} fechaInscripcion ISO 8601.
 *
 * Cabecera que acompaña al listado de asistentes: los datos del evento que el
 * organizador necesita ver junto a la lista, sin pedir el evento por separado.
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
 * Inscripción recién creada, tal como la devuelve `registrarInscripcion`.
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
 * @property {number} cuposRestantes   Aforo libre después de descontar esta inscripción.
 */

export {}
