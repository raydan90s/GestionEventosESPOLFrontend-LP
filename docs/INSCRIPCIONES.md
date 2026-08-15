# Inscripciones y asistentes

Requerimientos funcionales de **Diego Parrales**:

| RF | Tipo | Dónde vive |
| :--- | :--- | :--- |
| Registrar inscripción | Escritura | [InscripcionForm.jsx](../src/components/InscripcionForm.jsx) en el detalle del evento |
| Ver asistentes | Lectura | [AsistentesPage.jsx](../src/pages/AsistentesPage.jsx), ruta `/eventos/:id/asistentes` |

El backend (PHP + PostgreSQL) resuelve los dos en `InscripcionController` y en el
modelo `Inscripcion`, sobre las rutas `POST /api/eventos/{id}/inscripciones`,
`GET /api/eventos/{id}/asistentes` y `DELETE /api/inscripciones/{id}`.

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

### La confirmación no promete ningún correo

El mensaje dice **«Guardamos tu inscripción a *Evento* a nombre de Ana Vera
(ana.vera@espol.edu.ec)»**: sólo lo que de verdad ocurrió. Antes decía «Enviamos la
confirmación a …», y era falso — la propuesta declara fuera de alcance el «envío
automatizado de correos electrónicos institucionales o notificaciones push/SMS» y no
hay nada en el backend que mande un correo. El correo se repite como **referencia del
dato guardado**, no como destino de un aviso.

Se mantienen los cupos restantes y el enlace «Inscribir a otra persona», que sí son
ciertos. **No debe aparecer en el módulo ninguna referencia a correos enviados, avisos
o recordatorios** mientras el envío de correo siga fuera de alcance.

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

### Los tres estados

- **Carga**: esqueletos con la altura real de las filas, en `aria-busy`.
- **Vacío**: dos textos distintos según haya búsqueda o no, como en el catálogo.
- **Error**: mensaje en `bg-danger-soft` **con botón «Reintentar»** que llama a
  `recargar()`. Antes sólo estaba el mensaje y la única salida era recargar el
  navegador entero, mientras que el catálogo y el detalle sí ofrecían reintentar.

Sin `eventoId` el efecto no pide nada, y `cargando` se apaga **por cálculo**
(`cargando && !sinId`) en vez de con un `setCargando(false)` dentro del efecto —que
la regla `react-hooks/set-state-in-effect` rechaza—. Si el estado se quedara en su
`true` inicial, la tabla enseñaría los esqueletos para siempre. Hoy la ruta siempre
trae id, así que es un seguro. `useComentarios` tiene el mismo patrón pendiente de
arreglar: debe resolverse igual, derivando y no con `setState` en el efecto.

---

## Dar de baja a un asistente

`DELETE /api/inscripciones/{id}` **sí se expone en la interfaz**, en la columna de
acciones de la tabla de asistentes. La alternativa era borrar la función del service y
dejar el endpoint sólo para uso administrativo desde la API; se descartó porque el RF
habla de «control logístico por parte de los organizadores», y un organizador que no
puede dar de baja a quien avisó que no va, no controla el aforo. Que la app no tenga
roles es una limitación conocida de esta entrega —cualquiera que llegue a la vista
puede dar de baja a cualquiera— y por eso la acción es explícita y confirmada, no un
icono suelto.

Cómo está resuelto:

- La columna sólo aparece si a `AsistentesTable` se le pasa `onCancelar`; sin esa prop
  la tabla sigue siendo el listado de sólo lectura de siempre.
- **Confirmación en la propia fila**: el botón «Dar de baja» se convierte en
  «¿Liberar su cupo? · Sí, dar de baja · No». Es en línea y no un modal porque la fila
  con el nombre de la persona sigue delante mientras se decide.
- Mientras hay una baja en curso la fila muestra «Dando de baja…» y **toda la columna
  queda bloqueada**: al terminar se recarga el listado entero y los índices cambian.
- Al confirmar, `useAsistentes.cancelar()` llama al service y luego a `recargar()`. No
  se quita la fila en memoria ni se suma un cupo a mano: el `DELETE` cambia también el
  aforo, y listado y resumen salen de la misma respuesta. Descontar en el cliente sería
  romper la regla de arriba.
- Si el `DELETE` falla, el aviso (`errorCancelar`) se pinta sobre la barra de búsqueda
  y **la tabla no se tira**: el listado que se está viendo sigue siendo válido.

## Uso de la paleta

Se respeta la regla «el azul manda, el ámbar interrumpe» de [PALETA.md](./PALETA.md):

- El **botón de confirmar inscripción** es el único elemento ámbar del bloque, y
  va en `font-semibold` por el contraste (PALETA.md §4).
- El enlace «Ver asistentes», el de volver y el de «Inscribir a otra persona» van
  en azul institucional.
- La tabla de asistentes no usa acento ni colores `cat-*`: es una herramienta de
  trabajo, no una tarjeta de catálogo. «Dar de baja» y «Descargar CSV» van los dos
  en `.btn-neutral`: **ni ámbar** —reservado a inscribirse— **ni rojo de fondo**,
  reservado a errores y a «sin cupos».
- La barra de aforo de la vista de organizador reutiliza `AforoBar`: pista neutra y
  relleno **azul**, rojo sólo cuando no queda ni un cupo. Los eventos apretados se
  avisan resaltando el texto, nunca tiñendo la barra de ámbar (PALETA.md §2). Recibe
  `cuposDisponibles` del servidor de forma explícita.

---

## Exportación a CSV

El CSV exporta **lo que hay en pantalla**, filtro incluido: con una búsqueda activa
salen sólo las coincidencias, no todos los inscritos. Se mantiene ese comportamiento
—a veces se quiere justo el filtro— pero **el botón lo dice**, porque un organizador
que baja el CSV en la puerta creyendo que lleva la lista completa tiene un problema
real. Con búsqueda activa cambian tres cosas:

| | Sin búsqueda | Con búsqueda |
| :--- | :--- | :--- |
| Etiqueta | «Descargar CSV» | «Descargar coincidencias» |
| Recuento | «N personas inscritas» | «N coincidencias. El CSV exporta sólo estas.» |
| Archivo | `asistentes-evento-{id}.csv` | `asistentes-evento-{id}-coincidencias.csv` |

No hay dos descargas —completa y filtrada—: para bajar la lista entera se limpia la
búsqueda. `toCsv()` es puro y vive en `@utils/csv`; el efecto de descarga se queda en
la página, porque `utils/` no admite efectos (ver [ESTRUCTURA.md](./ESTRUCTURA.md)).
El archivo lleva BOM UTF-8 para que Excel respete las tildes.
