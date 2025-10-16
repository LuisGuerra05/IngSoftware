import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfesorById } from "../api/api";
import { Container, Card, Spinner, Row, Col, Button } from "react-bootstrap";

export default function DetalleProfe() {
  const { id } = useParams(); // ID desde la URL
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfesorById(id)
      .then((data) => {
        console.log("✅ Profesor recibido:", data);
        setProfesor(data);
      })
      .catch((err) => {
        console.error("❌ Error obteniendo profesor:", err);
        setError("No se pudo cargar la información del profesor.");
      })
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
    <Container style={{ marginTop: 100 }}>
      <Card className="shadow-sm p-4">
        <Row>
          <Col md={4} className="text-center">
            <img
              src="/img/Logo.png"
              alt="Profesor"
              style={{ width: "80%", maxWidth: 180, marginBottom: 15 }}
            />
          </Col>
          <Col md={8}>
            <h3 className="fw-bold mb-2">{profesor.nombre}</h3>
            <p className="text-muted mb-1">
              <strong>Campus:</strong> {profesor.campus}
            </p>
            <p>
              <strong>Perfil UAI:</strong>{" "}
              <a
                href={profesor.linkUAI}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                Ver en sitio oficial
              </a>
            </p>

            <h5 className="mt-4 mb-3">Cursos que imparte</h5>
            {profesor.cursos?.length ? (
              <ul>
                {profesor.cursos.map((curso) => (
                  <li key={curso._id} style={{ marginBottom: 6 }}>
                    <strong>{curso.nombre}</strong>{" "}
                    <span className="text-muted">({curso.codigo})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No hay cursos registrados.</p>
            )}

            <Link to="/profesores">
              <Button variant="dark" className="mt-3">
                ← Volver al listado
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
