# Paleta y sistema de color

Todos los colores de la aplicación salen de [src/style/tokens.css](../src/style/tokens.css).
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
| `--bg` | `bg-canvas` | `#f7f8fa` | `#0b1220` | Fondo de la página |
| `--panel` | `bg-card` | `#ffffff` | `#131c2e` | Tarjetas, navbar, modales |
| `--panel-hover` | `bg-card-hover` | `#f2f4f8` | `#1a2438` | Hover de superficies |
| `--panel-muted` | `bg-card-muted` | `#edeff3` | `#1f2a40` | Bloques secundarios (comentarios) |
| `--border` | `border-edge` | `#dde1e8` | `#26324a` | Bordes y separadores |

### Texto

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--text` | `text-fg` | `#0d1117` | `#e8edf5` | Texto principal |
| `--text-muted` | `text-fg-muted` | `#6b7280` | `#a3b0c4` | Texto secundario, metadatos |
| `--text-subtle` | `text-fg-subtle` | `#9ca3af` | `#6f7d94` | Texto deshabilitado, pistas |

### Marca — azul institucional ESPOL

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--primary` | `bg-primary` / `text-primary` | `#2563ab` | `#4a8ed6` | Botón primario, links, foco |
| `--primary-hover` | `bg-primary-hover` | `#1a4d8f` | `#6ba5e3` | Hover |
| `--primary-active` | `bg-primary-active` | `#143c72` | `#2563ab` | Estado presionado |
| `--primary-soft` | `bg-primary-soft` | `#d8e6f6` | `#17304f` | Fondo de chip/filtro activo |
| `--on-primary` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Texto sobre `primary` |
| `--secondary` | `bg-secondary` | `#0c2340` | `#e8edf5` | Superficies de énfasis, footer |
| `--secondary-hover` | `bg-secondary-hover` | `#102e57` | `#ffffff` | Hover |
| `--on-secondary` | `text-secondary-foreground` | `#ffffff` | `#0c2340` | Texto sobre `secondary` |

### Acento — ámbar

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--accent` | `bg-accent` | `#e07b1e` | `#f2a33d` | **Solo** el CTA de inscripción |
| `--accent-hover` | `bg-accent-hover` / `text-accent-hover` | `#b85f12` | `#fbc97a` | Hover; y texto sobre `accent-soft` |
| `--accent-soft` | `bg-accent-soft` | `#fdf0dc` | `#3a2a12` | Aviso de cupos por agotarse |
| `--on-accent` | `text-accent-foreground` | `#ffffff` | `#1a1206` | Texto sobre `accent` |

### Estados

| Token | Clase Tailwind | Claro | Oscuro | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--success` / `--success-soft` | `text-success` / `bg-success-soft` | `#16a34a` / `#e7f6ec` | `#45c46f` / `#12301d` | Inscripción confirmada, aforo holgado |
| `--warning` / `--warning-soft` | `text-warning` / `bg-warning-soft` | `#d97706` / `#fdf0dc` | `#eba13c` / `#33260f` | Aforo 60–90 % |
| `--danger` / `--danger-soft` | `text-danger` / `bg-danger-soft` | `#dc2626` / `#fce9e9` | `#f16b6b` / `#3a1a1a` | Errores, evento lleno o cancelado |
| `--info` / `--info-soft` | `text-info` / `bg-info-soft` | `#2563ab` / `#d8e6f6` | `#4a8ed6` / `#17304f` | Mensajes informativos |

### Categorías de evento

| Token | Clase Tailwind | Claro | Oscuro |
| :--- | :--- | :--- | :--- |
| `--cat-taller` | `text-cat-taller` | `#0e9f8f` | `#2ec4b2` |
| `--cat-club` | `text-cat-club` | `#7c4dbc` | `#a17ce0` |
| `--cat-seminario` | `text-cat-seminario` | `#2563ab` | `#4a8ed6` |
| `--cat-deporte` | `text-cat-deporte` | `#4d9a2a` | `#79c34f` |
| `--cat-cultura` | `text-cat-cultura` | `#c2417f` | `#e06aa4` |

### Forma, sombra y tipografía

