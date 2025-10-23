import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "../api/axiosInstance";
import "./ModalCalificacion.css";

export default function ModalCalificacion({
  show,
  handleClose,
  profesorId,
  profesorNombre,
  onSuccess,
}) {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    claridadComunicacion: 3,
    dominioContenido: 3,
    motivacion: 3,
    exigenciaCarga: 3,
    disponibilidadApoyo: 3,
    comentario: "",
    volveriaTomar: true,
    dificultad: "media",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRatingChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "/calificaciones",
        { ...formData, profesorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      onSuccess && onSuccess();
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar la calificación");
    } finally {
      setLoading(false);
    }
  };

  const renderNumericRating = (name, label) => (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <div className="d-flex gap-2 mt-1 justify-content-between">
        {[1, 2, 3, 4, 5].map((num) => (
          <Button
            key={num}
            variant={formData[name] === num ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => handleRatingChange(name, num)}
          >
            {num}
          </Button>
        ))}
      </div>
    </Form.Group>
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="modal-calificacion"
      scrollable
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Evaluar Profesor</Modal.Title>
          {profesorNombre && (
            <div className="text-white-50 mt-1 small">
              Estás evaluando a <strong>{profesorNombre}</strong>
            </div>
          )}
        </div>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">¡Calificación enviada con éxito!</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* 🔹 Calificaciones numéricas */}
          {renderNumericRating("claridadComunicacion", "Claridad al comunicar")}
          {renderNumericRating("dominioContenido", "Dominio del contenido")}
          {renderNumericRating("motivacion", "Motivación")}
          {renderNumericRating("exigenciaCarga", "Exigencia y carga de trabajo")}
          {renderNumericRating("disponibilidadApoyo", "Disponibilidad y apoyo")}

          {/* 🔹 Comentario */}
          <Form.Group className="mb-3 mt-2">
            <Form.Label className="fw-semibold">Comentario (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              name="comentario"
              rows={3}
              value={formData.comentario}
              onChange={handleChange}
              maxLength={500}
              placeholder="Comparte tu experiencia..."
            />
          </Form.Group>

          {/* 🔹 Volvería a tomar */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              ¿Volverías a tomar este curso con el profesor?
            </Form.Label>
            <div className="d-flex gap-3 mt-1">
              <Form.Check
                inline
                label="Sí"
                type="radio"
                name="volveriaTomar"
                value={true}
                checked={formData.volveriaTomar === true}
                onChange={() => setFormData({ ...formData, volveriaTomar: true })}
              />
              <Form.Check
                inline
                label="No"
                type="radio"
                name="volveriaTomar"
                value={false}
                checked={formData.volveriaTomar === false}
                onChange={() => setFormData({ ...formData, volveriaTomar: false })}
              />
            </div>
          </Form.Group>

          {/* 🔹 Dificultad */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Dificultad percibida</Form.Label>
            <Form.Select
              name="dificultad"
              value={formData.dificultad}
              onChange={handleChange}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </Form.Select>
          </Form.Group>

          {/* 🔹 Botón de envío */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Calificación"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
