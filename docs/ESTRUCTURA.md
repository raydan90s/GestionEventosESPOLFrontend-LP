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
| `constants/` | Valores fijos congelados con `Object.freeze` | Valores que dependan del entorno (van en `config/`) |
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
import { CATEGORIES } from '@constants/categories'
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
