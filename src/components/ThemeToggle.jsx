import { MoonIcon, SunIcon } from '@components/icons'
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
      className="btn btn-neutral px-2.5 text-base"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
