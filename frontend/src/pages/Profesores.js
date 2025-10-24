import React, { useEffect, useState } from "react";
import { getProfesores } from "../api/api";
import { Card, Container, Row, Col, Spinner, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profesores.css";
import "./Home.css";
import NoResults from "../components/NoResults";

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [campusList, setCampusList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    getProfesores()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
        setProfesores(sorted);
        const campuses = Array.from(new Set(sorted.map((p) => p.campus).filter(Boolean)));
        setCampusList(campuses);
      })
      .catch((err) => console.error("❌ Error obteniendo profesores:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Normalizar texto y filtrar
  const normalize = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const filteredProfesores = profesores.filter((p) => {
    const matchesQuery = normalize(p.nombre).includes(normalize(query));
    const matchesCampus = campusFilter === "all" || p.campus === campusFilter;
    return matchesQuery && matchesCampus;
  });

  const paginatedProfesores = filteredProfesores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProfesores.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleCardClick = (id) => navigate(`/detalle-profe/${id}`);

  const renderCursos = (cursos = []) => {
    if (cursos.length === 0) return "Sin cursos";
    const sorted = [...cursos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );
    const mostrados = sorted.slice(0, 3).map((c) => c.nombre);
    const sufijo = cursos.length > 3 ? " ..." : "";
    return mostrados.join(", ") + sufijo;
  };

  return (
    <div className="profesores-page">
      <Container style={{ marginTop: 100 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0 fw-bold">Profesores</h2>
          <div style={{ maxWidth: 480, width: "100%" }}>
            <Form
              className="d-flex gap-2"
              onSubmit={(e) => e.preventDefault()} // 🔹 Evita refresco con Enter
            >
              <Form.Control
                placeholder="Buscar profesores..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Form.Select
                className="home-filter-select"
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                style={{ maxWidth: 180 }}
              >
                <option value="all">Todos los campus</option>
                {campusList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
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
              {filteredProfesores.length === 0 ? (
                <NoResults query={query} message="No se encontraron profesores" />
              ) : (
                paginatedProfesores.map((prof) => (
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
                        {prof.linkUAI ? (
                          <a
                            href={prof.linkUAI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-dark btn-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver perfil UAI
                          </a>
                        ) : (
                          <button className="btn btn-secondary btn-sm" disabled>
                            Sin perfil UAI
                          </button>
                        )}
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
      </Container>
    </div>
  );
}
