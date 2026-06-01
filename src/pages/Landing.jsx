import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import BookCard from "../components/BookCard";

export default function Landing() {
  const { data, loading, error } = useApi("/library/books/best-sellers");

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-kicker">
                Librería Universitaria · NEXUS
              </span>
              <h1>Tu espacio de conocimiento</h1>
              <p>
                Descubre miles de libros y revistas universitarias, reserva
                espacios de coworking y mucho más en un solo lugar.
              </p>
              <div className="hero-actions">
                <Link to="/library" className="btn btn-primary">
                  Comprar libros
                </Link>
                <Link to="/coworking" className="btn btn-primary">
                  Reservar coworking
                </Link>
              </div>
            </div>

            <div className="hero-media">
              <img src="/assets/img/hero/hero-books.jpg" alt="Librería NEXUS" />
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="featured">
        <div className="container">
          <div className="section-heading">
            <h2>Top más vendidos</h2>
            <p>Los títulos más populares de las últimas semanas</p>
          </div>

          {loading && <p className="loading">Cargando bestsellers...</p>}
          {error && <p className="error">No se pudo cargar la información.</p>}

          <div className="books-list">
            {data?.items?.slice(0, 6).map((book) => (
              <BookCard key={book.id} item={book} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
