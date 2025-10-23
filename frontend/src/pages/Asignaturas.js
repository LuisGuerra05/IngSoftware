import React, { useEffect, useState, useRef } from "react";
import { getCursos } from "../api/api";
import { Card, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import ModalAsignatura from "../components/modalAsignatura";
import { useLocation } from "react-router-dom";
import { search } from "../api/api";
import { Form, ListGroup, Button } from "react-bootstrap";
import "./Home.css";

export default function Asignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);
  const [courseFilterId, setCourseFilterId] = useState(null);

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

  // buscar solo cursos para sugerencias
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(query).then(data => setSuggestions(data.cursos || [])).catch(err => console.error(err));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const applyCourseFilter = (id) => {
    setCourseFilterId(id);
    setQuery('');
    setSuggestions([]);
    setCurrentPage(1);
  };

  const clearCourseFilter = () => setCourseFilterId(null);

  // Abrir modal si existe query param ?id=
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id && cursos.length > 0) {
      const found = cursos.find(c => c._id === id);
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

  // 🔹 Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCursos = cursos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(cursos.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Container style={{ marginTop: 100 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0 fw-bold">Asignaturas</h2>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <Form className="d-flex gap-2">
            <Form.Control
              placeholder="Buscar asignaturas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {courseFilterId && (
              <Button variant="outline-secondary" onClick={clearCourseFilter}>
                Limpiar filtro
              </Button>
            )}
          </Form>
          {query.trim() !== '' && suggestions.length > 0 && (
            <ListGroup className={`mt-2 suggestion-list ${suggestions.length > 3 ? 'scrollable' : ''}`}>
              {suggestions.map(s => (
                <ListGroup.Item key={s._id} action onClick={() => applyCourseFilter(s._id)}>
                  {s.nombre} <small className="text-muted">{s.codigo}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </div>

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
              (courseFilterId ? cursos.filter(c => c._id === courseFilterId) : currentCursos).map((curso) => (
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
