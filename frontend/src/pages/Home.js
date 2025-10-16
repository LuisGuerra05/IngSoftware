import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
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
      <div className="text-center">
        <h1 className="home-title">
          Escoge mejor tu profesor
        </h1>
        <p className="home-subtitle">
          Centraliza evaluaciones y datos en un solo lugar.
        </p>

        <Form
          onSubmit={handleSearch}
          className="d-flex justify-content-center align-items-center gap-2 home-form"
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
      </div>
    </Container>
  );
}

export default Home;
