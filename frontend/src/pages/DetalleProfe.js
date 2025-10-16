import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfesorById, getCursoById } from "../api/api"; // 👈 usamos ambas funciones
import { Container, Card, Spinner, Row, Col, Button } from "react-bootstrap";
import { Mortarboard, BoxArrowUpRight } from "react-bootstrap-icons";
import EstadisticasProfe from "../components/EstadisticasProfe";
import ModalAsignatura from "../components/modalAsignatura";
import "./DetalleProfe.css";

export default function DetalleProfe() {
  const { id } = useParams();
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // 🔹 Cargar datos del profesor
  useEffect(() => {
    getProfesorById(id)
      .then((data) => setProfesor(data))
      .catch(() => setError("No se pudo cargar la información del profesor."))
      .finally(() => setLoading(false));
  }, [id]);

  // 🔹 Al hacer clic en un curso → obtener curso completo con sus profesores
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

  // 🔹 Loading / Error / Not Found
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

  // 🔹 Render principal
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
                  <a
                    href={profesor.linkUAI}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en sitio oficial <BoxArrowUpRight size={13} />
                  </a>
                </span>
              </div>

              <h5 className="detalle-profe-subtitulo">Cursos que imparte</h5>
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

              <Link to="/profesores">
                <Button className="btn-volver mt-3">← Volver al listado</Button>
              </Link>
            </Col>

            {/* Columna derecha */}
            <Col xs={12} md={7} className="detalle-profe-stats">
              <h5 className="detalle-profe-subtitulo">
                Estadísticas y valoraciones
              </h5>
              <EstadisticasProfe profesorId={id} />
            </Col>
          </Row>
        </Card>
      </Container>

      {/* ✅ Modal igual al de Asignaturas */}
      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />
    </div>
  );
}
