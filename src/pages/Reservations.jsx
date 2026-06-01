import { useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 5;

function statusBadge(status) {
  if (!status) return "badge--neutral";
  const s = status.toLowerCase();
  if (["confirmed", "confirmado", "active", "activo"].includes(s))
    return "badge--success";
  if (["pending", "pendiente"].includes(s)) return "badge--warning";
  if (["cancelled", "cancelado"].includes(s)) return "badge--danger";
  return "badge--neutral";
}

export default function Reservations() {
  const { user } = useAuth();
  const userId = user?.id || 1;
  const { data, loading, error } = useApi(`/users/${userId}/reservations`);
  const [page, setPage] = useState(1);

  const sortedReservations = useMemo(() => {
    if (!data?.items) return [];
    return [...data.items].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedReservations.length / PAGE_SIZE),
  );
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedReservations.slice(start, start + PAGE_SIZE);
  }, [sortedReservations, page]);
  const emptyRows = PAGE_SIZE - pageItems.length;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1 className="page-title">Mis reservas</h1>

      {loading && <p className="loading">Cargando reservas...</p>}
      {error && <p className="error">No se pudieron cargar las reservas.</p>}

      {/* Info bar */}
      <div className="table-toolbar">
        <span className="table-toolbar__count">
          {sortedReservations.length}{" "}
          {sortedReservations.length === 1 ? "reserva" : "reservas"} registradas
        </span>
        <span className="table-toolbar__page">
          Página {page} de {totalPages}
        </span>
      </div>

      <table className="table table--fixed">
        <thead>
          <tr>
            <th style={{ width: "90px" }}>Reserva</th>
            <th>Espacio</th>
            <th style={{ width: "115px" }}>Fecha</th>
            <th style={{ width: "150px" }}>Horario</th>
            <th style={{ width: "130px" }}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {pageItems.map((reservation) => (
            <tr key={reservation.reservationId}>
              <td>
                <strong>#{reservation.reservationId}</strong>
              </td>
              <td className="table__title-cell">{reservation.spaceName}</td>
              <td>{reservation.date}</td>
              <td>
                {reservation.startTime} – {reservation.endTime}
              </td>
              <td>
                <span
                  className={`status-badge ${statusBadge(reservation.status)}`}
                >
                  {reservation.status}
                </span>
              </td>
            </tr>
          ))}

          {Array.from({ length: emptyRows }).map((_, i) => (
            <tr key={`empty-${i}`} className="table__empty-row">
              <td>&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Anterior
        </button>
        <span className="pagination__info">
          {page} / {totalPages}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
