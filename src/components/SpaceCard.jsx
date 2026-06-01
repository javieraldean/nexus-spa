import { Link, useNavigate } from "react-router-dom";

export default function SpaceCard({ space }) {
  const navigate = useNavigate();

  return (
    <article className="book-card">
      <div className="book-card__content">
        <h3 className="book-card__title">{space.name}</h3>

        <p className="book-card__author">
          Capacidad: {space.capacity} personas · {space.location}
        </p>

        {space.occupied && (
          <p style={{ fontSize: "0.88rem", color: "#5b667a", margin: 0 }}>
            <strong>Ocupado por:</strong>{" "}
            {space.occupiedBy || "Usuario registrado"}
            <br />
            <strong>Se libera:</strong>{" "}
            {space.availableAt || space.endTime || "Horario no disponible"}
          </p>
        )}

        <div className="book-card__footer">
          <span
            className={`space-status-badge ${
              space.occupied
                ? "space-status-badge--occupied"
                : "space-status-badge--available"
            }`}
          >
            {space.occupied ? "Ocupado" : "Disponible"}
          </span>

          <div className="book-card__actions">
            <button
              className="btn btn-primary btn-sm"
              disabled={space.occupied}
              onClick={() => navigate(`/coworking/spaces/${space.id}`)}
            >
              Reservar
            </button>
            <Link
              className="btn btn-secondary btn-sm"
              to={`/coworking/spaces/${space.id}`}
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
