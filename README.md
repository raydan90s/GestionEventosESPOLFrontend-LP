# Gestión de Eventos ESPOL — Frontend

Plataforma web para publicar e inscribirse a eventos de la ESPOL: catálogo de tarjetas
filtrable por categoría y fecha, control de aforo en tiempo real, listado de asistentes
y comentarios por evento.

**Stack:** React + Vite + JavaScript (ESModules) · Tailwind CSS v3 · react-router-dom.
El backend es una API RESTful en PHP + PostgreSQL y vive en
[`GestionEventosESPOLBackend-LP`](../GestionEventosESPOLBackend-LP).

## Puesta en marcha

```bash
npm install
cp .env.example .env    # ajusta VITE_API_URL a tu API PHP
npm run dev             # http://localhost:5173
```

## Scripts

| Script | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build para revisarlo |
| `npm run lint` | ESLint sobre `**/*.{js,jsx}` |

## Documentación

- [docs/ESTRUCTURA.md](docs/ESTRUCTURA.md) — convención de carpetas y alias de imports.
- [docs/PALETA.md](docs/PALETA.md) — tokens de color, tema oscuro y reglas de uso.
- [docs/INSCRIPCIONES.md](docs/INSCRIPCIONES.md) — inscripciones y listado de asistentes:
  contrato con la API, control de aforo y manejo de errores.

## En corto

- Los imports usan alias (`@components/EventCard`, `@services/eventsService`), nunca `../../`.
- Los colores salen siempre de `src/style/tokens.css` vía clases semánticas de Tailwind
  (`bg-card`, `text-fg-muted`, `bg-primary`). Nada de hex en los componentes.
- El tema oscuro se activa con `data-theme="dark"` en `<html>` y se persiste en localStorage.
