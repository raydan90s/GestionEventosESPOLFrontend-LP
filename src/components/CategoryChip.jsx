import { getCategory } from '@constants/categories'
import { cn } from '@utils/cn'

/**
 * Chip de categoría: texto y borde en el color `cat-*` puro, fondo el mismo color al 12 %.
 * @param {{ categoryId: string, className?: string }} props
 */
export function CategoryChip({ categoryId, className }) {
  const category = getCategory(categoryId)
  if (!category) return null

  return (
    <span
      className={cn(
        'chip-cat inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
      style={{ '--chip-color': category.color }}
    >
      {category.label}
    </span>
  )
}
