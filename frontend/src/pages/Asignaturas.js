import React, { useEffect, useState } from "react";
import { getCursos } from "../api/api";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

export default function Asignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCursos()
      .then((data) => setCursos(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container style={{ marginTop: 100 }}>
      <h2 className="mb-4 fw-bold">Asignaturas</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {cursos.map((curso) => (
            <Col key={curso._id} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{curso.nombre}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    Código: {curso.codigo}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Profesor:</strong>{" "}
                    {curso.profesor ? curso.profesor.nombre : "No asignado"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
