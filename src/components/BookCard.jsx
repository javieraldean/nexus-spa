import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

const PLACEHOLDER = "/assets/img/books/book-placeholder.jpg";
function getBookImage(id) {
  return `/assets/img/books/book-${id}.jpg`;
}

export default function BookCard({ item }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleComprar() {
    addItem({
      id: Number(item.id),
      title: item.title,
      author: item.author,
      price: item.price,
      image: getBookImage(item.id),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="book-card">
      <Link className="book-card__image-link" to={`/library/items/${item.id}`}>
        <img
          className="book-card__image"
          src={getBookImage(item.id)}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </Link>

      <div className="book-card__content">
        <span className="book-card__category">
          {item.type === "book" ? "Libro" : "Revista"}
        </span>

        <h3 className="book-card__title">{item.title}</h3>

        <p className="book-card__author">{item.author}</p>

        <div className="book-card__footer">
          <p className="book-card__price">{formatPrice(item.price)}</p>

          <div className="book-card__actions">
            <button
              className={`btn btn-sm ${added ? "btn-secondary" : "btn-primary"}`}
              onClick={handleComprar}
            >
              {added ? "✓ Añadido" : "Agregar a carrito"}
            </button>
            <Link
              className="btn btn-secondary btn-sm"
              to={`/library/items/${item.id}`}
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
