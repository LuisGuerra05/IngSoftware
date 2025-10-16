import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ModalAsignatura.css";

export default function ModalAsignatura({ show, handleClose, asignatura }) {
  const navigate = useNavigate();
  if (!asignatura) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="modal-asignatura"
      backdrop={true}
      keyboard={true}
    >
      <div className="modal-asignatura-header">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{asignatura.nombre}</Modal.Title>
        </Modal.Header>
      </div>

      <div className="modal-asignatura-body">
        <p className="modal-info">
          <strong>Código:</strong> {asignatura.codigo}
        </p>

        <h5 className="modal-subtitle">Profesores registrados</h5>

        {asignatura.profesores?.length ? (
          <ListGroup variant="flush" className="profesores-list">
            {asignatura.profesores.map((prof) => (
              <ListGroup.Item
                key={prof._id}
                className="profesor-item"
                onClick={() => {
                  handleClose();
                  navigate(`/detalle-profe/${prof._id}`);
                }}
              >
                <div className="profesor-nombre">{prof.nombre}</div>
                <div className="profesor-campus">{prof.campus}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted text-center mt-4">
            No hay profesores registrados para esta asignatura.
          </p>
        )}

        <div className="text-center mt-4">
        </div>
      </div>
    </Modal>
  );
}
