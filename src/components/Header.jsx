import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { pathname } = useLocation();

  function toggleNav() {
    setIsNavOpen((prev) => !prev);
  }

  function closeNav() {
    setIsNavOpen(false);
  }

  // Librería activo en /library/** EXCEPTO /library/purchases
  const isLibraryActive =
    pathname.startsWith("/library") &&
    !pathname.startsWith("/library/purchases");

  // Coworking activo en /coworking/** EXCEPTO /coworking/reservations
  const isCoworkingActive =
    pathname.startsWith("/coworking") &&
    !pathname.startsWith("/coworking/reservations");

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeNav}>
            <img src="/assets/img/logo/logo-01.png" alt="NEXUS" />
          </Link>

          <nav className={`main-nav${isNavOpen ? " is-open" : ""}`}>
            <ul className="nav-list">
              <li>
                <NavLink to="/" end onClick={closeNav}>
                  <img
                    src="/assets/img/icons/homepage.svg"
                    className="nav-icon"
                    alt=""
                    width="18"
                    height="18"
                  />
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/library"
                  className={isLibraryActive ? "active" : ""}
                  onClick={closeNav}
                >
                  <img
                    src="/assets/img/icons/bookstack.svg"
                    className="nav-icon"
                    alt=""
                    width="18"
                    height="18"
                  />
                  Librería
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/coworking"
                  className={isCoworkingActive ? "active" : ""}
                  onClick={closeNav}
                >
                  <img
                    src="/assets/img/icons/coworking.svg"
                    className="nav-icon"
                    alt=""
                    width="18"
                    height="18"
                  />
                  Coworking
                </NavLink>
              </li>

              {/* Carrito — siempre visible, con badge de contador */}
              <li>
                <NavLink to="/cart" end onClick={closeNav}>
                  <img
                    src="/assets/img/icons/shopping-cart.svg"
                    className="nav-icon"
                    alt=""
                    width="18"
                    height="18"
                  />
                  Carrito
                  <span className="nav-cart-badge">{totalItems}</span>
                </NavLink>
              </li>

              {/* Historial — solo para usuarios autenticados */}
              {isAuthenticated && (
                <li>
                  <NavLink to="/historial" end onClick={closeNav}>
                    <img
                      src="/assets/img/icons/acum-calendar.svg"
                      className="nav-icon"
                      alt=""
                      width="18"
                      height="18"
                    />
                    Historial
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className="auth-area">
            {isAuthenticated ? (
              <>
                <span>{user?.name}</span>
                <button className="btn btn-secondary btn-sm" onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
                onClick={closeNav}
              >
                Iniciar sesión
              </Link>
            )}

            <button
              className="nav-toggle"
              onClick={toggleNav}
              aria-label={isNavOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isNavOpen}
            >
              <img
                src={
                  isNavOpen
                    ? "/assets/img/icons/x-mark.svg"
                    : "/assets/img/icons/bars-3.svg"
                }
                alt=""
                width="22"
                height="22"
                style={{ borderRadius: 0 }}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
