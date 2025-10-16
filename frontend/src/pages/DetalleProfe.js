import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfesorById } from "../api/api";
import { Container, Card, Spinner, Row, Col, Button } from "react-bootstrap";
import "./DetalleProfe.css";

export default function DetalleProfe() {
  const { id } = useParams();
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfesorById(id)
      .then((data) => setProfesor(data))
      .catch(() => setError("No se pudo cargar la información del profesor."))
      .finally(() => setLoading(false));
  }, [id]);

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
          <Row className="g-4">
            {/* Columna izquierda: información del profesor */}
            <Col xs={12} md={6} className="detalle-profe-info">
              <h2 className="detalle-profe-nombre">{profesor.nombre}</h2>
              <span className="detalle-profe-campus">{profesor.campus}</span>

              <p className="detalle-profe-link">
                <strong>Perfil UAI:</strong>{" "}
                <a
                  href={profesor.linkUAI}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en sitio oficial ↗
                </a>
              </p>

              <h5 className="detalle-profe-subtitulo">Cursos que imparte</h5>
              {profesor.cursos?.length ? (
                <ul className="detalle-profe-cursos">
                  {profesor.cursos.map((curso) => (
                    <li key={curso._id}>
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

            {/* Columna derecha: Placeholder para estadísticas */}
            <Col xs={12} md={6} className="detalle-profe-stats">
              <h5 className="detalle-profe-subtitulo">Estadísticas</h5>
              <div className="stats-placeholder">
                <p className="text-muted mb-0">
                  Próximamente: calificaciones, reseñas y análisis 📊
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}
