import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/nexusApi";
import { useState } from "react";
import { formatPrice } from "../utils/format";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  async function handleCheckout() {
    if (!items.length) return;
    setCheckoutLoading(true);
    setCheckoutError("");

    // Guardar resumen antes de limpiar el carrito
    const summary = {
      items: items.map((i) => ({ ...i })),
      total: totalPrice,
      totalItems,
    };

    try {
      for (const item of items) {
        await apiRequest("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id || 1,
            items: [{ itemId: item.id, quantity: item.quantity }],
            total: item.price * item.quantity,
          }),
        });
      }
      clearCart();
      setOrderSummary(summary);
      setCheckoutDone(true);
    } catch {
      setCheckoutError("No se pudo procesar el pedido. Inténtalo de nuevo.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  /* ── Pantalla de confirmación ── */
  if (checkoutDone && orderSummary) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p className="eyebrow">PROCESO DE COMPRA</p>
        <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>
          ¡Pedido realizado!
        </h1>
        <p className="cart-subtitle">
          Tu compra se ha procesado correctamente. Gracias por tu pedido.
        </p>

        <div className="cart-layout">
          {/* Detalle de artículos comprados */}
          <div className="cart-items">
            {orderSummary.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  className="cart-item__image"
                  src={item.image}
                  alt={item.title}
                />
                <div className="cart-item__info">
                  <h3 className="cart-item__title">{item.title}</h3>
                  {item.author && (
                    <p className="cart-item__author">{item.author}</p>
                  )}
                  <p className="cart-item__price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item__controls">
                  <span style={{ fontSize: "0.9rem", color: "#5b667a" }}>
                    × {item.quantity}
                  </span>
                  <strong style={{ fontSize: "0.95rem" }}>
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido completado */}
          <aside className="cart-summary">
            <div className="cart-order-success">
              <span className="cart-order-success__icon">✓</span>
              <p className="cart-order-success__msg">Pedido confirmado</p>
            </div>

            <hr style={{ margin: "1rem 0" }} />

            <div className="cart-summary__line">
              <span>Artículos</span>
              <strong>{orderSummary.totalItems}</strong>
            </div>
            <div className="cart-summary__total">
              <span>Total pagado</span>
              <strong>{formatPrice(orderSummary.total)}</strong>
            </div>

            <Link to="/historial" className="btn btn-primary">
              Ver mi historial
            </Link>
            <Link to="/library" className="btn btn-secondary">
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    );
  }

  /* ── Vista normal del carrito ── */
  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <p className="eyebrow">PROCESO DE COMPRA</p>
      <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>
        Tu carrito de compras
      </h1>
      <p className="cart-subtitle">
        Revisa los libros añadidos antes de finalizar.
      </p>

      <div className="cart-layout">
        {/* ── Columna izquierda: ítems o estado vacío ── */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <h2>Tu carrito está vacío</h2>
              <p>Explora la librería y añade algunos libros.</p>
              <Link to="/library" className="btn btn-primary">
                Ir a la librería
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  className="cart-item__image"
                  src={item.image}
                  alt={item.title}
                />
                <div className="cart-item__info">
                  <h3 className="cart-item__title">{item.title}</h3>
                  {item.author && (
                    <p className="cart-item__author">{item.author}</p>
                  )}
                  <p className="cart-item__price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Columna derecha: resumen ── */}
        <aside className="cart-summary">
          <h2>Resumen</h2>

          <div className="cart-summary__line">
            <span>Productos</span>
            <strong>{totalItems}</strong>
          </div>

          <hr />

          <div className="cart-summary__total">
            <span>Total</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          {checkoutError && (
            <p className="error" style={{ marginTop: "0.75rem" }}>
              {checkoutError}
            </p>
          )}

          {isAuthenticated ? (
            <button
              className="btn btn-primary"
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
            >
              {checkoutLoading ? "Procesando..." : "Finalizar compra"}
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Inicia sesión para pagar
            </Link>
          )}

          <button
            className="btn btn-secondary"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Vaciar carrito
          </button>

          <Link to="/library" className="cart-summary__follow-link">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
