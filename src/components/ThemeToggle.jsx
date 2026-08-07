import { useTheme } from '@hooks/useTheme'

/** Alterna claro/oscuro. Persiste en localStorage vía ThemeProvider. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
      className="rounded-pill border border-edge bg-card px-3 py-1.5 text-sm text-fg transition-colors hover:bg-card-hover"
    >
      {isDark ? '☀' : '☾'}
    </button>
  )
}
