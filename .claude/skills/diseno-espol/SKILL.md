---
name: diseno-espol
description: Reglas del EventosESPOL Digital System — paleta, tipografía, clases de componente y convenciones de código del frontend. Úsala SIEMPRE antes de crear o modificar cualquier componente, página o estilo de este repo: al escribir JSX, al elegir un color o una clase de Tailwind, al añadir un formulario, una tarjeta, un botón, un chip o un estado de carga/vacío/error, y al tocar tokens.css, index.css o tailwind.config.js.
---

# EventosESPOL Digital System

Sistema **institucional y editorial**: superficies casi blancas con tinte azul,
profundidad por **borde de 1 px en vez de sombra**, esquinas de 4 px y titulares en serif.

Fuentes de verdad, en este orden:

| Para | Lee |
| :--- | :--- |
| Colores, tipografía, forma, reglas de uso | [docs/PALETA.md](../../../docs/PALETA.md) |
| Carpetas, alias, capa de servicios, rutas | [docs/ESTRUCTURA.md](../../../docs/ESTRUCTURA.md) |
| Valores literales de los tokens | [src/style/tokens.css](../../../src/style/tokens.css) |
| Clases de componente (`.btn`, `.field`, …) | [src/style/index.css](../../../src/style/index.css) |

Esta skill es el resumen operativo. Cuando una decisión no esté aquí, ve a PALETA.md
**antes** de inventar.

---

## Las 9 reglas que no se rompen

1. **Cero hex en componentes.** Todo color sale de una clase semántica de Tailwind
   (`bg-card`, `text-fg-muted`, `border-edge`, `bg-primary`) mapeada a un token. Si
   escribes `#` en un `.jsx`, está mal.

2. **El ámbar es sólo para inscribirse.** `.btn-accent` y `bg-accent` se reservan al CTA
   de inscripción. «Publicar evento» y «Publicar comentario» son **azules** (`.btn-primary`)
   aunque también envíen. En una tarjeta de evento debe haber **un solo elemento ámbar**.

3. **Dos azules, dos papeles.** `secondary` (`#004b8d`) = estructura e identidad: logotipo,
   botón de la navbar, filtro activo. `primary` (`#2563ab`) = trabajo: enlaces, botones de
   formulario, barra de aforo, anillo de foco.

4. **Nada de `dark:`.** El tema oscuro se resuelve solo porque las clases apuntan a
   variables CSS que cambian bajo `[data-theme="dark"]`. Si escribes un `dark:`, es que
   estás saltándote un token.

5. **Sin sombra en reposo.** La profundidad es `border-edge` de 1 px. Para destacar una
   superficie se sube de capa tonal (`bg-card-muted`, `bg-card-sunken`), no se añade sombra.
   `shadow-hover` sólo al pasar el cursor por una tarjeta; `shadow-pop` sólo para lo que
   flota sobre el contenido.

6. **Formularios: etiqueta encima y pista visible.** Nada de placeholders que hagan de
   etiqueta. Obligatorio → asterisco rojo con `aria-hidden`. Opcional → «(opcional)» en gris.
   Reutiliza [`FormField`](../../../src/components/FormField.jsx) salvo que el campo no sea
   un `<input>`.

7. **Los datos vienen de la API, sin excepciones.** No hay listas de ejemplo en las vistas.
   Categorías, eventos, comentarios y asistentes se piden a la API; el filtrado y la búsqueda
   se resuelven en SQL, no en el cliente.

8. **Nunca rutas relativas en imports.** Siempre alias: `@components`, `@hooks`, `@services`,
   `@utils`, `@constants`, `@config`, `@pages`, `@style`, `@context`, `@assets`, `@`.
   Al añadir un alias nuevo va **antes** de la entrada `@` en `vite.config.js`, y también
   en `jsconfig.json`.

9. **Pocos colores: la base manda.** Una pantalla se pinta con superficies, grises de texto
   y azul. El ámbar, el rojo y los `cat-*` son **excepciones que hay que justificar una por
   una**, no una paleta a repartir (PALETA.md §7). En concreto:
   - Un **control** —filtro, pestaña, botón de utilidad, opción de una lista— nunca lleva
     color propio: en un grupo sólo destaca el que está puesto, y siempre en el mismo azul
     institucional. Los filtros del catálogo van en gris y azul aunque cada categoría tenga
     su color.
   - El color de categoría (`cat-*`) es para identificar **un** evento en su tarjeta, no
     para pintar una lista de opciones.
   - Antes de colorear algo, responde: **¿qué dato distingue este color que el texto no
     distinga ya?** Sin respuesta, va en gris.

---

## Clases de componente disponibles

Antes de escribir una ristra de utilidades, comprueba si ya existe la clase:

| Clase | Para |
| :--- | :--- |
| `.surface` | Tarjeta: 4 px de radio, borde 1 px, fondo `card` |
| `.btn` + `.btn-primary` | Acción principal azul (publicar, comentar, reintentar) |
| `.btn` + `.btn-accent` | **Sólo** inscribirse. Ya fuerza `font-semibold` por contraste |
| `.btn` + `.btn-ghost` | Secundario junto a un CTA |
| `.btn` + `.btn-neutral` | Utilidades del organizador: CSV, tema, cancelar |
| `.field` / `.field-invalid` / `.field-label` | Formularios |
| `.filter-chip` / `.filter-chip-active` | Filtros del catálogo: gris en reposo, azul el puesto. Un solo color, sin `cat-*` |
| `.chip-cat` | Etiqueta de categoría, coloreada vía `--chip-color` |
| `.link` | Enlace de texto azul |
| `.side-panel` | Marco del `<dialog>` lateral |
| `.brand-mark` | Logotipo |

