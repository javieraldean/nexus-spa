import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{ padding: "4rem 0", textAlign: "center" }}
    >
      <h1 className="page-title" style={{ fontSize: "4rem" }}>
        404
      </h1>
      <p style={{ marginBottom: "1.5rem" }}>La página solicitada no existe.</p>
      <Link className="btn btn-primary" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}
