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
import { getReportes, actualizarEstadoReporte, deleteReporte } from "../api/api";
import { CheckCircle, Trash3 } from "react-bootstrap-icons";
import "./Moderacion.css";

export default function Moderacion() {
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
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
    // 🔥 Aquí sí se borra el comentario y el reporte
    await actualizarEstadoReporte(token, reporteSeleccionado._id, "eliminar");

    // 🔥 Sacar del frontend
    setReportes((prev) =>
      prev.filter((r) => r._id !== reporteSeleccionado._id)
    );

    setShowConfirmModal(false);
    setReporteSeleccionado(null);
    mostrarToast("Comentario y reporte eliminados permanentemente.", "danger");
  } catch (err) {
    console.error("Error al eliminar reporte:", err);
    mostrarToast("Hubo un error al eliminar el comentario.", "danger");
  }
};


  // 🔥 MANTENER → MARCAR COMO REVISADO
  const handleMantener = async (id) => {
    try {
      const data = await actualizarEstadoReporte(token, id, "mantener");

      setReportes((prev) =>
        prev.map((r) => (r._id === id ? { ...r, estado: "revisado" } : r))
      );

      mostrarToast(
        data.message || "Comentario mantenido y reporte revisado.",
        "success"
      );
    } catch (err) {
      console.error("Error al actualizar reporte:", err);
      mostrarToast("Hubo un error al actualizar el reporte.", "danger");
    }
  };

  // 🔥 ELIMINAR TODOS LOS REVISADOS
  const eliminarTodosRevisados = async () => {
    try {
      const revisados = reportes.filter(
        (r) => r.estado === "revisado" || r.estado === "descartado"
      );

      if (revisados.length === 0) {
        mostrarToast("No hay comentarios revisados para eliminar.", "info");
        setShowBulkModal(false);
        return;
      }

      for (const rep of revisados) {
        await deleteReporte(token, rep._id);
      }

      setReportes((prev) => prev.filter((r) => r.estado === "pendiente"));

      setShowBulkModal(false);
      mostrarToast("Se eliminaron todos los reportes revisados.", "success");
    } catch (err) {
      console.error("Error al eliminar revisados:", err);
      mostrarToast("Error al eliminar los reportes revisados.", "danger");
    }
  };

  const hayRevisados = reportes.some(
    (r) => r.estado === "revisado" || r.estado === "descartado"
  );

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
          No hay reportes pendientes por revisar.
        </Alert>
      ) : (
        <>
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
                    <th>Motivo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {reportes.map((r, index) => {
                    const comentario =
                      r.comentarioId?.comentario || "Comentario no disponible";
                    const fechaComentario = r.comentarioId?.createdAt
                      ? new Date(r.comentarioId.createdAt).toLocaleDateString(
                          "es-CL"
                        )
                      : "—";
                    const profesor = r.profesorId?.nombre || "Desconocido";
                    const usuarioComentario =
                      r.comentarioId?.estudianteId?.email || "No registrado";
                    const usuarioReporte = r.usuarioId?.email || "Anónimo";
                    const fechaReporte = new Date(r.fecha).toLocaleDateString(
                      "es-CL"
                    );

                    return (
                      <tr key={r._id}>
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
                          >
                            {r.estado[0].toUpperCase() + r.estado.slice(1)}
                          </Badge>
                        </td>

                        <td className="text-center">
                          {r.estado === "pendiente" ? (
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                              <Button
                                className="btn-accion-rojo"
                                size="sm"
                                onClick={() => {
                                  setReporteSeleccionado(r);
                                  setShowConfirmModal(true);
                                }}
                              >
                                Eliminar
                              </Button>

                              <Button
                                className="btn-accion-verde"
                                size="sm"
                                onClick={() => handleMantener(r._id)}
                              >
                                Mantener
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

          {hayRevisados && (
            <div className="d-flex justify-content-start mt-3">
              <Button
                className="btn-eliminar-todos-azul"
                onClick={() => setShowBulkModal(true)}
              >
                <Trash3 className="me-2" />
                Eliminar todos los comentarios revisados
              </Button>
            </div>
          )}
        </>
      )}

      {/* 🔥 MODAL INDIVIDUAL */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Body className="text-center p-4">
          <h5 className="fw-bold mb-3">¿Eliminar este reporte?</h5>
          <p className="text-muted">
            Esta acción eliminará el reporte de manera permanente.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>

            <Button variant="danger" onClick={confirmarEliminar}>
              Sí, eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* 🔥 MODAL ELIMINACIÓN MASIVA */}
      <Modal
        show={showBulkModal}
        onHide={() => setShowBulkModal(false)}
        centered
      >
        <Modal.Body className="text-center p-4">
          <h5 className="fw-bold mb-2">
            ¿Eliminar todos los comentarios revisados?
          </h5>
          <p className="text-muted mb-4">
            Esta acción borrará permanentemente todos los reportes revisados o descartados.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={eliminarTodosRevisados}>
              Sí, eliminar todo
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* 🔥 TOAST */}
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
