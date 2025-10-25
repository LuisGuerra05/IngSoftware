import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
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
  const [showConfirm, setShowConfirm] = useState(false); // 🔹 Sub-modal de confirmación

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
    try {
      if (calificacionExistente) {
        await axios.put(
          `/calificaciones/${calificacionExistente._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSuccess && onSuccess(true, "editar");
      } else {
        await axios.post(
          "/calificaciones",
          { ...formData, profesorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSuccess && onSuccess(true, "crear");
      }
      handleClose();
    } catch (err) {
      console.error("Error al guardar calificación:", err);
      onSuccess && onSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar con confirmación visual
  const handleDeleteConfirmed = async () => {
    setLoading(true);
    try {
      await axios.delete(`/calificaciones/${calificacionExistente._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess && onSuccess(true, "eliminar");
      setShowConfirm(false);
      handleClose();
    } catch (err) {
      console.error("Error al eliminar evaluación:", err);
      onSuccess && onSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const renderNumericRating = (name, label) => (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <div className="d-flex gap-2 mt-1 justify-content-start">
        {[1, 2, 3, 4, 5].map((num) => (
          <Button
            key={num}
            variant={formData[name] === num ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => handleRatingChange(name, num)}
            disabled={loading}
          >
            {num}
          </Button>
        ))}
      </div>
    </Form.Group>
  );

  return (
    <>
      {/* === Modal principal === */}
      <Modal show={show} onHide={handleClose} centered className="modal-calificacion">
        <Modal.Header closeButton>
          <Modal.Title>
            {calificacionExistente ? "Editar Evaluación" : "Evaluar Profesor"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-scroll">
          <div className="text-muted mb-2 small">
            Estás evaluando a <strong>{profesorNombre}</strong>.
          </div>

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
                disabled={loading}
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
                  onChange={() =>
                    setFormData({ ...formData, volveriaTomar: true })
                  }
                  disabled={loading}
                />
                <Form.Check
                  inline
                  label="No"
                  type="radio"
                  checked={formData.volveriaTomar === false}
                  onChange={() =>
                    setFormData({ ...formData, volveriaTomar: false })
                  }
                  disabled={loading}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Label className="fw-semibold">Dificultad percibida</Form.Label>
              <Form.Select
                name="dificultad"
                value={formData.dificultad}
                onChange={handleChange}
                disabled={loading}
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
              onClick={() => setShowConfirm(true)} // 🔹 Muestra modal de confirmación
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
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : calificacionExistente ? (
              "Actualizar"
            ) : (
              "Enviar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* === Sub-modal de confirmación elegante === */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
        className="modal-confirmacion"
      >
        <Modal.Body className="text-center p-4">
          <ExclamationTriangleFill
            size={50}
            className="text-warning mb-3 animate-pulse"
          />
          <h5 className="fw-bold mb-2">¿Eliminar tu evaluación?</h5>
          <p className="text-muted mb-4">
            Esta acción no se puede deshacer. Tu reseña será eliminada
            permanentemente del sistema.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="outline-danger"
              className="btn-eliminar-confirm"
              onClick={handleDeleteConfirmed}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Eliminando...
                </>
              ) : (
                "Eliminar definitivamente"
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
