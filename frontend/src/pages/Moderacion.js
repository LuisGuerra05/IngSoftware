import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Button,
  Table,
  Alert,
  Badge,
} from "react-bootstrap";
import { getReportes, actualizarEstadoReporte } from "../api/api";
import "./Moderacion.css";

export default function Moderacion() {
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // === Cargar reportes desde el backend ===
  const cargarReportes = async () => {
    try {
      setLoading(true);
      const data = await getReportes(token);
      setReportes(data);
    } catch (err) {
      console.error("Error al obtener reportes:", err);
      setError("No se pudieron cargar los reportes desde el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  // === Manejar acciones de moderación ===
  const handleAccion = async (id, accion) => {
    const nuevoEstado = accion === "mantener" ? "revisado" : "descartado";
    try {
      await actualizarEstadoReporte(token, id, nuevoEstado);
      setReportes((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, estado: nuevoEstado } : r
        )
      );
    } catch (err) {
      console.error("Error al actualizar reporte:", err);
      alert("Hubo un error al actualizar el reporte.");
    }
  };

  // === Render ===
  return (
    <Container style={{ marginTop: 100, marginBottom: 60 }}>
      <h2 className="fw-bold mb-4 text-center moderacion-title">
        Panel de Moderación
      </h2>
      <div className="linea-azul mb-4"></div>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-3 text-muted">Cargando reportes...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : reportes.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay reportes pendientes por revisar
        </Alert>
      ) : (
        <Card className="shadow-sm border-0 p-3">
          <Table hover responsive className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Comentario Reportado</th>
                <th>Profesor</th>
                <th>Usuario que comentó</th>
                <th>Usuario que reportó</th>
                <th>Fecha del Reporte</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r, index) => {
                const comentario = r.comentarioId?.comentario || "Comentario no disponible";
                const fechaComentario = r.comentarioId?.createdAt
                  ? new Date(r.comentarioId.createdAt).toLocaleDateString("es-CL")
                  : "—";
                const profesor = r.profesorId?.nombre || "Desconocido";

                const usuarioComentario = r.comentarioId?.estudianteId?.email || "No registrado";
                const usuarioReporte = r.usuarioId?.email || "Anónimo";

                const fechaReporte = new Date(r.fecha).toLocaleDateString("es-CL");

                return (
                  <tr key={r._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <div>
                        <strong>{comentario}</strong>
                        <div className="text-muted small">
                          Fecha del comentario: {fechaComentario}
                        </div>
                      </div>
                    </td>
                    <td>{profesor}</td>
                    <td>{usuarioComentario}</td> {/* 👈 NUEVO */}
                    <td>{usuarioReporte}</td>
                    <td>{fechaReporte}</td>
                    <td>
                      <Badge
                        bg={
                          r.estado === "pendiente"
                            ? "warning"
                            : r.estado === "revisado"
                            ? "success"
                            : "secondary"
                        }
                        text={r.estado === "pendiente" ? "dark" : "light"}
                      >
                        {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {r.estado === "pendiente" ? (
                        <>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="me-2"
                            onClick={() => handleAccion(r._id, "eliminar")}
                          >
                            Descartar
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleAccion(r._id, "mantener")}
                          >
                            Marcar como revisado
                          </Button>
                        </>
                      ) : (
                        <small className="text-muted fst-italic">
                          Acción completada
                        </small>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </Table>
        </Card>
      )}
    </Container>
  );
}
