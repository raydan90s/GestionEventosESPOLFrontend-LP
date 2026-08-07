import { AFORO_DANGER_RATIO, AFORO_WARNING_RATIO } from '@constants/eventStatus'

/**
 * Porcentaje de ocupación de un evento, acotado a 0–100.
 * @param {number} inscritos
 * @param {number} cupoMaximo
 * @returns {number}
 */
export function aforoPorcentaje(inscritos, cupoMaximo) {
  if (!cupoMaximo || cupoMaximo <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((inscritos / cupoMaximo) * 100)))
}

/**
 * Color de la barra de aforo: verde hasta 60 %, ámbar 60–90 %, rojo por encima de 90 %.
 * @param {number} porcentaje 0–100.
 * @returns {'success' | 'warning' | 'danger'}
 */
export function aforoNivel(porcentaje) {
  const ratio = porcentaje / 100
  if (ratio > AFORO_DANGER_RATIO) return 'danger'
  if (ratio >= AFORO_WARNING_RATIO) return 'warning'
  return 'success'
}

/** Clases Tailwind del relleno de la barra, por nivel. */
export const AFORO_BAR_CLASS = Object.freeze({
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
})

/**
 * Cupos que quedan libres.
 * @param {number} inscritos
 * @param {number} cupoMaximo
 * @returns {number}
 */
export const cuposDisponibles = (inscritos, cupoMaximo) =>
  Math.max(0, (cupoMaximo ?? 0) - (inscritos ?? 0))
