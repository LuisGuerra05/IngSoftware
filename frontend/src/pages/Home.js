import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Buscando:", query);
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
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