Se componen: `className="btn btn-accent w-full"`. Las utilidades de Tailwind ganan siempre.

## Escala tipográfica

`text-display` (48/56) · `text-headline` (32/40) · `text-title` (24/32) ·
`text-body-lg` (18/28) · `text-label` (14/20, versalitas).

`h1`–`h3` ya reciben la serif desde `@layer base`: **no pongas `font-serif`** salvo que el
titular no sea un `h1`–`h3`. Ritmo de 8 px; `p-6` dentro de tarjetas; `max-w-container` = 1280 px.

---

## Patrones obligatorios de la app

### Chip de categoría
Color `cat-*` puro en el texto y el mismo color al 12 % de fondo, resuelto con `color-mix`
en `.chip-cat` (Tailwind v3 no sabe aplicar `/12` sobre un `var()` hex). El color se
resuelve **por nombre**, no por id:

```jsx
<span className="chip-cat …" style={{ '--chip-color': colorDeCategoria(nombre) }}>
```

Si aparece el gris `--cat-otra`, es la señal de que falta añadir el token de una categoría nueva.

El chip **describe** (caja baja) y el `StatusBadge` **interrumpe** (versalitas). No se mezclan.

Sólo en la **tarjeta del evento**: en la barra de filtros la misma categoría va en gris,
porque ahí es un control y no una identificación (regla 9).

### Barra de aforo
Pista neutra y relleno azul. Rojo sólo cuando está lleno; nunca ámbar. `aforoNivel()` decide
el **énfasis del texto**, no el color de la barra. Manda `cuposDisponibles` del servidor.

### Comentarios
Sobre `card-muted`, sin bordes de color. **Nada de `cat-*` ni de ámbar** dentro del hilo:
no debe competir con la inscripción.

### Toda vista de datos tiene tres estados
Carga (esqueleto con la silueta real del contenido, `aria-busy`), vacío (con texto distinto
según haya filtro activo o no) y error (mensaje en `bg-danger-soft` **con botón de reintentar**).
Mira `CatalogoPage` como referencia; los tres están resueltos ahí.

---

## Convenciones de código

- Componentes `PascalCase.jsx` con **named export**; páginas `PascalCasePage.jsx` con
  **default export**; el resto `camelCase.js`.
- `components/` = UI reutilizable sin lógica de datos. `pages/` = una vista por ruta.
  `hooks/` = estado reutilizable, **nunca `fetch` directo**. `services/` = el `fetch`,
  un módulo por recurso. `utils/` = funciones puras, sin React ni red.
- **La API responde en `snake_case` y el frontend trabaja en `camelCase`.** Toda la
  traducción vive en `services/`: ningún componente ve una clave de la base. Cada service
  exporta su adaptador (`toEvent`, `toAttendee`, …) y su `erroresDeCampo()` para los 422.
- Las marcas de tiempo de PostgreSQL se normalizan con `toIso()` de `@utils/apiDate`.
- Cada hook envuelve su llamada con carga, error y cancelación (`AbortController`).
- Tipos con JSDoc en `src/types/`, no con TypeScript.
- `constants/` va congelado con `Object.freeze`.
- Comentarios en **español**, explicando el *porqué* de la decisión, no el qué hace la línea.
  Es el estilo de todo el repo; mantenlo.

## Accesibilidad — mínimos ya establecidos

- `aria-live="polite"` en los recuentos, y la región **siempre en el DOM** aunque esté vacía
  (un `aria-live` que aparece a la vez que su texto no se anuncia).
- `role="alert"` en los mensajes de error.
- `aria-invalid` + `aria-describedby` en los campos con error.
- `aria-pressed` en los filtros, `aria-expanded`/`aria-controls` en lo desplegable.
- Iconos decorativos ocultos; etiquetas reales vía `<dt className="sr-only">` o `aria-label`.
- El ámbar sobre blanco da 3.0:1 → sólo en botones grandes o en bold. Para texto sobre
  `accent-soft`, usa `accent-hover`.

## Añadir un color nuevo

1. Declara el token en `:root` **y** en `[data-theme="dark"]` de `tokens.css`.
2. Mápealo a un nombre semántico en `theme.extend.colors` de `tailwind.config.js`.
3. Usa la clase. Nunca el hex.
4. Si necesita opacidad parcial, resuélvela con `color-mix` en `@layer components`, no con `/`.

## Antes de dar por terminado

- [ ] `npm run lint` pasa limpio.
- [ ] Ningún hex ni ningún `dark:` en el JSX.
- [ ] Se ve bien en claro **y** en oscuro (el toggle está en la navbar).
- [ ] Los tres estados —carga, vacío, error— están resueltos.
- [ ] Si tocaste la paleta o una regla de diseño, **actualiza `docs/PALETA.md`**; si tocaste
      la estructura o la capa de servicios, `docs/ESTRUCTURA.md`. Los docs son la fuente de
      verdad: si se desincronizan, esta skill deja de servir.
