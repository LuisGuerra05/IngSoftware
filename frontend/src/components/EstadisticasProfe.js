import React, { useEffect, useState } from "react";
import { Spinner, Card } from "react-bootstrap";
import { getCalificacionesByProfesor } from "../api/api";
import { StarFill, Star } from "react-bootstrap-icons";
import "./EstadisticasProfe.css";

export default function EstadisticasProfe({ profesorId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCalificacionesByProfesor(profesorId)
      .then((data) => setStats(data))
      .catch(() => setError("No se pudieron cargar las calificaciones."))
      .finally(() => setLoading(false));
  }, [profesorId]);

  if (loading)
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" size="sm" />
        <p className="text-muted mt-2">Cargando calificaciones...</p>
      </div>
    );

  if (error) return <p className="text-danger text-center">{error}</p>;

  if (!stats || !stats.promedios)
    return (
      <p className="text-muted text-center">
        Aún no hay calificaciones registradas.
      </p>
    );

  const categorias = [
    { key: "claridadComunicacion", label: "Claridad y comunicación" },
    { key: "dominioContenido", label: "Dominio del contenido" },
    { key: "motivacion", label: "Motivación al enseñar" },
    { key: "exigenciaCarga", label: "Exigencia y carga de trabajo" },
    { key: "disponibilidadApoyo", label: "Disponibilidad y apoyo" },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarFill key={i} color="#fbbf24" />
        ) : (
          <Star key={i} color="#d1d5db" />
        )
      );
    }
    return stars;
  };

  return (
    <Card className="estadisticas-card">
      <Card.Body>
        <h5 className="estadisticas-titulo">Valoraciones promedio</h5>

        <div className="categorias-container">
          {categorias.map((cat) => {
            const valor = Math.round(stats.promedios[cat.key]);
            return (
              <div key={cat.key} className="categoria-item">
                <span className="categoria-nombre">{cat.label}</span>
                <div className="categoria-estrellas">
                  {renderStars(valor)}
                  <span className="categoria-puntaje">{valor}/5</span>
                </div>
              </div>
            );
          })}
        </div>

        <h6 className="comentarios-titulo text-center">
          Comentarios de estudiantes
        </h6>
        {stats.comentarios && stats.comentarios.length > 0 ? (
          <div className="comentarios-lista">
            {stats.comentarios.map((c, i) => (
              <div key={i} className="comentario-item">
                <p className="mb-1">“{c.comentario}”</p>
                <div className="comentario-fecha">
                  {new Date(c.fecha).toLocaleDateString("es-CL")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center mb-0">
            No hay comentarios disponibles.
          </p>
        )}
      </Card.Body>
    </Card>
  );
}
