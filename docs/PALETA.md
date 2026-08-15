# Paleta y sistema de diseño

La app implementa el **EventosESPOL Digital System**: institucional y editorial, con
superficies casi blancas de tinte azul, profundidad por borde de 1 px en vez de sombra,
esquinas de 4 px y titulares en serif.

Todos los colores salen de [src/style/tokens.css](../src/style/tokens.css).
**Nunca se hardcodea un hex en un componente**: se usan las clases semánticas de Tailwind
(`bg-card`, `text-fg-muted`, `bg-primary`, `border-edge`, …), que están mapeadas a los
tokens en [tailwind.config.js](../tailwind.config.js).

El tema oscuro se activa poniendo `data-theme="dark"` en `<html>`, que es el selector
configurado en Tailwind (`darkMode: ['selector', '[data-theme="dark"]']`). Como todas las
clases apuntan a variables CSS, **el modo oscuro funciona sin escribir un solo `dark:`**:
basta con que el token cambie de valor.

---

## Tabla de colores

### Superficies

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | `bg-canvas` | `#f8f9ff` | `#0e1520` | Fondo de la página |
| `--panel` | `bg-card` | `#ffffff` | `#16202e` | Tarjetas, navbar, formularios |
| `--panel-hover` | `bg-card-hover` | `#f4f7ff` | `#1c2838` | Hover de superficies |
| `--panel-muted` | `bg-card-muted` | `#eef4ff` | `#1f2b3c` | Bloques secundarios (comentarios, vacíos) |
| `--panel-sunken` | `bg-card-sunken` | `#e5eeff` | `#131c28` | Pista de la barra de aforo |
| `--border` | `border-edge` | `#dbe3f0` | `#2a3849` | Bordes y separadores |
| `--border-strong` | `border-edge-strong` | `#c2c6d2` | `#3d4d61` | Borde al pasar el cursor por un campo |
| `--footer` | `bg-footer` | `#dfe9fa` | `#131c28` | Banda institucional de cierre |

### Texto

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--text` | `text-fg` | `#121c28` | `#eaf1ff` | Texto principal |
| `--text-muted` | `text-fg-muted` | `#424751` | `#aebbcc` | Texto secundario, metadatos |
| `--text-subtle` | `text-fg-subtle` | `#727782` | `#7c8899` | Texto deshabilitado, pistas |

### Marca — azul institucional ESPOL

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--primary` | `bg-primary` / `text-primary` | `#2563ab` | `#a6c8ff` | Botón primario, links, foco, barra de aforo |
| `--primary-hover` | `bg-primary-hover` | `#1a4d8f` | `#cfe0ff` | Hover |
| `--primary-active` | `bg-primary-active` | `#143c72` | `#7fadf0` | Estado presionado |
| `--primary-soft` | `bg-primary-soft` | `#d5e3ff` | `#17304f` | Fondo del botón fantasma al hover |
| `--on-primary` | `text-primary-foreground` | `#ffffff` | `#00325c` | Texto sobre `primary` |
| `--secondary` | `bg-secondary` / `text-secondary` | `#004b8d` | `#cfe0ff` | Logotipo, «Crear evento», filtro activo |
| `--secondary-hover` | `bg-secondary-hover` | `#00396d` | `#eaf1ff` | Hover |
| `--on-secondary` | `text-secondary-foreground` | `#ffffff` | `#00325c` | Texto sobre `secondary` |

> **Dos azules, dos papeles.** `secondary` es el azul profundo de la identidad: marca la
> estructura (logotipo, botón de la navbar, filtro seleccionado). `primary` es el azul de
> trabajo: enlaces, botones de formulario y barra de ocupación.

### Acento — ámbar

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--accent` | `bg-accent` | `#e07b1e` | `#f2a33d` | **Solo** el CTA de inscripción |
| `--accent-hover` | `bg-accent-hover` / `text-accent-hover` | `#b85f12` | `#fbc97a` | Hover; y texto sobre `accent-soft` |
| `--accent-soft` | `bg-accent-soft` | `#fdf0dc` | `#3a2a12` | Reservado para avisos de cupos |
| `--on-accent` | `text-accent-foreground` | `#ffffff` | `#301400` | Texto sobre `accent` |

### Estados

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--success` / `--success-soft` | `text-success` / `bg-success-soft` | `#16a34a` / `#e7f6ec` | `#45c46f` / `#12301d` | Inscripción confirmada |
| `--warning` / `--warning-soft` | `text-warning` / `bg-warning-soft` | `#d97706` / `#fdf0dc` | `#eba13c` / `#33260f` | Reservado |
| `--danger` / `--danger-soft` | `text-danger` / `bg-danger-soft` | `#ba1a1a` / `#ffdad6` | `#ffb4ab` / `#3a1a1a` | Errores, evento lleno o cancelado |
| `--info` / `--info-soft` | `text-info` / `bg-info-soft` | `#2563ab` / `#d5e3ff` | `#a6c8ff` / `#17304f` | Reservado |

