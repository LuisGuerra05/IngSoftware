import React, { useEffect, useState, useRef } from "react";
import { getProfesores } from "../api/api";
import { Card, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profesores.css";
import "./Home.css"; // reusar estilos del filtro del Home
import { search } from "../api/api";
import { Form, ListGroup } from "react-bootstrap";

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [campusFilter, setCampusFilter] = useState('all');
  const debounceRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Llamando a getProfesores()...");
    getProfesores()
      .then((data) => {
        console.log("✅ Profesores recibidos desde backend:", data);
        const sorted = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
  setProfesores(sorted);
  // inicializar campusFilter options a partir de datos
  const campuses = Array.from(new Set(sorted.map(p => p.campus).filter(Boolean)));
  setCampusList(campuses);
      })
      .catch((err) => {
        console.error("❌ Error obteniendo profesores:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Campus list
  const [campusList, setCampusList] = useState([]);

  // Buscar solo profesores desde el input (debounce)
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(query).then(data => {
        setSearchResults(data.profesores || []);
      }).catch(err => console.error('Error search profesores:', err));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleCardClick = (id) => {
    navigate(`/detalle-profe/${id}`);
  };

  // 🔹 Función para obtener cursos ordenados y limitados
  const renderCursos = (cursos = []) => {
    if (cursos.length === 0) return "Sin cursos";
    const sorted = [...cursos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );
    const mostrados = sorted.slice(0, 3).map((c) => c.nombre);
    const sufijo = cursos.length > 3 ? " ..." : "";
    return mostrados.join(", ") + sufijo;
  };

  // 🔹 Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProfesores = profesores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(profesores.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="profesores-page">
      <Container style={{ marginTop: 100 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0 fw-bold">Profesores</h2>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <Form className="d-flex gap-2">
              <Form.Control
                placeholder="Buscar profesores..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Form.Select
                className="home-filter-select"
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                style={{ maxWidth: 180 }}
              >
                <option value="all">Todos los campus</option>
                {campusList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Form>
            {/* sugerencias */}
            {query.trim() !== '' && searchResults.length > 0 && (
              <ListGroup className="mt-2">
                {searchResults.map(s => (
                  <ListGroup.Item key={s._id} action onClick={() => navigate(`/detalle-profe/${s._id}`)}>
                    {s.nombre} <small className="text-muted">{s.campus}</small>
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
              {profesores.length === 0 ? (
                <p className="text-center text-muted mt-5">
                  No se encontraron profesores.
                </p>
              ) : (
                  // Aplicar filtro por campus si corresponde y paginar
                  currentProfesores
                    .filter(p => campusFilter === 'all' ? true : p.campus === campusFilter)
                    .map((prof) => (
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver perfil UAI
                        </a>
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
      </Container>
    </div>
  );
}
