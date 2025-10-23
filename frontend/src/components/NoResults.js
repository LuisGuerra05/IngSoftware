import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NoResults({ query, message = "No se encontraron resultados" }) {
  return (
    <div className="text-center mt-5 mb-5">
      <Card className="shadow-sm border-0 d-inline-block p-4" style={{ maxWidth: 400 }}>
        <div className="text-muted mb-3" style={{ fontSize: "2.5rem" }}>
          <i className="bi bi-search"></i>
        </div>
        <h5 className="fw-bold mb-2">{message}</h5>
        {query && (
          <p className="text-muted mb-0">
            No hay coincidencias para <strong>“{query}”</strong>.
          </p>
        )}
      </Card>
    </div>
  );
}
