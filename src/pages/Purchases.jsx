import { useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";

const PAGE_SIZE = 5;

function statusBadge(status) {
  if (!status) return "badge--neutral";
  const s = status.toLowerCase();
  if (["completed", "completado", "entregado"].includes(s))
    return "badge--success";
  if (["pending", "pendiente"].includes(s)) return "badge--warning";
  if (["processing", "en proceso", "en camino"].includes(s))
    return "badge--info";
  if (["cancelled", "cancelado"].includes(s)) return "badge--danger";
  return "badge--neutral";
}

export default function Purchases() {
  const { user } = useAuth();
  const userId = user?.id || 1;
  const { data, loading, error } = useApi(`/users/${userId}/purchases`);
  const [page, setPage] = useState(1);

  const sortedPurchases = useMemo(() => {
    if (!data?.items) return [];
    return [...data.items].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(sortedPurchases.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedPurchases.slice(start, start + PAGE_SIZE);
  }, [sortedPurchases, page]);
  const emptyRows = PAGE_SIZE - pageItems.length;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1 className="page-title">Mis compras</h1>

      {loading && <p className="loading">Cargando compras...</p>}
      {error && <p className="error">No se pudieron cargar las compras.</p>}

      {/* Info bar */}
      <div className="table-toolbar">
        <span className="table-toolbar__count">
          {sortedPurchases.length}{" "}
          {sortedPurchases.length === 1 ? "compra" : "compras"} registradas
        </span>
        <span className="table-toolbar__page">
          Página {page} de {totalPages}
        </span>
      </div>

      <table className="table table--fixed">
        <thead>
          <tr>
            <th style={{ width: "60px" }}>#</th>
            <th>Título</th>
            <th style={{ width: "90px" }}>Precio</th>
            <th style={{ width: "115px" }}>Fecha</th>
            <th style={{ width: "130px" }}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {pageItems.map((purchase, index) => (
            <tr key={purchase.title + purchase.date}>
              <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
              <td className="table__title-cell">{purchase.title}</td>
              <td>
                <strong>{formatPrice(purchase.price)}</strong>
              </td>
              <td>{purchase.date}</td>
              <td>
                <span
                  className={`status-badge ${statusBadge(purchase.status)}`}
                >
                  {purchase.status}
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
