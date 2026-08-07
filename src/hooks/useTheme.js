import { useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'

/**
 * Acceso al tema actual.
 * @returns {import('@context/ThemeContext').ThemeContextValue}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  }
  return context
}
