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
 * Presión sobre el aforo: holgado hasta 60 %, ajustado 60–90 %, crítico por
 * encima de 90 %.
 *
 * Sirve para **destacar el texto** de cupos restantes, no para teñir la barra:
 * la barra es azul institucional salvo que el evento esté lleno (ver
 * `AFORO_BAR_CLASS` y PALETA.md §2).
 *
 * @param {number} porcentaje 0–100.
 * @returns {'success' | 'warning' | 'danger'}
 */
export function aforoNivel(porcentaje) {
  const ratio = porcentaje / 100
  if (ratio > AFORO_DANGER_RATIO) return 'danger'
  if (ratio >= AFORO_WARNING_RATIO) return 'warning'
  return 'success'
}

/**
 * Clases del relleno de la barra.
 *
 * El sistema de diseño pide pista neutra y relleno en azul institucional; el
 * ámbar queda fuera porque es el color de inscribirse. El rojo se reserva al
 * único estado que corta el flujo: no queda ni un cupo.
 */
export const AFORO_BAR_CLASS = Object.freeze({
  libre: 'bg-primary',
  lleno: 'bg-danger',
})

/**
 * Cupos que quedan libres.
 * @param {number} inscritos
 * @param {number} cupoMaximo
 * @returns {number}
 */
export const cuposDisponibles = (inscritos, cupoMaximo) =>
  Math.max(0, (cupoMaximo ?? 0) - (inscritos ?? 0))