> `warning` e `info` están declarados pero hoy no los usa ningún componente: el ámbar de
> aviso chocaría con el CTA de inscripción y el azul informativo con `primary`. Se dejan
> en la paleta para no reabrir la discusión de contraste cuando hagan falta.

### Categorías de evento

| Token | Clase Tailwind | Claro | Oscuro |
| :--- | :--- | :--- | :--- |
| `--cat-taller` | `text-cat-taller` | `#0e7f73` | `#2ec4b2` |
| `--cat-club` | `text-cat-club` | `#6d3fb0` | `#b79cf0` |
| `--cat-seminario` | `text-cat-seminario` | `#2563ab` | `#a6c8ff` |
| `--cat-deporte` | `text-cat-deporte` | `#3f7f22` | `#8fd45f` |
| `--cat-cultura` | `text-cat-cultura` | `#b03571` | `#f087b8` |
| `--cat-emprendimiento` | `text-cat-emprendimiento` | `#934b00` | `#ffb782` |
| `--cat-otra` | `text-cat-otra` | `#545a66` | `#a3b0c4` |

> **Las categorías las define la base de datos, no el frontend.** Se leen de
> `/api/categorias`; lo único que vive aquí es el color, porque la tabla
> `categorias` no guarda ninguno. El emparejamiento lo hace `colorDeCategoria()`
> en [src/constants/categories.js](../src/constants/categories.js), **por palabra
> clave y no por id**, para que siga funcionando si alguien renombra «Deportes» a
> «Deportes y recreación» o si los ids cambian al recargar el seed.
>
> `--cat-otra` es el color de reserva: una categoría nueva que la paleta no
> reconozca se pinta con él en vez de romper la vista. Si ese color empieza a
> aparecer, es la señal de que hay que añadir el token de la categoría nueva.
>
> Los tonos claros son más oscuros que en la versión anterior de la paleta porque
> el chip los usa como **texto** sobre un fondo al 12 %: a plena saturación varios
> no llegaban al 4.5:1 que pide WCAG AA.

---

## Tipografía

El sistema empareja una serif clásica para la voz editorial con una grotesca moderna
para la interfaz. Las dos se importan en `main.jsx` desde `@fontsource-variable`, sin
CDNs externos.

| Token | Clase Tailwind | Valor | Uso |
| :--- | :--- | :--- | :--- |
| `--font-serif` | `font-serif` | `'Source Serif 4 Variable', 'Source Serif 4', Georgia, serif` | Títulos de página, de evento y de sección |
| `--font-sans` | `font-sans` | `'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif` | Todo lo demás: cuerpo, metadatos, botones, campos |
| `--font-mono` | `font-mono` | `'JetBrains Mono', ui-monospace, monospace` | Matrículas y numeración de tabla |

> Los paquetes registran las familias como **`… Variable`**, no con el nombre a secas.
> Por eso el token las lista primero; el nombre sin sufijo queda como respaldo si el
> usuario las tiene instaladas en el sistema.

`h1`, `h2` y `h3` reciben la serif desde `@layer base` en
[src/style/index.css](../src/style/index.css), así que **ninguna página necesita acordarse
de poner `font-serif`**: sólo se escribe explícitamente cuando el titular no es un `h1`–`h3`.

### Escala

Declarada en `theme.extend.fontSize`, con los tamaños del sistema de diseño:

| Clase | Tamaño / interlínea | Uso |
| :--- | :--- | :--- |
| `text-display` | 48 / 56 px, `-0.02em` | Título de catálogo y de evento en escritorio |
| `text-headline` | 32 / 40 px | El mismo título en móvil; títulos de vistas secundarias |
| `text-title` | 24 / 32 px | Título de tarjeta y de sección |
| `text-body-lg` | 18 / 28 px | Entradilla y descripción del evento |
| `text-label` | 14 / 20 px, `+0.05em` | Rótulos en versalitas (`legend`, «Error 404») |

---

## Forma, espacio y profundidad

| Token | Clase Tailwind | Valor | Uso |
| :--- | :--- | :--- | :--- |
| `--radius-card` | `rounded-card` | `4px` | Tarjetas, botones, campos |
| `--radius-chip` | `rounded-chip` | `4px` | Etiquetas de categoría y de estado |
| `--radius-pill` | `rounded-pill` | `999px` | Filtros y barras de progreso |
| `--shadow-hover` | `shadow-hover` | Sombra ambiental suave | **Sólo** al pasar el cursor por una tarjeta |
| `--shadow-pop` | `shadow-pop` | Sombra elevada | Elementos que flotan sobre el contenido |
| — | `max-w-container` | `1280px` | Ancho de la rejilla fija |

