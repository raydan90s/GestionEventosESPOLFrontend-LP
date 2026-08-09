import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Editorial en serif, interfaz en grotesca (ver docs/PALETA.md §Tipografía).
// Se importan aquí y no por CDN: la app tiene que arrancar sin red externa.
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/hanken-grotesk'
import '@/style/index.css'
import App from '@/App'
import { ThemeProvider } from '@context/ThemeProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
