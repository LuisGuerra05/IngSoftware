import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Nuevo
  const navigate = useNavigate();

  // ✅ Cargar sesión al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role || localStorage.getItem("role") || "estudiante";
        const email = decoded.email || localStorage.getItem("usuario");

        setUser({ email, role });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("❌ Token inválido:", err);
        handleLogout(false);
      }
    }
    setIsLoading(false); // ✅ Solo terminamos carga aquí
  }, []);

  // ✅ Login
  const handleLogin = (token, userEmail) => {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role || "estudiante";

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", userEmail || decoded.email);
      localStorage.setItem("role", role);

      setUser({ email: userEmail || decoded.email, role });
      setIsAuthenticated(true);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error al decodificar token:", err);
    }
  };

  // ✅ Logout
  const handleLogout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("role");
    setUser(null);
    setIsAuthenticated(false);
    if (redirect) navigate("/login", { replace: true });
  };

  if (isLoading) {
    // ⏳ Evita redirecciones mientras se valida token
    return null;
  }

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
