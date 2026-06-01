import { useEffect, useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";
import { apiRequest } from "../api/nexusApi";
import BookCard from "../components/BookCard";
import SidebarFilters from "../components/SidebarFilters";

const STORAGE_FILTERS = "nexus_library_filters";
const STORAGE_DATA = "nexus_library_data";
const STORAGE_SEARCHED = "nexus_library_searched";

function readSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function Library() {
  const [filters, setFilters] = useState(() =>
    readSession(STORAGE_FILTERS, {
      category: "",
      year: "",
      type: "",
      search: "",
    }),
  );
  const [data, setData] = useState(() => readSession(STORAGE_DATA, null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(() =>
    readSession(STORAGE_SEARCHED, false),
  );

  const { data: categoriesData } = useApi("/library/categories");

  /* Persistir cambios en sessionStorage */
  useEffect(() => {
    sessionStorage.setItem(STORAGE_FILTERS, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (data !== null)
      sessionStorage.setItem(STORAGE_DATA, JSON.stringify(data));
    else sessionStorage.removeItem(STORAGE_DATA);
  }, [data]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_SEARCHED, JSON.stringify(hasSearched));
  }, [hasSearched]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.year) params.set("year", filters.year);
    if (filters.type) params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);
    const qs = params.toString();
    return qs ? `/library/items?${qs}` : "/library/items";
  }, [filters]);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const result = await apiRequest(query);
      setData(result);
    } catch {
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function clearFilters() {
    setFilters({ category: "", year: "", type: "", search: "" });
    setData(null);
    setHasSearched(false);
  }

  return (
    <div className="catalog-page">
      {/* ── Hero ── */}
      <section className="coworking-hero">
        <div className="container">
          <div className="coworking-hero__grid">
            <div className="coworking-hero__content">
              <h1>
                Nuestro catálogo
                <br />
                de libros
              </h1>
              <p>
                Explora nuestra colección universitaria. Usa los filtros de
                categoría, tipo y año, o busca directamente por título o autor.
                Cuando encuentres lo que buscas, añádelo al carrito y finaliza
                tu compra en segundos.
              </p>
              <div className="coworking-hero__tags">
                <span>
                  <img
                    src="/assets/img/icons/bookstack.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                  Libros y revistas
                </span>
                <span>
                  <img
                    src="/assets/img/icons/study.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                  Filtros avanzados
                </span>
                <span>
                  <img
                    src="/assets/img/icons/shopping-cart.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                  Compra en línea
                </span>
              </div>
            </div>

            <div className="coworking-hero__media">
              <img
                src="/assets/img/hero/hero-library.jpg"
                alt="Catálogo de libros NEXUS"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="catalog-layout">
          {/* Sidebar izquierdo */}
          <SidebarFilters
            categories={categoriesData?.items || []}
            filters={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
            onSearch={handleSearch}
          />

          {/* Contenido principal */}
          <div className="catalog-main">
            {loading && (
              <p className="loading">Cargando listado de libros...</p>
            )}
            {error && (
              <p className="error">No se pudo cargar el listado de libros.</p>
            )}

            {!hasSearched && !loading && (
              <div className="historial-prompt">
                <p>
                  Selecciona los filtros y haz clic en{" "}
                  <strong>Buscar con filtros</strong> para ver el catálogo.
                </p>
              </div>
            )}

            {hasSearched && !loading && !error && data?.items?.length === 0 && (
              <p className="loading">No se encontraron resultados.</p>
            )}

            <div className="books-list">
              {data?.items?.map((item) => (
                <BookCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
