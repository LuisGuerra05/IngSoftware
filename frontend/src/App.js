import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profesores from "./pages/Profesores";
import Asignaturas from "./pages/Asignaturas";
import DetalleProfe from "./pages/DetalleProfe";
import Layout from "./components/Layout";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* --- Login --- */}
      <Route path="/login" element={<Login />} />

      {/* --- Home --- */}
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

      {/* --- Profesores --- */}
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

      {/* --- Asignaturas --- */}
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

      {/* --- Detalle del Profesor --- */}
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

      {/* --- Catch-all --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
