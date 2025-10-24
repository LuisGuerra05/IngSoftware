import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Spinner,
  Card,
} from "react-bootstrap";
import "./Home.css";
import { search } from "../api/api";
import { useNavigate } from "react-router-dom";
import NoResults from "../components/NoResults";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ profesores: [], cursos: [] });
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Búsqueda con debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ profesores: [], cursos: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(query)
        .then((data) => setResults(data))
        .catch((err) => console.error("Error search:", err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
  };

  const handleSelectProfesor = (id) => navigate(`/detalle-profe/${id}`);
  const handleSelectCurso = (id) => navigate(`/asignaturas?id=${id}`);

  const filteredProfesores =
    filterType === "profesores"
      ? results.profesores
      : filterType === "cursos"
      ? []
      : results.profesores;

  const filteredCursos =
    filterType === "cursos"
      ? results.cursos
      : filterType === "profesores"
      ? []
      : results.cursos;

  return (
    <Container className="home-page">
      <Row className="justify-content-center text-center mb-4">
        <Col xs={12} md={8}>
          <h1 className="home-title fw-bold">Escoge mejor tu profesor</h1>
          <p className="home-subtitle text-muted">
            Centraliza evaluaciones y datos en un solo lugar.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Form onSubmit={handleSearch} className="home-form">
            {/* Contenedor flex que alinea filtro + input + botón */}
            <div className="home-search-wrapper">
              {/* Filtro */}
              <Form.Select
                className="home-filter-select shadow-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="profesores">Profesores</option>
                <option value="cursos">Asignaturas</option>
              </Form.Select>

              {/* Input */}
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por profesor o asignatura..."
                className="home-input shadow-sm"
              />

              {/* Botón (oculto en móvil) */}
              <Button type="submit" className="home-btn d-none d-md-block">
                <i className="bi bi-search"></i> Buscar
              </Button>
            </div>
          </Form>


          {/* Resultados */}
          <div className="search-results mt-3">
            {loading && (
              <div className="p-3 text-center text-muted">
                <Spinner animation="border" size="sm" /> Buscando...
              </div>
            )}

            {!loading &&
              query.trim() !== "" &&
              filteredProfesores.length === 0 &&
              filteredCursos.length === 0 && <NoResults query={query} />}

            {!loading && (filteredProfesores.length > 0 || filteredCursos.length > 0) && (
              <Card className="shadow-sm border-0 mt-2">
                <ListGroup variant="flush">
                  {filteredProfesores.map((p) => (
                    <ListGroup.Item
                      key={`p-${p._id}`}
                      action
                      onClick={() => handleSelectProfesor(p._id)}
                      className="py-2 d-flex justify-content-between align-items-center search-item"
                    >
                      <div>
                        <i className="bi bi-person-circle me-2 icon-blue"></i>
                        {p.nombre}
                      </div>
                      <small className="text-muted">{p.campus}</small>
                    </ListGroup.Item>
                  ))}

                  {filteredCursos.map((c) => (
                    <ListGroup.Item
                      key={`c-${c._id}`}
                      action
                      onClick={() => handleSelectCurso(c._id)}
                      className="py-2 d-flex justify-content-between align-items-center search-item"
                    >
                      <div>
                        <i className="bi bi-journal-bookmark me-2 icon-blue"></i>
                        {c.nombre}
                      </div>
                      <small className="text-muted">{c.codigo}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
