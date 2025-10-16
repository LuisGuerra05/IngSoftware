import React, { useEffect, useState } from "react";
import { getProfesores } from "../api/api";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profesores.css";

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Llamando a getProfesores()...");
    getProfesores()
      .then((data) => {
        console.log("✅ Profesores recibidos desde backend:", data);
        setProfesores(data);
      })
      .catch((err) => {
        console.error("❌ Error obteniendo profesores:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/detalle-profe/${id}`);
  };

  // 🔹 Función para obtener cursos ordenados y limitados
  const renderCursos = (cursos = []) => {
    if (cursos.length === 0) return "Sin cursos";

    // 1️⃣ Ordenar alfabéticamente
    const sorted = [...cursos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );

    // 2️⃣ Tomar máximo 3
    const mostrados = sorted.slice(0, 3).map((c) => c.nombre);

    // 3️⃣ Si hay más, agregar puntos suspensivos
    const sufijo = cursos.length > 3 ? " ..." : "";

    return mostrados.join(", ") + sufijo;
  };

  return (
    <div className="profesores-page">
      <Container style={{ marginTop: 100 }}>
        <h2 className="mb-4 fw-bold">Profesores</h2>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row>
            {profesores.length === 0 ? (
              <p className="text-center text-muted mt-5">
                No se encontraron profesores.
              </p>
            ) : (
              profesores.map((prof) => (
                <Col key={prof._id} md={6} lg={4} className="mb-4">
                  <Card
                    className="shadow-sm h-100 profesor-card"
                    onClick={() => handleCardClick(prof._id)}
                  >
                    <Card.Body>
                      <Card.Title>{prof.nombre}</Card.Title>
                      <Card.Subtitle className="text-muted mb-2">
                        Campus: {prof.campus}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>Cursos:</strong> {renderCursos(prof.cursos)}
                      </Card.Text>
                      <a
                        href={prof.linkUAI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark btn-sm"
                        onClick={(e) => e.stopPropagation()} // evita abrir detalle al clickear este link
                      >
                        Ver perfil UAI
                      </a>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}
