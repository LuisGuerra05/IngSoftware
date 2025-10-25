import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Button,
  Table,
  Alert,
  Badge,
  Row,
  Col,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { getReportes, actualizarEstadoReporte } from "../api/api";
import { CheckCircle, Trash3 } from "react-bootstrap-icons";
import "./Moderacion.css";

export default function Moderacion() {
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastColor, setToastColor] = useState("success");

  const token = localStorage.getItem("token");

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

  const mostrarToast = (mensaje, color = "success") => {
    setToastMensaje(mensaje);
    setToastColor(color);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const confirmarEliminar = async () => {
    if (!reporteSeleccionado) return;
    try {
      const data = await actualizarEstadoReporte(
        token,
        reporteSeleccionado._id,
        "eliminar"
      );

      setReportes((prev) =>
        prev.map((r) =>
          r._id === reporteSeleccionado._id
            ? { ...r, estado: "descartado" }
            : r
        )
      );

      setShowConfirmModal(false);
      mostrarToast(data.message || "Comentario eliminado correctamente.", "danger");
    } catch (err) {
      console.error("Error al eliminar reporte:", err);
      mostrarToast("Hubo un error al eliminar el reporte.", "danger");
    }
  };

  const handleMantener = async (id) => {
    try {
      const data = await actualizarEstadoReporte(token, id, "mantener");

      setReportes((prev) =>
        prev.map((r) => (r._id === id ? { ...r, estado: "revisado" } : r))
      );

      mostrarToast(data.message || "Comentario mantenido y reporte revisado.", "success");
    } catch (err) {
      console.error("Error al actualizar reporte:", err);
      mostrarToast("Hubo un error al actualizar el reporte.", "danger");
    }
  };

  return (
    <Container className="moderacion-container">
      <Row className="justify-content-center text-center mb-4">
        <Col xs={12} md={8}>
          <h1 className="moderacion-title fw-bold">Panel de Moderación</h1>
          <p className="moderacion-subtitle text-muted">
            Revisa los comentarios reportados y decide si mantenerlos o eliminarlos.
          </p>
        </Col>
      </Row>

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
        <Card className="moderacion-card shadow-sm border-0 p-3">
          <div className="table-responsive">
            <Table hover className="align-middle moderacion-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Comentario Reportado</th>
                  <th>Profesor</th>
                  <th>Usuario que comentó</th>
                  <th>Usuario que reportó</th>
                  <th>Motivo del Reporte</th>
                  <th>Fecha del Reporte</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((r, index) => {
                  const comentario =
                    r.comentarioId?.comentario || "Comentario no disponible";
                  const fechaComentario = r.comentarioId?.createdAt
                    ? new Date(r.comentarioId.createdAt).toLocaleDateString("es-CL")
                    : "—";
                  const profesor = r.profesorId?.nombre || "Desconocido";
                  const usuarioComentario =
                    r.comentarioId?.estudianteId?.email || "No registrado";
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
                      <td>{usuarioComentario}</td>
                      <td>{usuarioReporte}</td>
                      <td>{r.motivo || "—"}</td>
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
                          className="estado-badge"
                        >
                          {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {r.estado === "pendiente" ? (
                          <div className="d-flex flex-wrap justify-content-center gap-2">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setReporteSeleccionado(r);
                                setShowConfirmModal(true);
                              }}
                            >
                              Eliminar comentario
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleMantener(r._id)}
                            >
                              Mantener comentario
                            </Button>
                          </div>
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
          </div>
        </Card>
      )}

      {/* Modal confirmación */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Body className="text-center p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill text-warning mb-3"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <h5 className="fw-bold mb-2">¿Eliminar este comentario?</h5>
          <p className="text-muted mb-4">
            Esta acción eliminará el comentario reportado y no se puede deshacer.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="outline-danger"
              onClick={confirmarEliminar}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Toast */}
      <ToastContainer className="toast-container-fijo">
        {showToast && (
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={4000}
            autohide
            className="custom-toast-elegante"
            data-type={toastColor}
          >
            <Toast.Body className="d-flex align-items-center fw-semibold">
              {toastColor === "danger" ? (
                <Trash3 className="me-2" size={18} />
              ) : (
                <CheckCircle className="me-2" size={18} />
              )}
              {toastMensaje}
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </Container>
  );
}
