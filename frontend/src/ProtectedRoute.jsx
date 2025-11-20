import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/**
 * Protege rutas que requieren autenticación o un rol específico.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  // 🔒 Si NO está autenticado, fuera
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Validación de roles usando el contexto (NO localStorage)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
