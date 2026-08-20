import { Link } from 'react-router-dom'
import { CrearEventoLink } from '@components/CrearEventoLink'
import { ROUTES } from '@constants/routes'

/**
 * Redes institucionales de la ESPOL. Son enlaces a sitios de terceros:
 * conviene confirmarlos con Comunicacion Institucional antes de publicar.
 */
const REDES = Object.freeze([
  { nombre: 'Facebook', url: 'https://www.facebook.com/ESPOL' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/espol' },
  { nombre: 'X', url: 'https://x.com/ESPOL' },
])

/**
 * Banda institucional de cierre: tres columnas y el aviso de derechos.
 * Solo se listan los destinos que ya tienen pagina.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-edge bg-footer">
      <div className="mx-auto max-w-container px-4 py-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <section aria-labelledby="footer-sobre">
            <h2 id="footer-sobre" className="font-serif text-title font-semibold text-secondary">
              Sobre EventosESPOL
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
              La plataforma oficial para el descubrimiento y la gestión de eventos académicos,
              culturales y deportivos de la Escuela Superior Politécnica del Litoral.
            </p>
          </section>

          <nav aria-labelledby="footer-enlaces">
            <h2 id="footer-enlaces" className="font-serif text-title font-semibold text-secondary">
              Enlaces rápidos
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to={ROUTES.CATALOGO} className="link">
                  Explorar eventos
                </Link>
              </li>
              <li>
                <CrearEventoLink className="link">Crear evento</CrearEventoLink>
              </li>
            </ul>
          </nav>

          <section aria-labelledby="footer-contacto">
            <h2 id="footer-contacto" className="font-serif text-title font-semibold text-secondary">
              Contacto
            </h2>

            {/* `not-italic`: el navegador pone `<address>` en cursiva por defecto. */}
            <address className="mt-4 text-sm not-italic leading-relaxed text-fg-muted">
              Campus Gustavo Galindo Velasco
              <br />
              Guayaquil, Ecuador
            </address>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {REDES.map(({ nombre, url }) => (
                <li key={nombre}>
                  <a href={url} target="_blank" rel="noreferrer" className="link">
                    {nombre}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-edge pt-6 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://www.espol.edu.ec"
            target="_blank"
            rel="noreferrer"
            className="link text-xs"
          >
            Sitio oficial de la ESPOL
          </a>

          <p>
            © {new Date().getFullYear()} Escuela Superior Politécnica del Litoral. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