`--radius-card` y `--radius-chip` valen lo mismo hoy: están separados porque una
etiqueta y una tarjeta no tienen por qué evolucionar juntas.

**No hay sombra de reposo.** La profundidad la da un borde de 1 px en `border-edge`; por
eso no existe ningún token `--shadow-card`. Si una superficie necesita destacarse, se
sube de capa tonal (`bg-card-muted`, `bg-card-sunken`), no se le añade sombra.

Ritmo de 8 px: márgenes de 16 px en móvil y 40 px en escritorio (`px-4 md:px-10` en
`App.jsx`), y relleno interno de 24 px (`p-6`) en las tarjetas.

---

## Clases de componente

Viven en `@layer components` de [src/style/index.css](../src/style/index.css). Existen
para que las ocho pantallas no repitan la misma ristra de utilidades y para que un cambio
de forma se haga en un solo sitio.

| Clase | Qué es |
| :--- | :--- |
| `.surface` | Tarjeta: `rounded-card`, borde de 1 px y fondo `card` |
| `.btn` | Base de botón: tamaño, forma, alineación y estado `:disabled` |
| `.btn-primary` | Azul de trabajo. Publicar, comentar, reintentar |
| `.btn-accent` | **Sólo** inscribirse (ver §1) |
| `.btn-ghost` | Secundario junto a un CTA: borde azul, fondo transparente |
| `.btn-neutral` | Utilidades del organizador: descargar CSV, alternar tema, cancelar |
| `.field` | Campo de formulario: etiqueta aparte, borde de 1 px, 4 px de radio |
| `.field-invalid` | Borde rojo; se añade a `.field` cuando hay error |
| `.field-label` | Etiqueta encima del campo |
| `.filter-chip` / `.filter-chip-active` | Filtro del catálogo: gris en reposo, azul institucional puesto (ver §3) |
| `.chip-cat` | Etiqueta de categoría, coloreada con `--chip-color` (ver §3) |
| `.link` | Enlace de texto en azul |
| `.side-panel` | Marco del panel lateral: `<dialog>` a pantalla completa por la derecha, 36 rem de ancho máximo |

Los botones se componen: `className="btn btn-accent w-full"`. Las utilidades de Tailwind
ganan siempre a estas clases, porque `@layer utilities` va después de `@layer components`.

---

## Reglas de uso

### 1. El azul manda, el ámbar interrumpe

El **azul** es el color institucional: navbar, links, botón primario, filtros, barra de
ocupación y anillo de foco. El **ámbar** se reserva a la acción de **inscribirse**.

Si el CTA ámbar compite con links azules en la misma zona se pierde la jerarquía: en una
tarjeta de evento debe haber **un solo elemento ámbar**. El resto —«Ver detalle», el
título, los filtros— va en azul o en gris. Por eso «Publicar evento» y «Publicar
comentario» son azules aunque también sean acciones de envío: no son inscripciones.

### 2. Barra de aforo

El sistema de diseño pide **pista neutra y relleno en azul institucional**. El ámbar queda
fuera porque es el color de inscribirse, y el rojo se reserva al único estado que corta el
flujo:

| Estado | Barra | Texto |
| :--- | :--- | :--- |
| Quedan cupos | `bg-primary` | `text-fg-muted` |
| Quedan cupos y la ocupación pasa del 60 % | `bg-primary` | `text-primary` (destacado) |
| Sin cupos | `bg-danger` | `text-danger` |

Los umbrales (`AFORO_WARNING_RATIO`, `AFORO_DANGER_RATIO`) viven en
`@constants/eventStatus` y `aforoNivel()` en [src/utils/aforo.js](../src/utils/aforo.js).
Ojo: `aforoNivel()` decide **el énfasis del texto**, no el color de la barra — la barra
sólo distingue lleno de no lleno, con `AFORO_BAR_CLASS`.

La cifra que manda es `cuposDisponibles` del servidor, porque la calcula la misma
transacción que descuenta el cupo. Sólo si no llega se deduce restando inscritos del aforo.

### 3. Chip de categoría

Color `cat-*` **puro** en el texto y el **mismo color al ~12 % de opacidad** como fondo.
Sin borde y con 4 px de radio: es una etiqueta, no un botón, y no debe leerse como algo
pulsable.

Tailwind v3 no sabe aplicar modificadores de opacidad (`bg-cat-taller/12`) sobre colores
declarados como `var(--x)` con valor hex: necesitaría los canales sueltos en formato
`<r> <g> <b>`, y con un `var()` opaco simplemente **no genera la clase**. Por eso el fondo
al 12 % se resuelve con `color-mix`, en la clase `.chip-cat`:

