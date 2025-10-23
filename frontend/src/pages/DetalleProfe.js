import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProfesorById,
  getCursoById,
  getCalificacionesByProfesor,
} from "../api/api";
import {
  Container,
  Card,
  Spinner,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Mortarboard, BoxArrowUpRight } from "react-bootstrap-icons";
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
  const [showModalCalificacion, setShowModalCalificacion] = useState(false); // 👈 nombre correcto

  // 🔹 Cargar datos del profesor y sus calificaciones
  useEffect(() => {
    Promise.all([getProfesorById(id), getCalificacionesByProfesor(id)])
      .then(([profData, califData]) => {
        setProfesor(profData);
        setComentarios(califData?.comentarios || []);
      })
      .catch(() => setError("No se pudo cargar la información del profesor."))
      .finally(() => setLoading(false));
  }, [id]);

  // 🔹 Abrir modal con información del curso
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

  // 🔹 Refrescar datos tras enviar calificación
  const refrescarDatos = async () => {
    try {
      const [profData, califData] = await Promise.all([
        getProfesorById(id),
        getCalificacionesByProfesor(id),
      ]);
      setProfesor(profData);
      setComentarios(califData?.comentarios || []);
    } catch (err) {
      console.error("Error refrescando datos:", err);
    }
  };

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
            {/* 🔹 Columna izquierda */}
            <Col xs={12} md={5} className="detalle-profe-info">
              <h2 className="detalle-profe-nombre">{profesor.nombre}</h2>
              <span className="detalle-profe-campus">{profesor.campus}</span>

              <div className="perfil-uai-box">
                <Mortarboard size={18} className="text-primary me-2" />
                <span>
                  <strong>Perfil UAI:</strong>{" "}
                  <a
                    href={profesor.linkUAI}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en sitio oficial <BoxArrowUpRight size={13} />
                  </a>
                </span>
              </div>

              {/* 🔹 Botones */}
              <div className="d-flex gap-3 mt-3">
                <Button
                  className="btn-volver"
                  onClick={() => setShowModalCalificacion(true)}
                >
                  Evaluar Profesor
                </Button>

                <Link to="/profesores">
                  <Button variant="outline-secondary">Volver al listado</Button>
                </Link>
              </div>

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

              {/* 💬 Comentarios */}
              <div className="comentarios-container mt-4">
                <h5 className="detalle-profe-subtitulo">Comentarios</h5>
                {comentarios.length > 0 ? (
                  <div className="comentarios-lista">
                    {comentarios.map((c, i) => (
                      <div key={i} className="comentario-item">
                        <p className="mb-1">“{c.comentario}”</p>
                        <div className="comentario-fecha">
                          {new Date(c.fecha).toLocaleDateString("es-CL")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No hay comentarios disponibles.</p>
                )}
              </div>
            </Col>

            {/* 🔹 Columna derecha */}
            <Col xs={12} md={7} className="detalle-profe-stats">
              <h5 className="detalle-profe-subtitulo">
                Estadísticas y valoraciones
              </h5>
              <EstadisticasProfe profesorId={id} />
            </Col>
          </Row>
        </Card>
      </Container>

      {/* 🔹 Modal de cursos */}
      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />

      {/* 🔹 Modal de calificación */}
      <ModalCalificacion
        show={showModalCalificacion}
        handleClose={() => setShowModalCalificacion(false)}
        profesorId={id}
        profesorNombre={profesor?.nombre}
        onSuccess={refrescarDatos}
      />
    </div>
  );
}