| Token | Clase Tailwind | Valor |
| :--- | :--- | :--- |
| `--radius-card` | `rounded-card` | `14px` |
| `--radius-pill` | `rounded-pill` | `999px` |
| `--shadow-card` | `shadow-card` | Sombra suave de tarjeta |
| `--shadow-pop` | `shadow-pop` | Sombra elevada (modales, dropdowns) |
| `--font-sans` | `font-sans` | `'Inter Variable', 'Inter', system-ui, sans-serif` |
| `--font-mono` | `font-mono` | `'JetBrains Mono', ui-monospace, monospace` |

> `@fontsource-variable/inter` registra la familia como **`Inter Variable`**, no como `Inter`.
> Por eso el token la lista primero; `'Inter'` queda como respaldo si el usuario la tiene
> instalada en el sistema. La fuente se importa en `main.jsx`, sin CDNs externos.

---

## Reglas de uso

### 1. El azul manda, el ámbar interrumpe

El **azul** es el color institucional: navbar, links, botón primario y anillo de foco.
El **ámbar** se reserva para la acción de **inscribirse** y para avisar de cupos por agotarse.

Si el CTA ámbar compite con links azules en la misma zona se pierde la jerarquía: en una
tarjeta de evento debe haber **un solo elemento ámbar**. El resto —«Ver detalle», el título,
los filtros— va en azul o en gris.

### 2. Barra de aforo

El color se calcula sobre el porcentaje de ocupación:

| Ocupación | Color | Clase |
| :--- | :--- | :--- |
| menos de 60 % | verde | `bg-success` |
| 60 – 90 % | ámbar | `bg-warning` |
| más de 90 % | rojo | `bg-danger` |

Implementado en [src/utils/aforo.js](../src/utils/aforo.js) (`aforoNivel`) y consumido por
[src/components/AforoBar.jsx](../src/components/AforoBar.jsx). Los umbrales viven en
`@constants/eventStatus` (`AFORO_WARNING_RATIO`, `AFORO_DANGER_RATIO`).

### 3. Chip de categoría

Color `cat-*` **puro** en texto y borde, y el **mismo color al ~12 % de opacidad** como fondo.

Tailwind v3 no sabe aplicar modificadores de opacidad (`bg-cat-taller/12`) sobre colores
declarados como `var(--x)` con valor hex: necesitaría los canales sueltos en formato
`<r> <g> <b>`, y con un `var()` opaco simplemente **no genera la clase**. Por eso el fondo
al 12 % se resuelve con `color-mix`, en la clase `.chip-cat` de
[src/style/index.css](../src/style/index.css):

```css
.chip-cat {
  color: var(--chip-color);
  border-color: var(--chip-color);
  background-color: color-mix(in srgb, var(--chip-color) 12%, transparent);
}
```

El componente sólo inyecta el color de la categoría:

```jsx
<span className="chip-cat …" style={{ '--chip-color': category.color }}>
```

Las clases `text-cat-*`, `border-cat-*` y `bg-cat-*` sí funcionan a opacidad completa.

### 4. Contraste del ámbar

`--accent` (`#e07b1e`) con texto blanco da **~3.0:1**, por debajo del 4.5:1 que WCAG AA pide
para texto normal. Es aceptable para texto grande o en negrita (AA large, 3:1), así que:

- Úsalo en **botones grandes o en bold**, nunca en texto pequeño.
- Para texto sobre `accent-soft`, usa `--accent-hover` (`#b85f12`), que sí alcanza el contraste.

### 5. Comentarios

Los comentarios se pintan sobre `card-muted` **sin bordes de color**, para que no compitan
visualmente con las tarjetas de evento. Nada de `cat-*` ni de acento dentro del hilo de
comentarios.

---

## Añadir un color nuevo

1. Declara el token en `:root` **y** en `[data-theme="dark"]` en `src/style/tokens.css`.
2. Mapea el token a un nombre semántico en `theme.extend.colors` de `tailwind.config.js`.
3. Usa la clase resultante. Nunca el hex.

Si el color necesita opacidad parcial, recuerda la limitación del punto 3: resuélvela con
`color-mix` en una clase de `@layer components`, no con el modificador `/`.
