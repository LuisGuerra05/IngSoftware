import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setIsAuthenticated(false);
    navigate("/login", { replace: true }); // 🔹 redirige sin recargar
  };

  const login = (token, userEmail) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", userEmail);
    setIsAuthenticated(true);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
