import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {/* Columna 1 — marca */}
          <div className="footer-column">
            <span className="footer-logo">Nexus</span>
            <p>
              Librería universitaria, coworking y cafetería en Aranjuez, junto
              al campus universitario.
            </p>
          </div>

          {/* Columna 2 — Explorar */}
          <div className="footer-column">
            <h3>Explorar</h3>
            <ul className="footer-links">
              <li>
                <Link to="/library">Librería</Link>
              </li>
              <li>
                <Link to="/coworking">Coworking</Link>
              </li>
              <li>
                <Link to="/cart">Carrito</Link>
              </li>
              <li>
                <Link to="/historial">Historial</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 — Contacto */}
          <div className="footer-column">
            <h3>Contacto</h3>
            <p>Calle Mayor 12</p>
            <p>Aranjuez, Madrid</p>
            <p>
              <a
                className="footer-contact-link"
                href="mailto:hola@nexus-libreria.es"
              >
                hola@nexus-libreria.es
              </a>
            </p>
            <p>
              <a className="footer-contact-link" href="tel:+34912345678">
                +34 91 234 56 78
              </a>
            </p>
          </div>

          {/* Columna 4 — Síguenos */}
          <div className="footer-column">
            <h3>Síguenos</h3>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <img
                  className="social-icon"
                  src="/assets/img/icons/instagram.svg"
                  alt="Instagram"
                />
              </a>
              <a href="#" aria-label="X / Twitter">
                <img
                  className="social-icon"
                  src="/assets/img/icons/x.svg"
                  alt="X"
                />
              </a>
              <a href="#" aria-label="Facebook">
                <img
                  className="social-icon"
                  src="/assets/img/icons/facebook.svg"
                  alt="Facebook"
                />
              </a>
              <a href="#" aria-label="WhatsApp">
                <img
                  className="social-icon"
                  src="/assets/img/icons/whatsapp.svg"
                  alt="WhatsApp"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nexus</span>
          <span className="footer-bottom__sep">·</span>
          <a href="#">Aviso legal</a>
          <span className="footer-bottom__sep">·</span>
          <a href="#">Privacidad</a>
          <span className="footer-bottom__sep">·</span>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
