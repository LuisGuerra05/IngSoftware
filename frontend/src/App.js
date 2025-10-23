import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { setLogoutHandler } from "./api/axiosInstance";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profesores from "./pages/Profesores";
import Asignaturas from "./pages/Asignaturas";
import MisAsignaturas from "./pages/MisAsignaturas";
import DetalleProfe from "./pages/DetalleProfe";
import Layout from "./components/Layout";
import "./App.css";

export default function App() {
  const { logout } = useAuth();

  // 🔹 Vincula el logout del contexto con axios
  useEffect(() => {
    setLogoutHandler(() => logout);
  }, [logout]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profesores"
        element={
          <ProtectedRoute>
            <Layout>
              <Profesores />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/asignaturas"
        element={
          <ProtectedRoute>
            <Layout>
              <Asignaturas />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-asignaturas"
        element={
          <ProtectedRoute>
            <Layout>
              <MisAsignaturas />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/detalle-profe/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DetalleProfe />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
