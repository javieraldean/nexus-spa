import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { apiRequest } from "../api/nexusApi";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function getSpaceImage(type) {
  if (type === "focus" || type === "silence" || type === "study") {
    return "/assets/img/coworking/focus.jpg";
  }
  return "/assets/img/coworking/desk.jpg";
}

export default function SpaceDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data, loading, error } = useApi(`/coworking/spaces/${id}`);

  const [message, setMessage] = useState("");
  const [reservationError, setReservationError] = useState("");
  const [date, setDate] = useState("2026-04-22");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");

  async function handleReservation() {
    try {
      setMessage("");
      setReservationError("");

      const response = await apiRequest("/coworking/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 1,
          spaceId: Number(id),
          date,
          startTime,
          endTime,
        }),
      });

      setMessage("Reserva realizada correctamente.");
    } catch {
      setReservationError("No se pudo realizar la reserva.");
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p className="loading">Cargando espacio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <h1 className="page-title">Espacio no encontrado</h1>
        <p style={{ marginBottom: "1.5rem" }}>
          No fue posible cargar el espacio solicitado.
        </p>
        <Link className="btn btn-primary" to="/coworking">
          Volver a coworking
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <Link className="back-link" to="/coworking">
        ← Volver a coworking
      </Link>

      <div className="space-detail">
        {/* Panel izquierdo — imagen e info */}
        <div className="space-detail__info">
          <img
            className="space-detail__image"
            src={getSpaceImage(data?.type)}
            alt={data?.name}
          />

          <span className="detail-category">
            {data?.type} · {data?.location}
          </span>

          <h1 className="detail-title">{data?.name}</h1>

          <div className="detail-meta">
            <p>
              <strong>Capacidad:</strong> {data?.capacity} personas
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                style={{
                  color: data?.occupied ? "#c97b63" : "#2f855a",
                  fontWeight: 600,
                }}
              >
                {data?.occupied ? "Ocupado" : "Libre"}
              </span>
            </p>
            {data?.resources?.length > 0 && (
              <p>
                <strong>Recursos:</strong> {data.resources.join(", ")}
              </p>
            )}
          </div>

          <p className="detail-description">{data?.description}</p>
        </div>

        {/* Panel derecho — formulario de reserva (solo si está libre) */}
        {!data?.occupied && (
          <div className="space-detail__form">
            <h2
              style={{
                marginBottom: "1.25rem",
                fontSize: "1.15rem",
                color: "var(--color-primary)",
              }}
            >
              Reservar espacio
            </h2>

            {isAuthenticated ? (
              <>
                <div className="filter-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Hora inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Hora fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "0.75rem" }}
                  onClick={handleReservation}
                >
                  Confirmar reserva
                </button>

                {message && (
                  <p className="success" style={{ marginTop: "1rem" }}>
                    {message}
                  </p>
                )}
                {reservationError && (
                  <p className="error" style={{ marginTop: "1rem" }}>
                    {reservationError}
                  </p>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ marginBottom: "1rem", color: "var(--color-text)" }}>
                  Inicia sesión para poder reservar este espacio.
                </p>
                <Link to="/login" className="btn btn-primary">
                  Iniciar sesión
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
