import React, { useEffect, useState } from "react";
import { Spinner, Card, ProgressBar } from "react-bootstrap";
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

  // ✅ Calcular cantidad total de evaluaciones reales (no solo comentarios)
  const totalEvaluaciones =
    stats.totalCalificaciones || // si algún día el backend lo renombra
    stats.totalResenas || // el nombre actual en tu backend
    stats.total || // fallback genérico
    0;

  return (
    <Card className="estadisticas-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="estadisticas-titulo mb-0">Valoraciones promedio</h5>

          {/* 🔹 Total de evaluaciones (reales) */}
          {totalEvaluaciones > 0 && (
            <div className="total-evaluaciones">
              <span className="fw-semibold">
                {totalEvaluaciones}{" "}
                {totalEvaluaciones === 1 ? "evaluación" : "evaluaciones"}
              </span>
            </div>
          )}
        </div>

        {/* ⭐ Categorías principales */}
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

        {/* ✅ Indicadores adicionales */}
        {stats.indicadores && (
          <div className="indicadores-container">
            {/* Volvería a tomar */}
            <div className="mb-3">
              <p className="mb-1 fw-semibold">¿Lo volverías a tomar?</p>
              <p className="text-primary mb-1">
                Sí: {stats.indicadores.volveriaTomar}%
              </p>
              <ProgressBar
                now={stats.indicadores.volveriaTomar}
                className="progress-bar-blue"
              />
            </div>

            {/* Nivel de dificultad */}
            <div>
              <p className="mb-2 fw-semibold">Nivel de dificultad percibida</p>
              {Object.entries(stats.indicadores.dificultad).map(
                ([nivel, porcentaje]) => (
                  <div key={nivel} className="mb-2">
                    <small className="text-capitalize">
                      {nivel}: {porcentaje}%
                    </small>
                    <ProgressBar now={porcentaje} className="progress-bar-blue" />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
