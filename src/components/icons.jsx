/**
 * Iconos de la interfaz, en SVG inline.
 *
 * No hay librería de iconos: son ocho trazos y una dependencia menos que
 * cargar. Todos heredan el color con `currentColor` y el tamaño con `em`, así
 * que se tiñen y se escalan con las clases del texto que los acompaña.
 *
 * Son decorativos: la etiqueta siempre está en el texto de al lado, por eso
 * van con `aria-hidden`.
 */

/** @param {{ className?: string }} props */
function Svg({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? 'h-[1em] w-[1em] shrink-0'}
    >
      {children}
    </svg>
  )
}

export const CalendarIcon = (props) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
)

export const PinIcon = (props) => (
  <Svg {...props}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const UsersIcon = (props) => (
  <Svg {...props}>
    <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
    <circle cx="9" cy="7.5" r="3.5" />
    <path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16.5 4.13a4 4 0 0 1 0 6.74" />
  </Svg>
)

export const DownloadIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
  </Svg>
)

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
)

export const ArrowLeftIcon = (props) => (
  <Svg {...props}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </Svg>
)

export const SunIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
)

export const MoonIcon = (props) => (
  <Svg {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Svg>
)
