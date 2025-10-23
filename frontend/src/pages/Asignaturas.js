import React, { useEffect, useState } from "react";
import { getCursos } from "../api/api";
import { Card, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import ModalAsignatura from "../components/modalAsignatura";

export default function Asignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    getCursos()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
        setCursos(sorted);
      })
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

  // 🔹 Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCursos = cursos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(cursos.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Container style={{ marginTop: 100 }}>
      <h2 className="mb-4 fw-bold">Asignaturas</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row>
            {cursos.length === 0 ? (
              <p className="text-center text-muted mt-5">
                No se encontraron asignaturas.
              </p>
            ) : (
              currentCursos.map((curso) => (
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
                      <Card.Text className="asignatura-profes">
                        <strong>Profesores:</strong>{" "}
                        <span className="badge-count">
                          {curso.profesores?.length || 0}
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* 🔹 Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
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
