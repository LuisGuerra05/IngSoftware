import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/**
 * Protege rutas que requieren autenticación o un rol específico.
 * Si se pasa `requiredRole="admin"`, solo los administradores podrán acceder.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
