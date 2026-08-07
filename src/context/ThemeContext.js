import { createContext } from 'react'

/**
 * @typedef {Object} ThemeContextValue
 * @property {'light' | 'dark'} theme
 * @property {() => void} toggleTheme
 * @property {(theme: 'light' | 'dark') => void} setTheme
 */

/** @type {import('react').Context<ThemeContextValue | null>} */
export const ThemeContext = createContext(null)

export const THEME_STORAGE_KEY = 'espol-eventos-theme'
