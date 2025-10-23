import React, { useEffect, useState } from "react";
import { getCursos } from "../api/api";
import { Card, Container, Row, Col, Spinner, Pagination, Form, Button } from "react-bootstrap";
import ModalAsignatura from "../components/modalAsignatura";
import { useLocation } from "react-router-dom";
import "./Home.css";
import NoResults from "../components/NoResults";

export default function Asignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
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

  // 🔹 Filtro local
  const normalize = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const filteredCursos = cursos.filter(
    (c) =>
      normalize(c.nombre).includes(normalize(query)) ||
      normalize(c.codigo).includes(normalize(query))
  );

  const paginatedCursos = filteredCursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id && cursos.length > 0) {
      const found = cursos.find((c) => c._id === id);
      if (found) {
        setCursoSeleccionado(found);
        setShowModal(true);
      }
    }
  }, [location.search, cursos]);

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
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0 fw-bold">Asignaturas</h2>
        <div style={{ maxWidth: 420, width: "100%" }}>
          <Form className="d-flex gap-2">
            <Form.Control
              placeholder="Buscar asignaturas..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {query && (
              <Button variant="outline-secondary" onClick={() => setQuery("")}>
                Limpiar
              </Button>
            )}
          </Form>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row>
            {filteredCursos.length === 0 ? (
              <NoResults query={query} message="No se encontraron asignaturas" />
            ) : (
              paginatedCursos.map((curso) => (
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

      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />
    </Container>
  );
}
