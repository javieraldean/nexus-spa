import { createContext, useContext, useState } from "react";
import { loginRequest } from "../api/nexusApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("nexus_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("nexus_token");
  });

  async function login(email, password) {
    const response = await loginRequest({ email, password });

    if (!response.success) {
      throw new Error(response.message || "Credenciales inválidas");
    }

    setUser(response.user);
    setToken(response.token);

    localStorage.setItem("nexus_user", JSON.stringify(response.user));
    localStorage.setItem("nexus_token", response.token);

    return response;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nexus_user");
    localStorage.removeItem("nexus_token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
