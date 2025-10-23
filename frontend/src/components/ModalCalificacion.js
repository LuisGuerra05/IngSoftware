import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "../api/axiosInstance";
import "./ModalCalificacion.css";

export default function ModalCalificacion({
  show,
  handleClose,
  profesorId,
  profesorNombre,
  calificacionExistente,
  onSuccess,
}) {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    claridadComunicacion: null,
    dominioContenido: null,
    motivacion: null,
    exigenciaCarga: null,
    disponibilidadApoyo: null,
    comentario: "",
    volveriaTomar: true,
    dificultad: "media",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (calificacionExistente) {
      setFormData({
        claridadComunicacion: calificacionExistente.claridadComunicacion,
        dominioContenido: calificacionExistente.dominioContenido,
        motivacion: calificacionExistente.motivacion,
        exigenciaCarga: calificacionExistente.exigenciaCarga,
        disponibilidadApoyo: calificacionExistente.disponibilidadApoyo,
        comentario: calificacionExistente.comentario || "",
        volveriaTomar: calificacionExistente.volveriaTomar,
        dificultad: calificacionExistente.dificultad,
      });
    } else {
      // Reiniciar en caso de abrir el modal vacío
      setFormData({
        claridadComunicacion: null,
        dominioContenido: null,
        motivacion: null,
        exigenciaCarga: null,
        disponibilidadApoyo: null,
        comentario: "",
        volveriaTomar: true,
        dificultad: "media",
      });
    }
  }, [calificacionExistente, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleRatingChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (calificacionExistente) {
        await axios.put(
          `/calificaciones/${calificacionExistente._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/calificaciones",
          { ...formData, profesorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSuccess(true);
      onSuccess && onSuccess();
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la calificación");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("¿Seguro que deseas eliminar tu evaluación de este profesor?")
    ) {
      try {
        await axios.delete(`/calificaciones/${calificacionExistente._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess && onSuccess();
        handleClose();
      } catch {
        alert("Error al eliminar la evaluación");
      }
    }
  };

  const renderNumericRating = (name, label) => (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <div className="d-flex gap-2 mt-1 justify-content-start">
        {[1, 2, 3, 4, 5].map((num) => (
          <Button
            key={num}
            variant={
              formData[name] === num ? "primary" : "outline-primary"
            }
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
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>
            {calificacionExistente ? "Editar Evaluación" : "Evaluar Profesor"}
          </Modal.Title>
          <div className="text-white-50 mt-1 small">
            {calificacionExistente
              ? `Editando tu evaluación de ${profesorNombre}`
              : `Estás evaluando a ${profesorNombre}`}
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="modal-body-scroll">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            {calificacionExistente
              ? "Evaluación actualizada correctamente"
              : "Calificación enviada con éxito"}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {renderNumericRating("claridadComunicacion", "Claridad al comunicar")}
          {renderNumericRating("dominioContenido", "Dominio del contenido")}
          {renderNumericRating("motivacion", "Motivación")}
          {renderNumericRating("exigenciaCarga", "Exigencia y carga de trabajo")}
          {renderNumericRating("disponibilidadApoyo", "Disponibilidad y apoyo")}

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

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              ¿Volverías a tomar este curso con el profesor?
            </Form.Label>
            <div className="d-flex gap-3 mt-1">
              <Form.Check
                inline
                label="Sí"
                type="radio"
                checked={formData.volveriaTomar === true}
                onChange={() => setFormData({ ...formData, volveriaTomar: true })}
              />
              <Form.Check
                inline
                label="No"
                type="radio"
                checked={formData.volveriaTomar === false}
                onChange={() => setFormData({ ...formData, volveriaTomar: false })}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-0">
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
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-fixed">
        {calificacionExistente && (
          <Button
            variant="outline-danger"
            type="button"
            onClick={handleDelete}
            disabled={loading}
          >
            Eliminar
          </Button>
        )}
        <Button
          variant="primary"
          type="submit"
          form="form-calificacion"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : calificacionExistente
            ? "Actualizar"
            : "Enviar Calificación"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
