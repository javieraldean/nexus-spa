import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("user@nexus.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/library");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1 className="page-title" style={{ textAlign: "center" }}>
        Iniciar sesión
      </h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Correo
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn btn-primary" type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
