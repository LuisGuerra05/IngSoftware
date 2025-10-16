import React, { useEffect, useState } from "react";
import { getCursos } from "../api/api";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import ModalAsignatura from "../components/modalAsignatura";

export default function Asignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  useEffect(() => {
    getCursos()
      .then((data) => setCursos(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (curso) => {
    setCursoSeleccionado(curso);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCursoSeleccionado(null);
  };

  return (
    <Container style={{ marginTop: 100 }}>
      <h2 className="mb-4 fw-bold">Asignaturas</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {cursos.length === 0 ? (
            <p className="text-center text-muted mt-5">
              No se encontraron asignaturas.
            </p>
          ) : (
            cursos.map((curso) => (
              <Col key={curso._id} md={6} lg={4} className="mb-4">
                <Card
                  className="shadow-sm h-100 cursor-pointer"
                  onClick={() => handleOpenModal(curso)}
                >
                  <Card.Body>
                    <Card.Title>{curso.nombre}</Card.Title>
                    <Card.Subtitle className="text-muted mb-2">
                      Código: {curso.codigo}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Profesores registrados:</strong>{" "}
                      {curso.profesores?.length || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      {/* Modal con detalle */}
      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />
    </Container>
  );
}