```css
.chip-cat {
  color: var(--chip-color);
  background-color: color-mix(in srgb, var(--chip-color) 12%, transparent);
}
```

El componente recibe el **nombre** de la categoría tal como lo devuelve la API y
resuelve el color con él:

```jsx
<span className="chip-cat …" style={{ '--chip-color': colorDeCategoria(nombre) }}>
```

Las clases `text-cat-*`, `border-cat-*` y `bg-cat-*` sí funcionan a opacidad completa.

**El chip de categoría y el distintivo de estado no son lo mismo**, aunque compartan forma,
tamaño y sitio —van uno al lado del otro en la cabecera de la tarjeta—. El chip *describe*
el evento y se lee en caja baja; el distintivo *interrumpe* («CANCELADO», «AGOTADO») y se
lee en versalitas sobre el color del estado. La caja es lo único que los separa de un
vistazo, así que no se mezclan.

**El color de categoría es de la tarjeta, no del filtro.** La barra del catálogo
(`.filter-chip`) va en un solo color —gris en reposo, azul institucional la opción puesta—
aunque cada categoría tenga el suyo. El motivo es que la barra enseña **todas** las
opciones a la vez: pintar cada una de un color convierte una fila de controles en un
arcoíris donde lo elegido deja de distinguirse, y el color pasa a decorar en vez de
informar. En una tarjeta el chip identifica **un** evento y ahí el color sí trabaja.

Lo resuelve [`StatusBadge`](../src/components/StatusBadge.jsx), que además decide **cuál**
de los dos avisos toca: el estado manda sobre el aforo, porque un evento cancelado no se
anuncia como agotado aunque no le queden cupos. Un evento activo con cupos no pinta nada.

### 4. Contraste del ámbar

`--accent` (`#e07b1e`) con texto blanco da **~3.0:1**, por debajo del 4.5:1 que WCAG AA pide
para texto normal. Es aceptable para texto grande o en negrita (AA large, 3:1), así que:

- Úsalo en **botones grandes o en bold**, nunca en texto pequeño. `.btn-accent` ya fuerza
  `font-semibold` por esto.
- Para texto sobre `accent-soft`, usa `--accent-hover` (`#b85f12`), que sí alcanza el contraste.

### 5. Comentarios

Los comentarios se pintan sobre `card-muted` **sin bordes de color**, para que no compitan
visualmente con las tarjetas de evento. Nada de `cat-*` ni de acento dentro del hilo de
comentarios.

### 6. Formularios

Etiqueta **encima** del campo y pista **siempre visible** debajo: nada de placeholders que
se van al escribir y dejan al usuario sin saber qué se le pedía. Los campos obligatorios
llevan un asterisco rojo (`aria-hidden`, porque el `required` del input ya lo dice);
los opcionales, la palabra «(opcional)» en gris.

### 7. Economía de color: la base manda

**Por defecto, una pantalla se pinta con los colores base: superficies, grises de texto y
azul.** El ámbar (§1), el rojo (§2) y los `cat-*` (§3) son excepciones que hay que
justificar una por una, no una paleta a repartir.

La regla práctica, para no tener que decidirlo de nuevo cada vez:

| El color… | Va coloreado | Ejemplo |
| :--- | :--- | :--- |
| identifica **un** elemento entre otros | sí | `.chip-cat` en la tarjeta del evento |
| marca un estado que **corta el flujo** | sí | cancelado, agotado, error |
| es **la** acción de inscribirse | sí, ámbar | `.btn-accent` |
| es un **control**: filtro, pestaña, botón de utilidad, opción de una lista | no | `.filter-chip`, `.btn-neutral` |

El caso que más se repite y más se equivoca es el cuarto. Un grupo de controles enseña
**todas** sus opciones a la vez: si cada una lleva su propio color, la fila se convierte en
un arcoíris, lo elegido deja de distinguirse y el color pasa a decorar en vez de informar.
En un grupo de controles sólo destaca **el que está puesto**, y siempre en el mismo azul
institucional. Por eso la barra de filtros del catálogo va en gris y azul aunque cada
categoría tenga color propio.

Al añadir un color a una pantalla, la pregunta no es «¿queda bien?» sino **«¿qué dato
distingue este color que el texto no distinga ya?»**. Si no hay respuesta, va en gris.

---

## Añadir un color nuevo

1. Declara el token en `:root` **y** en `[data-theme="dark"]` en `src/style/tokens.css`.
2. Mapea el token a un nombre semántico en `theme.extend.colors` de `tailwind.config.js`.
3. Usa la clase resultante. Nunca el hex.

Si el color necesita opacidad parcial, recuerda la limitación del punto 3: resuélvela con
`color-mix` en una clase de `@layer components`, no con el modificador `/`.
