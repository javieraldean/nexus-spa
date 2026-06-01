export default function SidebarFilters({
  categories,
  filters,
  onChange,
  onClear,
  onSearch,
}) {
  return (
    <aside className="sidebar-filters">
      {/* Categorías */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categoría</h3>
        <div className="filter-group">
          <select
            value={filters.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tipo */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Tipo</h3>
        <div className="filter-group">
          <select
            value={filters.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="book">Libros</option>
            <option value="magazine">Revistas</option>
          </select>
        </div>
      </div>

      {/* Año */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Año de publicación</h3>
        <div className="filter-group">
          <input
            value={filters.year}
            placeholder="Ej. 2024"
            onChange={(e) => onChange("year", e.target.value)}
          />
        </div>
      </div>

      {/* Búsqueda */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Búsqueda</h3>
        <div className="filter-group">
          <input
            value={filters.search}
            placeholder="Título, autor..."
            onChange={(e) => onChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* Buscar */}
      {onSearch && (
        <div className="sidebar-section">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ width: "100%" }}
            onClick={onSearch}
          >
            Buscar con filtros
          </button>
        </div>
      )}

      {/* Limpiar */}
      <div className="sidebar-section">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ width: "100%" }}
          onClick={onClear}
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
