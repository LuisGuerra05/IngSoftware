import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validar token al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // 🔥 VALIDACIÓN REAL DE EXPIRACIÓN
        if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
          console.warn("⛔ Token expirado, cerrando sesión");
          handleLogout(false);
          setIsLoading(false);
          return;
        }

        // 🔥 Email y rol SIEMPRE desde el JWT
        const email = decoded.email;
        const role = decoded.role;

        setUser({ email, role });
        setIsAuthenticated(true);

      } catch (err) {
        console.error("❌ Token inválido:", err);
        handleLogout(false);
      }
    }

    setIsLoading(false);
  }, []);

  // Login
  const handleLogin = (token) => {
    try {
      const decoded = jwtDecode(token);

      // Solo guardamos token (seguro)
      localStorage.setItem("token", token);

      setUser({
        email: decoded.email,
        role: decoded.role,
      });

      setIsAuthenticated(true);
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Error al decodificar token:", err);
    }
  };

  // Logout
  const handleLogout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("misRamos");

    setUser(null);
    setIsAuthenticated(false);

    if (redirect) navigate("/login", { replace: true });
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
