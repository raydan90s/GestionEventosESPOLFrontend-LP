import { AFORO_DANGER_RATIO, AFORO_WARNING_RATIO } from '@constants/eventStatus'

/**
 * Porcentaje de ocupacion de un evento, acotado a 0-100.
 * @param {number} inscritos
 * @param {number} cupoMaximo
 * @returns {number}
 */
export function aforoPorcentaje(inscritos, cupoMaximo) {
  if (!cupoMaximo || cupoMaximo <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((inscritos / cupoMaximo) * 100)))
}

/**
 * Presion sobre el aforo: holgado hasta 60 %, ajustado 60-90 %, critico encima.
 * Solo tine el texto de cupos restantes, no la barra (ver `AFORO_BAR_CLASS`).
 *
 * @param {number} porcentaje 0-100.
 * @returns {'success' | 'warning' | 'danger'}
 */
export function aforoNivel(porcentaje) {
  const ratio = porcentaje / 100
  if (ratio > AFORO_DANGER_RATIO) return 'danger'
  if (ratio >= AFORO_WARNING_RATIO) return 'warning'
  return 'success'
}

/**
 * Clases del relleno de la barra: azul institucional, y rojo solo cuando no
 * queda ningun cupo. El ambar esta reservado al boton de inscribirse.
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
