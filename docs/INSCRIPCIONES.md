# Inscripciones y asistentes

Requerimientos funcionales de **Diego Parrales**:

| RF | Tipo | Dónde vive |
| :--- | :--- | :--- |
| Registrar inscripción | Escritura | [InscripcionForm.jsx](../src/components/InscripcionForm.jsx) en el detalle del evento |
| Ver asistentes | Lectura | [AsistentesPage.jsx](../src/pages/AsistentesPage.jsx), ruta `/eventos/:id/asistentes` |

El backend (PHP + PostgreSQL) resuelve los dos en `InscripcionController` y en el
modelo `Inscripcion`, sobre las rutas `POST /api/eventos/{id}/inscripciones` y
`GET /api/eventos/{id}/asistentes`.

---

## Archivos

```
src/
  components/
    FormField.jsx          campo de formulario con etiqueta, pista y error
    InscripcionForm.jsx    RF "Registrar inscripción"
    AsistentesTable.jsx    tabla de sólo lectura del listado
  constants/
    asistentes.js          columnas compartidas por la tabla y el CSV
  hooks/
    useInscripcion.js      estado del formulario y clasificación de errores
    useAsistentes.js       carga del listado, búsqueda con debounce y cancelación
  pages/
    AsistentesPage.jsx     RF "Ver asistentes" (vista de organizador)
  services/
    inscripcionesService.js  llamadas HTTP + traducción snake_case ↔ camelCase
  utils/
    csv.js                 armado puro del CSV (RFC 4180)
```

---

## El aforo lo decide el servidor, nunca el cliente

El modelo `Inscripcion::registrar()` abre una transacción, bloquea la fila del
evento con `SELECT … FOR UPDATE`, comprueba los cupos y sólo entonces inserta y
descuenta. Dos personas que peleen por el último cupo no pueden ganarlo las dos:
la segunda recibe un `409`.

Por eso el frontend **no descuenta cupos ni decide si hay espacio**. La prop
`cuposDisponibles` de `InscripcionForm` es opcional y sólo adelanta el estado
«sin cupos» cuando la vista ya conoce el aforo; si no llega, el formulario se
muestra igual y el `409` es quien avisa.

---

## Traducción de nombres

La API responde en `snake_case` y el frontend trabaja en `camelCase`. Toda la
traducción está en [inscripcionesService.js](../src/services/inscripcionesService.js):
ningún componente ve una clave de la base de datos.

| Formulario / componente | API |
| :--- | :--- |
| `nombre` | `nombre_estudiante` |
| `correo` | `correo` |
| `matricula` | `matricula` |
| `telefono` | `telefono` |
| `fechaInscripcion` | `fecha_inscripcion` (listado) / `created_at` (alta) |
| `cupoMaximo` | `cupos_maximos` |
| `cuposDisponibles` | `cupos_disponibles` |
| `lugar` | `ubicacion` |
| `fecha` | `fecha_evento` |

El mapeo también se recorre al revés para los errores de validación: la API los
agrupa por campo (`{ "correo": ["El campo correo debe ser un correo valido."] }`)
y `erroresDeCampo()` los devuelve con la clave del formulario, para pintarlos
bajo el input correcto.

---

## Cómo se muestra cada fallo

`useInscripcion` separa tres casos porque cada uno se ve distinto:

| Estado | HTTP | Dónde se pinta |
| :--- | :--- | :--- |
| `errores` | 422 | Bajo el input, en `text-danger`, con el borde del campo en rojo |
| `conflicto` | 409 | Aviso en `bg-danger-soft` sobre el formulario |
| `error` | red caída, 5xx | Aviso en `bg-danger-soft` sobre el formulario |

El `409` cubre cuatro situaciones y el `message` del backend ya es legible en
español, así que se muestra tal cual: sin cupos, correo ya inscrito, evento
cancelado y evento ya realizado.

Tras un alta exitosa el formulario se sustituye por una confirmación en
`bg-success-soft` con los cupos restantes que devolvió el servidor.

---

## Búsqueda de asistentes

El filtro lo resuelve el backend con `ILIKE` sobre nombre, matrícula y correo
(`GET /api/eventos/{id}/asistentes?q=…`), **no el cliente**: el listado puede ser
largo y el filtro debe aplicarse sobre todos los inscritos, no sólo sobre los ya
descargados.

`useAsistentes` espera 300 ms a que el organizador deje de escribir y cancela la
petición anterior con `AbortController`, para que una respuesta lenta no pise a
otra más reciente. La primera carga muestra el esqueleto; las búsquedas
posteriores mantienen la tabla visible para que no parpadee en cada tecla.

---

## Uso de la paleta

Se respeta la regla «el azul manda, el ámbar interrumpe» de [PALETA.md](./PALETA.md):

- El **botón de confirmar inscripción** es el único elemento ámbar del bloque, y
  va en `font-semibold` por el contraste (PALETA.md §4).
- El enlace «Ver asistentes», el de volver y el de «Inscribir a otra persona» van
  en azul institucional.
- La tabla de asistentes no usa acento ni colores `cat-*`: es una herramienta de
  trabajo, no una tarjeta de catálogo.
- La barra de aforo de la vista de organizador reutiliza `AforoBar`, con sus
  umbrales verde / ámbar / rojo.

---

## Exportación a CSV

El botón «Descargar CSV» genera el listado visible —incluido el filtro aplicado—
para el control en puerta. `toCsv()` es puro y vive en `@utils/csv`; el efecto de
descarga se queda en la página, porque `utils/` no admite efectos
(ver [ESTRUCTURA.md](./ESTRUCTURA.md)). El archivo lleva BOM UTF-8 para que Excel
respete las tildes.
