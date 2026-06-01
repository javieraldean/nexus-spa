import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { formatPrice } from "../utils/format";

const PLACEHOLDER = "/assets/img/books/book-placeholder.jpg";
function getBookImage(id) {
  return `/assets/img/books/book-${id}.jpg`;
}

export default function ItemDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { data, loading, error } = useApi(`/library/items/${id}`);

  const [cartMessage, setCartMessage] = useState("");

  function handleAddToCart() {
    addItem({
      id: Number(id),
      title: data?.title,
      author: data?.author,
      price: data?.price,
      image: getBookImage(id),
    });
    setCartMessage("Añadido al carrito ✓");
    setTimeout(() => setCartMessage(""), 2500);
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p className="loading">Cargando detalle...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <div className="section">
          <h1>Ítem no encontrado</h1>
          <p>No fue posible cargar el detalle solicitado.</p>
          <Link className="btn btn-primary" to="/library">
            Volver a la librería
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <Link className="back-link" to="/library">
        ← Volver a la librería
      </Link>

      <div className="detail-layout">
        <div className="detail-media">
          <img
            src={getBookImage(id)}
            alt={data?.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </div>

        <div className="detail-info">
          <span className="detail-category">
            {data?.type === "book" ? "Libro" : "Revista"} · {data?.category}
          </span>

          <h1 className="detail-title">{data?.title}</h1>

          <div className="detail-meta">
            {data?.author && (
              <p>
                <strong>Autor:</strong> {data.author}
              </p>
            )}
            {data?.year && (
              <p>
                <strong>Año:</strong> {data.year}
              </p>
            )}
            {data?.publisher && (
              <p>
                <strong>Editorial:</strong> {data.publisher}
              </p>
            )}
            {data?.pages && (
              <p>
                <strong>Páginas:</strong> {data.pages}
              </p>
            )}
            {data?.language && (
              <p>
                <strong>Idioma:</strong> {data.language}
              </p>
            )}
            {data?.rating && (
              <p>
                <strong>Rating:</strong> {data.rating} ⭐
              </p>
            )}
          </div>

          <p className="detail-price">{formatPrice(data?.price)}</p>

          <p className="detail-description">{data?.description}</p>

          <div className="detail-actions">
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>

          {cartMessage && <p className="success">{cartMessage}</p>}
        </div>
      </div>
    </div>
  );
}
