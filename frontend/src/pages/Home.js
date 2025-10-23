import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import "./Home.css";
import { search } from "../api/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ profesores: [], cursos: [] });
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Buscando:", query);
  };

  // Efecto: buscar cuando query cambie (debounce)
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
        .then((data) => {
          setResults(data);
        })
        .catch((err) => console.error('Error search:', err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelectProfesor = (id) => {
    navigate(`/detalle-profe/${id}`);
  };

  const handleSelectCurso = (id) => {
    navigate(`/asignaturas`); // actualmente no hay detalle individual de curso
  };

  return (
    <Container className="home-page">
      <Row className="justify-content-center text-center">
        <Col xs={12} md={8}>
          <h1 className="home-title">Escoge mejor tu profesor</h1>
          <p className="home-subtitle">
            Centraliza evaluaciones y datos en un solo lugar.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Form
            onSubmit={handleSearch}
            className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 home-form"
          >
            <Form.Control
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por profesor o asignatura..."
              className="home-input"
            />
              <Button type="submit" className="home-btn">
                Buscar
              </Button>
          </Form>
            {/* Resultados en tiempo real */}
            <div className="search-results mt-2">
              {loading && (
                <div className="p-2 text-center"><Spinner animation="border" size="sm" /></div>
              )}

              {!loading && (results.profesores.length === 0 && results.cursos.length === 0) && query.trim() !== '' && (
                <div className="p-2 text-muted">No se encontraron resultados</div>
              )}

              {!loading && (results.profesores.length > 0 || results.cursos.length > 0) && (
                <ListGroup>
                  {results.profesores.map((p) => (
                    <ListGroup.Item key={`p-${p._id}`} action onClick={() => handleSelectProfesor(p._id)}>
                      Profesor: {p.nombre} <small className="text-muted">{p.campus}</small>
                    </ListGroup.Item>
                  ))}

                  {results.cursos.map((c) => (
                    <ListGroup.Item key={`c-${c._id}`} action onClick={() => handleSelectCurso(c._id)}>
                      Asignatura: {c.nombre} <small className="text-muted">{c.codigo}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
