import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/nexusApi";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";

const S_TIPO = "nexus_historial_tipo";
const S_DESDE = "nexus_historial_desde";
const S_HASTA = "nexus_historial_hasta";
const S_DATA = "nexus_historial_data";
const S_PAGE = "nexus_historial_page";

function readSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const PAGE_SIZE = 5;

function pad(n) {
  return String(n).padStart(2, "0");
}

function isoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Formatea cualquier string de fecha a "yyyy-mm-dd hh:mm:ss" (hora local).
 * Si no hay componente horario devuelve "yyyy-mm-dd 00:00:00".
 */
function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${isoDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const today = isoDate(new Date());
const firstOfMonth = (() => {
  const d = new Date();
  d.setMonth(0);
  d.setDate(1);
  return isoDate(d);
})();

function purchaseBadge(status) {
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

function reservationBadge(status) {
  if (!status) return "badge--neutral";
  const s = status.toLowerCase();
  if (["confirmed", "confirmado", "active", "activo"].includes(s))
    return "badge--success";
  if (["pending", "pendiente"].includes(s)) return "badge--warning";
  if (["cancelled", "cancelado"].includes(s)) return "badge--danger";
  return "badge--neutral";
}

export default function Historial() {
  const { user } = useAuth();
  const userId = user?.id || 1;

  // Filtros — restaurados desde sessionStorage
  const [tipo, setTipo] = useState(() => readSession(S_TIPO, "compras"));
  const [desde, setDesde] = useState(() => readSession(S_DESDE, firstOfMonth));
  const [hasta, setHasta] = useState(() => readSession(S_HASTA, today));

  // Datos cargados manualmente — restaurados desde sessionStorage
  const [data, setData] = useState(() => readSession(S_DATA, null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paginación — restaurada desde sessionStorage
  const [page, setPage] = useState(() => readSession(S_PAGE, 1));

  // Persistir en sessionStorage cada vez que cambie un estado relevante
  useEffect(() => {
    sessionStorage.setItem(S_TIPO, JSON.stringify(tipo));
  }, [tipo]);
  useEffect(() => {
    sessionStorage.setItem(S_DESDE, JSON.stringify(desde));
  }, [desde]);
  useEffect(() => {
    sessionStorage.setItem(S_HASTA, JSON.stringify(hasta));
  }, [hasta]);
  useEffect(() => {
    sessionStorage.setItem(S_PAGE, JSON.stringify(page));
  }, [page]);
  useEffect(() => {
    if (data !== null) sessionStorage.setItem(S_DATA, JSON.stringify(data));
    else sessionStorage.removeItem(S_DATA);
  }, [data]);

  // ── Cambio de tipo: limpia resultados previos ──
  function handleTipo(val) {
    setTipo(val);
    setData(null);
    setError(null);
    setPage(1);
  }

  // ── Búsqueda manual ──
  async function handleSearch() {
    setLoading(true);
    setError(null);
    setPage(1);
    const path =
      tipo === "reservas"
        ? `/users/${userId}/reservations`
        : `/users/${userId}/purchases`;
    try {
      const result = await apiRequest(path);
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // ── Limpiar filtros (restaura valores por defecto, limpia resultados) ──
  function handleClear() {
    setDesde(firstOfMonth);
    setHasta(today);
    setData(null);
    setError(null);
    setPage(1);
  }

  // ── Filtrado local por rango de fechas ──
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items
      .filter((item) => {
        if (!item.date) return true;
        const d = String(item.date).substring(0, 10);
        if (desde && d < desde) return false;
        if (hasta && d > hasta) return false;
        return true;
      })
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [data, desde, hasta]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);
  const emptyRows = PAGE_SIZE - pageItems.length;

  const label = tipo === "reservas" ? "reserva" : "compra";

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1 className="page-title">Historial</h1>

      <div className="catalog-layout">
        {/* ── Sidebar de filtros ── */}
        <aside className="sidebar-filters">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Deseo revisar...</h3>
            <div className="filter-group">
              <select value={tipo} onChange={(e) => handleTipo(e.target.value)}>
                <option value="compras">Mis compras</option>
                <option value="reservas">Mis reservas</option>
              </select>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Rango de fechas</h3>
            <div className="filter-group">
              <label className="filter-label">Desde</label>
              <input
                type="text"
                value={desde}
                placeholder="yyyy-mm-dd"
                maxLength={10}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
            <div className="filter-group" style={{ marginTop: "0.5rem" }}>
              <label className="filter-label">Hasta</label>
              <input
                type="text"
                value={hasta}
                placeholder="yyyy-mm-dd"
                maxLength={10}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-section">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: "100%" }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar por filtros"}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={handleClear}
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* ── Contenido principal ── */}
        <div className="catalog-main">
          {/* Estado inicial: aún no se ha buscado */}
          {!data && !loading && !error && (
            <div className="historial-prompt">
              <p>
                Selecciona el tipo y el rango de fechas,
                <br />
                luego pulsa <strong>Buscar por filtros</strong>.
              </p>
            </div>
          )}

          {loading && <p className="loading">Buscando {label}s...</p>}
          {error && (
            <p className="error">
              No se pudo cargar el historial. Verifica los filtros e inténtalo
              de nuevo.
            </p>
          )}

          {data && !loading && (
            <>
              {/* Barra de info */}
              <div className="table-toolbar">
                <span className="table-toolbar__count">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? label : `${label}s`} encontrada
                  {filteredItems.length !== 1 ? "s" : ""}
                </span>
                <span className="table-toolbar__page">
                  Página {page} de {totalPages}
                </span>
              </div>

              {/* ── Tabla de compras ── */}
              {tipo === "compras" && (
                <table className="table table--fixed">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>#</th>
                      <th>Título</th>
                      <th style={{ width: "90px" }}>Precio</th>
                      <th style={{ width: "165px" }}>Fecha</th>
                      <th style={{ width: "130px" }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((item, idx) => (
                      <tr key={item.title + item.date + idx}>
                        <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="table__title-cell">{item.title}</td>
                        <td>
                          <strong>{formatPrice(item.price)}</strong>
                        </td>
                        <td
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            fontSize: "0.82rem",
                          }}
                        >
                          {formatDate(item.date)}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${purchaseBadge(item.status)}`}
                          >
                            {item.status}
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
              )}

              {/* ── Tabla de reservas ── */}
              {tipo === "reservas" && (
                <table className="table table--fixed">
                  <thead>
                    <tr>
                      <th style={{ width: "90px" }}>Reserva</th>
                      <th>Espacio</th>
                      <th style={{ width: "165px" }}>Fecha</th>
                      <th style={{ width: "140px" }}>Horario</th>
                      <th style={{ width: "130px" }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((item) => (
                      <tr key={item.reservationId}>
                        <td>
                          <strong>#{item.reservationId}</strong>
                        </td>
                        <td className="table__title-cell">{item.spaceName}</td>
                        <td
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            fontSize: "0.82rem",
                          }}
                        >
                          {formatDate(item.date)}
                        </td>
                        <td>
                          {item.startTime} – {item.endTime}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${reservationBadge(item.status)}`}
                          >
                            {item.status}
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
              )}

              {/* Paginación */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
