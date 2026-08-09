# Estructura del proyecto

Frontend de la Plataforma Web para la Organización y Gestión de Eventos ESPOL.
React + Vite + JavaScript (ESModules), Tailwind CSS v3 y react-router-dom.
El backend (API RESTful en PHP + PostgreSQL) vive en un repositorio aparte.

## Árbol de carpetas

```
docs/               documentación técnica: arquitectura, decisiones, specs
public/             archivos servidos tal cual (favicon, íconos)
src/
  assets/           imágenes, íconos y fuentes locales
  components/       componentes reutilizables
  config/           configuración de la app (env, base URL de la API)
  constants/        valores fijos (rutas, categorías, estados de evento)
  context/          React Contexts + providers
  hooks/            custom hooks
  pages/            vistas ruteables
  services/         llamadas HTTP / capa de API
  style/            index.css, tokens.css y estilos globales
  types/            tipados / JSDoc typedefs
  utils/            helpers puros
  App.jsx           layout y definición de rutas
  main.jsx          punto de entrada (providers + router)
```

### Qué va en cada carpeta

| Carpeta | Contiene | No contiene |
| :--- | :--- | :--- |
| `components/` | UI reutilizable, sin lógica de datos propia | Vistas completas de una ruta |
| `pages/` | Una vista por ruta, `export default` | UI reutilizable entre rutas |
| `services/` | `fetch` a la API, un módulo por recurso | Estado de React |
| `hooks/` | Lógica con estado reutilizable | Llamadas `fetch` directas (van vía `services/`) |
| `utils/` | Funciones puras, sin React ni red | Cualquier cosa con efectos |
| `constants/` | Valores fijos congelados con `Object.freeze` | Datos de dominio que los sirve la API, y valores que dependan del entorno (van en `config/`) |
| `config/` | Lectura de `import.meta.env` | Constantes de dominio |
| `types/` | `@typedef` de JSDoc, sin valores en runtime | Lógica |

## Alias de imports

Nunca se usan rutas relativas tipo `../../`. Cada carpeta de `src/` tiene su alias,
declarado en dos sitios que deben mantenerse sincronizados:

- [vite.config.js](../vite.config.js) — `resolve.alias`, lo que resuelve el bundler.
- [jsconfig.json](../jsconfig.json) — `compilerOptions.paths`, lo que autocompleta el editor.

| Alias | Apunta a |
| :--- | :--- |
| `@context` | `src/context` |
| `@services` | `src/services` |
| `@assets` | `src/assets` |
| `@components` | `src/components` |
| `@hooks` | `src/hooks` |
| `@pages` | `src/pages` |
| `@utils` | `src/utils` |
| `@constants` | `src/constants` |
| `@config` | `src/config` |
| `@style` | `src/style` |
| `@` | `src` |

```js
import { EventCard } from '@components/EventCard'
import { getEvents } from '@services/eventsService'
import { colorDeCategoria } from '@constants/categories'
import '@/style/index.css'
```

> **`@` va último en `resolve.alias`.** Vite evalúa los alias en orden y `@` es prefijo de
> todos los demás: si se declara primero, `@components/EventCard` se resolvería como
> `src/components/EventCard` por la vía equivocada y los alias específicos quedarían muertos.
> Al añadir un alias nuevo, insértalo **antes** de la entrada `@`.

## Convenciones

- Componentes en `PascalCase.jsx` con **named export**; páginas en `PascalCasePage.jsx`
  con **default export**.
- Módulos que no son componentes van en `camelCase.js`.
- Nada de hex hardcodeado en los componentes: todos los colores salen de los tokens
  vía clases semánticas de Tailwind. Ver [PALETA.md](./PALETA.md).
- Los tipos se documentan con JSDoc (`@typedef` en `src/types/`), no con TypeScript.

## Los datos vienen de la API, sin excepciones

No hay datos de ejemplo ni listas escritas a mano en las vistas. Categorías,
eventos, comentarios y asistentes se piden a la API PHP, y el filtrado y la
búsqueda se resuelven en SQL, no en el cliente: el catálogo puede crecer y no
tiene sentido descargarlo entero para filtrarlo en memoria.

Lo único que sigue siendo constante en el frontend son las decisiones de diseño
que la base no guarda —el color de cada categoría— y los límites que la propia
base impone, replicados para poder validar antes de enviar.

