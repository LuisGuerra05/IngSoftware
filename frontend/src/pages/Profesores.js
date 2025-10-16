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

  console.log("📊 Estado actual de profesores:", profesores);

  const handleCardClick = (id) => {
    navigate(`/detalle-profe/${id}`);
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
                        <strong>Cursos:</strong>{" "}
                        {prof.cursos?.map((c) => c.nombre).join(", ") ||
                          "Sin cursos"}
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
