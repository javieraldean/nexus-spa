import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import SpaceCard from "../components/SpaceCard";

const ZONE_KEYS = [
  "reception",
  "focus",
  "desks",
  "meeting-a",
  "meeting-b",
  "booths",
  "coffee",
  "lounge",
];

const ZONE_ICONS = {
  reception: "/assets/img/icons/reception.svg",
  focus: "/assets/img/icons/silence.svg",
  desks: "/assets/img/icons/study.svg",
  "meeting-a": "/assets/img/icons/meeting-room.svg",
  "meeting-b": "/assets/img/icons/conference.svg",
  booths: "/assets/img/icons/booth.svg",
  coffee: "/assets/img/icons/coffee.svg",
  lounge: "/assets/img/icons/lounge.svg",
};

export default function Coworking() {
  const { data, loading, error } = useApi("/coworking/spaces");

  const stats = useMemo(() => {
    if (!data?.items) return null;
    const items = data.items;
    return {
      available: items.filter((s) => !s.occupied).length,
      occupied: items.filter((s) => s.occupied).length,
      total: items.length,
    };
  }, [data]);

  const mapSpaces = data?.items?.slice(0, 8) || [];

  return (
    <div className="coworking-page">
      {/* Hero */}
      <section className="coworking-hero">
        <div className="container">
          <div className="coworking-hero__grid">
            <div className="coworking-hero__content">
              <h1>
                Nuestros espacios
                <br />
                de coworking
              </h1>
              <p>
                Reserva tu espacio ideal en la librería universitaria NEXUS.
                Zonas silenciosas, salas de reunión, cabinas privadas y más.
              </p>
              <div className="coworking-hero__tags">
                <span>
                  <img
                    src="/assets/img/icons/meeting-room.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                  Salas de reunión
                </span>
                <span>
                  <img
                    src="/assets/img/icons/work-team.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                  Escritorios libres
                </span>
                <span>
                  <img
                    src="/assets/img/icons/coffee.svg"
                    alt=""
                    width="16"
                    height="16"
                  />
                  Cafetería
                </span>
              </div>
            </div>

            <div className="coworking-hero__media">
              <img
                src="/assets/img/hero/hero-coworking.jpg"
                alt="Espacios de coworking NEXUS"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="coworking-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card stat-card--available">
                <div className="stat-card__icon">
                  <img src="/assets/img/icons/acum-availables.svg" alt="" />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__label">Espacios disponibles</span>
                  <span className="stat-card__value">{stats.available}</span>
                  <span className="stat-card__hint">Libres ahora</span>
                </div>
              </div>

              <div className="stat-card stat-card--reserved">
                <div className="stat-card__icon">
                  <img src="/assets/img/icons/acum-calendar.svg" alt="" />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__label">Espacios ocupados</span>
                  <span className="stat-card__value">{stats.occupied}</span>
                  <span className="stat-card__hint">En uso</span>
                </div>
              </div>

              <div className="stat-card stat-card--rooms">
                <div className="stat-card__icon">
                  <img src="/assets/img/icons/acum-meeting-rooms.svg" alt="" />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__label">Total espacios</span>
                  <span className="stat-card__value">{stats.total}</span>
                  <span className="stat-card__hint">En la planta</span>
                </div>
              </div>

              <div className="stat-card stat-card--booths">
                <div className="stat-card__icon">
                  <img src="/assets/img/icons/acum-booth.svg" alt="" />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__label">Ocupación</span>
                  <span className="stat-card__value">
                    {stats.total > 0
                      ? Math.round((stats.occupied / stats.total) * 100)
                      : 0}
                    %
                  </span>
                  <span className="stat-card__hint">Del aforo</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading / Error */}
      {loading && (
        <div className="container">
          <p className="loading">Cargando espacios...</p>
        </div>
      )}
      {error && (
        <div className="container">
          <p className="error">No se pudieron cargar los espacios.</p>
        </div>
      )}

      {/* Mapa de zonas */}
      {mapSpaces.length > 0 && (
        <section className="coworking-map-section">
          <div className="container">
            <div className="section-heading">
              <h2>Planta del espacio</h2>
              <p>Haz clic en una zona para ver su detalle y reservar</p>
            </div>

            <div className="coworking-map">
              {mapSpaces.map((space, index) => {
                const zoneKey = ZONE_KEYS[index] || `zone-${index}`;
                const icon = ZONE_ICONS[zoneKey];

                return (
                  <Link
                    key={space.id}
                    to={`/coworking/spaces/${space.id}`}
                    className={`zone zone--${zoneKey}`}
                  >
                    <div className="zone-header">
                      <div className="zone-icon">
                        {icon && (
                          <img
                            src={icon}
                            alt={space.name}
                            width="32"
                            height="32"
                          />
                        )}
                      </div>
                      <div className="zone-copy">
                        <span className="zone-title">{space.name}</span>
                        <span className="zone-description">
                          {space.capacity} personas
                        </span>
                      </div>
                    </div>

                    <div className="zone-footer">
                      <div className="zone-badges">
                        <span className="zone-badge">
                          {space.occupied ? "Ocupado" : "Disponible"}
                        </span>
                        {space.occupied &&
                          (space.availableAt || space.endTime) && (
                            <span className="zone-badge zone-badge--sub">
                              Libre: {space.availableAt || space.endTime}
                            </span>
                          )}
                      </div>
                      {!space.occupied && (
                        <span className="zone-reservar-btn">Reservar</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Vista lista — todos los espacios */}
      {data?.items && data.items.length > 8 && (
        <section style={{ paddingBottom: "3rem" }}>
          <div className="container">
            <div className="section-heading">
              <h2>Todos los espacios</h2>
            </div>
            <div className="books-list">
              {data.items.slice(8).map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
