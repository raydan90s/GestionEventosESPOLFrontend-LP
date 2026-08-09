import { colorDeCategoria } from '@constants/categories'
import { cn } from '@utils/cn'

/**
 * Chip de categoría: texto en el color `cat-*` puro sobre un fondo del mismo
 * color al 12 % (ver PALETA.md §3).
 *
 * Sin borde y con esquinas de 4 px, como el resto de indicadores del sistema:
 * es una etiqueta, no un botón, y no debe leerse como algo pulsable.
 *
 * Recibe el nombre de la categoría tal como lo devuelve la API y resuelve el
 * color con él. No hay ninguna lista de categorías en el frontend.
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
