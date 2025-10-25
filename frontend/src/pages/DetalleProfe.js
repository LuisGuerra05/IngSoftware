import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProfesorById,
  getCursoById,
  getCalificacionesByProfesor,
  getMiCalificacionByProfesor,
  crearReporte,
} from "../api/api";
import {
  Container,
  Card,
  Spinner,
  Row,
  Col,
  Button,
  Toast,
  ToastContainer,
  Dropdown,
} from "react-bootstrap";
import {
  Mortarboard,
  BoxArrowUpRight,
  CheckCircle,
  Trash3,
  Flag,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import EstadisticasProfe from "../components/EstadisticasProfe";
import ModalAsignatura from "../components/modalAsignatura";
import ModalCalificacion from "../components/ModalCalificacion";
import "./DetalleProfe.css";

export default function DetalleProfe() {
  const { id } = useParams();
  const [profesor, setProfesor] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [showModalCalificacion, setShowModalCalificacion] = useState(false);
  const [miCalificacion, setMiCalificacion] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastColor, setToastColor] = useState("success");
  const [actualizarStats, setActualizarStats] = useState(false); // 🔹 Nuevo estado

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // === Cargar datos ===
  const cargarDatos = async () => {
    try {
      const [profData, califData, miCalif] = await Promise.all([
        getProfesorById(id),
        getCalificacionesByProfesor(id),
        getMiCalificacionByProfesor(id, token),
      ]);
      setProfesor(profData);
      setComentarios(califData?.comentarios || []);
      setMiCalificacion(miCalif);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información del profesor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const handleOpenModal = async (curso) => {
    try {
      const cursoCompleto = await getCursoById(curso._id);
      setCursoSeleccionado(cursoCompleto);
      setShowModal(true);
    } catch (err) {
      console.error("Error al obtener curso:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCursoSeleccionado(null);
  };

  const refrescarDatos = async (exito, tipo) => {
    await cargarDatos();
    if (exito) {
      let mensaje = "";
      let color = "success";
      if (tipo === "crear") mensaje = "Evaluación enviada con éxito";
      else if (tipo === "editar") {
        mensaje = "Evaluación actualizada correctamente";
        color = "success";
      } else if (tipo === "eliminar") {
        mensaje = "Evaluación eliminada correctamente";
        color = "danger";
      }

      mostrarToast(mensaje, color);

      // 🔹 Forzar actualización de estadísticas
      setActualizarStats((prev) => !prev);
    }
  };

  // === Función centralizada para toasts ===
  const mostrarToast = (mensaje, color = "success") => {
    setToastMensaje(mensaje);
    setToastColor(color);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // === Manejar reporte de comentario ===
  const handleReportar = async (comentario) => {
    try {
      const comentarioId = comentario._id || comentario.id;
      if (!comentarioId) {
        mostrarToast("No se pudo identificar el comentario.", "danger");
        return;
      }

      const yaReportado =
        comentario.reportes?.some((r) => r.usuarioId === userId) || false;

      if (yaReportado) {
        mostrarToast("Ya has reportado este comentario anteriormente.", "info");
        return;
      }

      await crearReporte(token, comentarioId, profesor._id, "Comentario inapropiado");
      mostrarToast("Comentario reportado correctamente", "success");
    } catch (err) {
      console.error("Error al enviar reporte:", err);
      if (err.response && err.response.data && err.response.data.message) {
        const msg = err.response.data.message;
        if (msg.includes("Ya reportaste")) {
          mostrarToast("Ya has reportado este comentario anteriormente.", "info");
        } else {
          mostrarToast(msg, "danger");
        }
      } else {
        mostrarToast("Error al enviar reporte", "danger");
      }
    }
  };

  // === Render ===
  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3 text-muted">Cargando información del profesor...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );

  if (!profesor)
    return (
      <Container className="text-center mt-5">
        <p className="text-muted">Profesor no encontrado.</p>
      </Container>
    );

  return (
    <div className="detalle-profe-page">
      <Container>
        <Card className="detalle-profe-card shadow-sm">
          <Row className="g-4 align-items-start">
            {/* Columna izquierda */}
            <Col xs={12} md={5} className="detalle-profe-info">
              <h2 className="detalle-profe-nombre">{profesor.nombre}</h2>
              <span className="detalle-profe-campus">{profesor.campus}</span>

              <div className="perfil-uai-box">
                <Mortarboard size={18} className="text-primary me-2" />
                <span>
                  <strong>Perfil UAI:</strong>{" "}
                  {profesor.linkUAI ? (
                    <a
                      href={profesor.linkUAI}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en sitio oficial <BoxArrowUpRight size={13} />
                    </a>
                  ) : (
                    <span className="text-muted">No disponible</span>
                  )}
                </span>
              </div>

              {role !== "admin" && (
                <div className="d-flex gap-3 mt-3">
                  <Button
                    className="btn-volver"
                    onClick={() => setShowModalCalificacion(true)}
                  >
                    {miCalificacion ? "Editar Evaluación" : "Evaluar Profesor"}
                  </Button>
                </div>
              )}

              <h5 className="detalle-profe-subtitulo mt-4">Cursos que imparte</h5>
              {profesor.cursos?.length ? (
                <ul className="detalle-profe-cursos">
                  {profesor.cursos.map((curso) => (
                    <li
                      key={curso._id}
                      className="curso-item"
                      onClick={() => handleOpenModal(curso)}
                      style={{ cursor: "pointer" }}
                    >
                      <strong>{curso.nombre}</strong>{" "}
                      <span className="text-muted">({curso.codigo})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No hay cursos registrados.</p>
              )}

              <h5 className="detalle-profe-subtitulo mt-4">Comentarios</h5>

              <div className="comentarios-container mt-3">
                {miCalificacion?.comentario && (
                  <div className="comentario-item propio mb-3 p-2 border rounded bg-primary bg-opacity-10 border-primary">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">Tu comentario</span>
                      <small className="text-muted">
                        {new Date(
                          miCalificacion.updatedAt || miCalificacion.createdAt
                        ).toLocaleDateString("es-CL")}
                      </small>
                    </div>
                    <p className="mt-2 mb-1 fw-semibold">
                      “{miCalificacion.comentario}”
                    </p>
                  </div>
                )}

                {comentarios.length > 0 ? (
                  comentarios
                    .filter(
                      (c) =>
                        !miCalificacion ||
                        c.comentario !== miCalificacion.comentario
                    )
                    .map((c, i) => {
                      const esPropio =
                        c.usuarioId === userId || c.usuario?._id === userId;

                      return (
                        <div
                          key={i}
                          className={`comentario-item p-2 border rounded mb-2 ${
                            esPropio
                              ? "bg-primary bg-opacity-10 border-primary"
                              : "bg-light"
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="mb-1 fw-semibold">“{c.comentario}”</p>
                            </div>
                            {!esPropio && (
                              <Dropdown align="end">
                                <Dropdown.Toggle
                                  variant="light"
                                  size="sm"
                                  className="border-0"
                                >
                                  <ThreeDotsVertical />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => handleReportar(c)}
                                  >
                                    <Flag
                                      size={14}
                                      className="me-2 text-danger"
                                    />
                                    Reportar
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>
                          <small className="text-muted">
                            {new Date(c.fecha).toLocaleDateString("es-CL")}
                          </small>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-muted">No hay comentarios registrados.</p>
                )}
              </div>
            </Col>

            {/* Columna derecha */}
            <Col xs={12} md={7} className="detalle-profe-stats">
              <h5 className="detalle-profe-subtitulo">
                Estadísticas y valoraciones
              </h5>
              {/* 🔹 Se vuelve a renderizar cuando actualizarStats cambia */}
              <EstadisticasProfe profesorId={id} key={actualizarStats} />
            </Col>
          </Row>
        </Card>
      </Container>

      {/* Modales */}
      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />

      {role !== "admin" && (
        <ModalCalificacion
          show={showModalCalificacion}
          handleClose={() => setShowModalCalificacion(false)}
          profesorId={id}
          profesorNombre={profesor?.nombre}
          calificacionExistente={miCalificacion}
          onSuccess={refrescarDatos}
        />
      )}

      {/* ✅ Toast fijo elegante */}
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
    </div>
  );
}
