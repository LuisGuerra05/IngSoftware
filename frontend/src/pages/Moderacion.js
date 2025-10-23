import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Button, Table, Alert } from "react-bootstrap";
import "./Moderacion.css";

/**
 * Esta página solo es visible para usuarios con rol "admin".
 * Aquí se mostrarán los comentarios reportados por estudiantes.
 * De momento muestra una tabla simulada, pero luego puedes conectarla
 * al endpoint /api/reportes.
 */

export default function Moderacion() {
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    // Simulación temporal — más adelante se reemplaza con fetch("/api/reportes")
    setTimeout(() => {
      setReportes([
        {
          id: 1,
          comentario: "El profesor nunca llega a la hora",
          autor: "mivicente@alumnos.uai.cl",
          fecha: "2025-10-23",
        },
        {
          id: 2,
          comentario: "Comentario ofensivo en la reseña de CORE Ética",
          autor: "anonimo@alumnos.uai.cl",
          fecha: "2025-10-22",
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleAccion = (id, accion) => {
    alert(`Reporte #${id} → ${accion === "mantener" ? "Mantenido" : "Eliminado"}`);
    // Aquí se implementará la lógica real (PUT o DELETE)
  };

  return (
    <Container style={{ marginTop: 100, marginBottom: 60 }}>
      <h2 className="fw-bold mb-4 text-center moderacion-title">
        Panel de Moderación
      </h2>
      <div className="linea-azul mb-4"></div>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : reportes.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay reportes pendientes por revisar 🎉
        </Alert>
      ) : (
        <Card className="shadow-sm border-0 p-3">
          <Table hover responsive className="align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Comentario Reportado</th>
                <th>Autor</th>
                <th>Fecha</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.comentario}</td>
                  <td>{r.autor}</td>
                  <td>{r.fecha}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleAccion(r.id, "eliminar")}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleAccion(r.id, "mantener")}
                    >
                      Mantener
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}
