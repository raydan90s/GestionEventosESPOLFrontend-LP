import { colorDeCategoria } from '@constants/categories'
import { cn } from '@utils/cn'

/**
 * Chip de categoria: color `cat-*` sobre fondo del mismo color al 12 %
 * (PALETA.md §3).
 * Es una etiqueta, no un boton. El nombre llega tal como lo devuelve la API.
 *
 * @param {{ nombre: string, className?: string }} props
 */
export function CategoryChip({ nombre, className }) {
  if (!nombre) return null

  return (
    <span
      className={cn(
        'chip-cat inline-flex items-center rounded-chip px-2.5 py-1 text-xs font-semibold',
        className,
      )}
      style={{ '--chip-color': colorDeCategoria(nombre) }}
    >
      {nombre}
    </span>
  )
}