| Módulo | Recurso |
| :--- | :--- |
| `services/categoriasService` | `/api/categorias` |
| `services/eventsService` | `/api/eventos` |
| `services/comentariosService` | `/api/eventos/{id}/comentarios` |
| `services/inscripcionesService` | `/api/eventos/{id}/inscripciones` y `/asistentes` |
| `services/apiErrors` | Lectura de los 422 y 409 que devuelve la API |

**La API responde en `snake_case` y el frontend trabaja en `camelCase`.** Toda la
traducción vive en la capa de servicios: ningún componente ve una clave de la
base de datos. Cada service exporta un adaptador (`toEvent`, `toAttendee`, …)
y, cuando tiene formulario, un `erroresDeCampo()` que traduce las claves de los
errores 422 de vuelta a los nombres del formulario.

Las marcas de tiempo de PostgreSQL (`2026-08-17 14:38:18.355104+00`) no son ISO
8601 válido para todos los navegadores, así que los adaptadores las normalizan
con `toIso()` de [src/utils/apiDate.js](../src/utils/apiDate.js).

Los hooks de `hooks/` envuelven cada llamada con su estado de carga, error y
cancelación (`AbortController`), y nunca llaman a `fetch` directamente.

### «Crear evento» es una ruta que se pinta como panel

`/eventos/nuevo` no sustituye a la vista actual: se abre como panel lateral encima de
ella. Crear un evento es una tarea, y sacar al usuario del catálogo para hacerla le
obliga a volver después.

Aun así **sigue siendo una ruta de verdad**, con URL compartible y botón «atrás» que
cierra el panel. El patrón es el de rutas modales de React Router:

1. [`CrearEventoLink`](../src/components/CrearEventoLink.jsx) navega a `/eventos/nuevo`
   guardando la ubicación de partida en `state.background`.
2. [`App`](../src/App.jsx) detecta la ruta con `matchPath`, pasa ese `background` como
   `location` a `<Routes>` —para que la vista de fondo se siga pintando— y monta
   `EventoNuevoPage` aparte. Si alguien escribe la URL a mano no hay fondo previo, y se
   usa el catálogo.
3. [`SidePanel`](../src/components/SidePanel.jsx) es un `<dialog>` nativo abierto con
   `showModal()`. Se eligió el elemento nativo y no un `div` con `position: fixed` para
   no reimplementar el atrapado de foco, el cierre con Escape, la inertización del fondo
   y la capa superior: el navegador ya hace las cuatro cosas.

Por eso `EventoNuevoPage` es la única página que **no** aparece en `<Routes>`.

### Los filtros del catálogo viven en la URL

El buscador está en la navbar y el listado en el catálogo: son dos componentes que no
comparten padre. En vez de subir el estado hasta `App`, el texto de búsqueda, la
categoría y el rango de fechas viajan en la query string
(`?q=…&categoria=…&desde=…&hasta=…`), con las claves declaradas en `CATALOGO_PARAMS` de
[src/constants/routes.js](../src/constants/routes.js). La navbar la escribe y el catálogo
la lee con `useSearchParams`.

De paso el filtro queda compartible por enlace y el botón «atrás» lo deshace. Como el
campo se gobierna desde la URL, tampoco hay una copia local que sincronizar cuando el
catálogo limpia los filtros.

`desde` y `hasta` se guardan como fecha suelta (`YYYY-MM-DD`, lo que produce un
`<input type="date">`) y [`eventsService`](../src/services/eventsService.js) las convierte
en instantes ISO —principio y **fin** del día— antes de mandarlas como `fecha_desde` y
`fecha_hasta`. Las dos conversiones viven en [`@utils/apiDate`](../src/utils/apiDate.js):
enviar la fecha suelta dejaría fuera los eventos de esa misma tarde y el servidor la
interpretaría en su propia zona horaria, no en la de quien filtra.

## Configuración de entorno

`src/config/api.js` lee `import.meta.env.VITE_API_URL`, con fallback a `http://localhost/api`.
Copia [.env.example](../.env.example) a `.env` y ajusta la URL de la API PHP.

```bash
cp .env.example .env
```

## Scripts

| Script | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build para revisarlo |
| `npm run lint` | ESLint sobre `**/*.{js,jsx}` |

`vite.config.js` habilita `allowedHosts: ['.ngrok-free.dev']` para poder exponer el dev
server por un túnel de ngrok durante las demos.
