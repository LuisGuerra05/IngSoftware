import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ModalAsignatura({ show, handleClose, asignatura }) {
  const navigate = useNavigate();

  if (!asignatura) return null; // si aún no hay asignatura seleccionada

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{asignatura.nombre}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <strong>Código:</strong> {asignatura.codigo}
        </p>

        <p>
          <strong>Profesores:</strong>
        </p>
        {asignatura.profesores?.length ? (
          <ListGroup>
            {asignatura.profesores.map((prof) => (
              <ListGroup.Item
                key={prof._id}
                action
                onClick={() => {
                  handleClose();
                  navigate(`/detalle-profe/${prof._id}`);
                }}
              >
                {prof.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted">No hay profesores registrados.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
