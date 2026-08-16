# Comentarios de eventos

Requerimientos funcionales de **Eimmy Ochoa**:

| RF | Tipo | Dónde vive |
| :--- | :--- | :--- |
| Escribir comentario de evento | Escritura | [ComentariosSection.jsx](../src/components/ComentariosSection.jsx) |
| Ver comentarios de evento | Lectura | [ComentariosSection.jsx](../src/components/ComentariosSection.jsx) |

Ambos requerimientos se centralizan en la vista de detalles del evento y son gestionados por el hook `useComentarios.js` y el servicio `comentariosService.js`.

---

## Contrato de la API

El backend (PHP + PostgreSQL) expone los siguientes endpoints para la gestión de comentarios:

```http
GET  /api/eventos/{id}/comentarios?limite=&offset=
```
- Devuelve: `{ ok: true, total: <COUNT(*) real de la tabla>, data: [...] }`.
- `limite` por defecto es 50, `offset` por defecto es 0.
- El valor `total` representa la cantidad real de comentarios en la base de datos para ese evento, y se utiliza para calcular la paginación de manera eficiente.

```http
POST /api/eventos/{id}/comentarios
```
- Body: `{ autor, contenido }`.
- `autor`: string, de 3 a 120 caracteres.
- `contenido`: string, de 3 a 1000 caracteres.
- Devuelve `201 { ok: true, data: {...} }` si fue exitoso, o un error `422` con detalles por campo si hubo problemas de validación.

```http
DELETE /api/comentarios/{id}
```
- Endpoint existente para eliminar comentarios. Retorna `200` si es exitoso. Nadie lo llama desde el frontend.

---

## Traducción de nombres y el adaptador `toComment`

Al igual que en otras partes de la plataforma, la API devuelve los datos utilizando `snake_case` (por ejemplo, `created_at`), pero en el frontend todo se maneja en `camelCase`. 

Toda la traducción y normalización ocurre en la capa de servicios, específicamente a través del adaptador `toComment` en [`comentariosService.js`](../src/services/comentariosService.js). Esta decisión de arquitectura asegura que **ningún componente de UI deba conocer ni interactuar con las claves reales de la base de datos**.

---

## Publicar comentarios sin recargar la lista

Al enviar un comentario de forma exitosa mediante el formulario, la decisión tomada fue **anteponer el comentario recién creado al estado local** en lugar de volver a hacer una petición `GET` completa a la lista. 

El endpoint `POST` ya nos devuelve el objeto de comentario completo con su `id` y `fecha` reales generados por el servidor. Recargar la lista entera representaría una llamada HTTP innecesaria para obtener la misma información.

---

## Validación del cliente como comodidad

La base de datos tiene restricciones claras, por ejemplo, el contenido requiere `CHECK (char_length BETWEEN 3 AND 1000)`. 

Estos mismos límites numéricos se definen y validan en el cliente antes de llamar a la API. Esta validación local se añade por **comodidad para el usuario**, permitiéndole recibir retroalimentación instantánea sin necesidad de realizar un viaje de ida y vuelta al servidor (y evita solicitudes inválidas de ser enviadas). Es vital recordar que **esto no reemplaza la seguridad del servidor**; la validación que ocurre en el backend sigue intacta y responde con `422` si las reglas no se cumplen.

---

## Paginación con offset desacoplado

Dado que el `total` devuelto por el backend es la cuenta real de comentarios, y el endpoint permite paginación (`limite` y `offset`), implementamos un botón "Ver más comentarios" para cargar los lotes faltantes (en lotes de 20).

Un aspecto crítico de la implementación es que **el `offset` se guarda en su propia variable (una referencia en memoria, `offsetRef`)**, la cual solo avanza tras presionar "Cargar más". El valor del offset **no** se deriva simplemente de `comentarios.length`. Esta separación existe porque publicar un comentario incrementa artificialmente el tamaño de la lista local; de derivar el offset desde este largo, un comentario nuevo crearía un descuadre (saltando o repitiendo comentarios) respecto a la paginación del servidor en las subsiguientes llamadas de carga.

---

## Decisión sobre borrar comentarios

Aunque el endpoint `DELETE /api/comentarios/{id}` está disponible, **la interfaz gráfica no expone ninguna manera de llamarlo**.

Esta ausencia es intencional. La propuesta deja fuera del alcance un sistema de login complejo con múltiples roles; sin él, no existe un mecanismo seguro para restringir quién puede borrar qué comentario. En lugar de exponer una funcionalidad de borrado pública a todo el mundo (lo cual sería un riesgo severo para los datos), la interfaz omite el botón de borrado, dejando dicha tarea para la moderación manual directamente a nivel de API o base de datos.
