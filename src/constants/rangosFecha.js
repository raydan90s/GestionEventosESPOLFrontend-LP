/**
 * Rangos de fecha del catalogo. Los atajos viajan en la URL por su clave
 * (`fecha=semana`) y no como dos fechas, para que el enlace no caduque.
 */

/** Fecha suelta `YYYY-MM-DD` en la zona del usuario, como la da un `<input type="date">`. */
const aFecha = (fecha) => {
  const dosDigitos = (n) => String(n).padStart(2, '0')

  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`
}

/** Copia de `fecha` desplazada `dias` dias; no muta la original. */
const sumarDias = (fecha, dias) => {
  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + dias)

  return resultado
}

/**
 * Atajos de rango, en el orden en que se listan. `rango(hoy)` recibe la fecha
 * como argumento para que el calculo sea puro.
 *
 * @type {readonly { clave: string, etiqueta: string,
 *                   rango: (hoy: Date) => { desde: string, hasta: string } }[]}
 */
export const RANGOS_FECHA = Object.freeze([
  {
    clave: 'hoy',
    etiqueta: 'Hoy',
    rango: (hoy) => ({ desde: aFecha(hoy), hasta: aFecha(hoy) }),
  },
  {
    clave: 'semana',
    etiqueta: 'Próximos 7 días',
    rango: (hoy) => ({ desde: aFecha(hoy), hasta: aFecha(sumarDias(hoy, 6)) }),
  },
  {
    clave: 'mes',
    etiqueta: 'Este mes',
    rango: (hoy) => ({
      desde: aFecha(hoy),
      // Dia 0 del mes siguiente es el ultimo del actual, sin tabla de dias.
      hasta: aFecha(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)),
    }),
  },
  {
    clave: 'trimestre',
    etiqueta: 'Próximos 3 meses',
    rango: (hoy) => ({
      desde: aFecha(hoy),
      hasta: aFecha(new Date(hoy.getFullYear(), hoy.getMonth() + 3, hoy.getDate())),
    }),
  },
])

/** Clave del rango escrito a mano, la unica que usa `desde`/`hasta` de la URL. */
export const RANGO_PERSONALIZADO = 'personalizado'

/**
 * Resuelve el filtro de fechas de la URL en el par que espera la API.
 * Una clave desconocida no filtra nada en vez de romper la vista.
 *
 * @param {string | null} clave Valor del parametro `fecha`.
 * @param {{ desde?: string, hasta?: string }} [aMedida] Rango escrito a mano.
 * @param {Date} [hoy] Dia de referencia; se inyecta para poder probarlo.
 * @returns {{ desde: string, hasta: string }}
 */
export function resolverRango(clave, aMedida = {}, hoy = new Date()) {
  if (clave === RANGO_PERSONALIZADO || clave === null) {
    return { desde: aMedida.desde ?? '', hasta: aMedida.hasta ?? '' }
  }

  const atajo = RANGOS_FECHA.find((rango) => rango.clave === clave)

  return atajo ? atajo.rango(hoy) : { desde: '', hasta: '' }
}

const FECHA_CORTA = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short' })

/** "12 sep" a partir de una fecha suelta `YYYY-MM-DD`, leida en hora local. */
const fechaCorta = (valor) => {
  const fecha = new Date(`${valor}T00:00:00`)

  return Number.isNaN(fecha.getTime()) ? '' : FECHA_CORTA.format(fecha)
}

/**
 * Texto del boton de fechas: el nombre del atajo o el rango en corto
 * ("12 sep - 30 sep"). Vacio si no hay filtro.
 *
 * @param {string | null} clave
 * @param {{ desde?: string, hasta?: string }} [aMedida]
 * @returns {string}
 */
export function etiquetaDeRango(clave, aMedida = {}) {
  const atajo = RANGOS_FECHA.find((rango) => rango.clave === clave)
  if (atajo) return atajo.etiqueta

  const desde = aMedida.desde ? fechaCorta(aMedida.desde) : ''
  const hasta = aMedida.hasta ? fechaCorta(aMedida.hasta) : ''

  if (desde && hasta) return `${desde} – ${hasta}`
  if (desde) return `Desde ${desde}`
  if (hasta) return `Hasta ${hasta}`

  return ''
}
