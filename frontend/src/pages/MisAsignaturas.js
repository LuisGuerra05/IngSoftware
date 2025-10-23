import React, { useEffect, useState } from "react";
import { getCursos } from "../api/api";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Modal,
  Badge,
  Alert,
} from "react-bootstrap";
import ModalAsignatura from "../components/modalAsignatura";
import "./MisAsignaturas.css";

export default function MisAsignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [misRamos, setMisRamos] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const MAX_RAMOS = 8;

  // 🔹 Obtener email del usuario logeado desde localStorage
  const usuarioEmail = localStorage.getItem("usuario") || "usuario@alumnos.uai.cl";

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = modoSeleccion
    ? cursos.slice(indexOfFirstItem, indexOfLastItem)
    : misRamos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (modoSeleccion ? cursos.length : misRamos.length) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Cargar ramos guardados del usuario
  useEffect(() => {
    const ramosGuardados = JSON.parse(localStorage.getItem("misRamos") || "[]");
    setMisRamos(ramosGuardados);
    setModoSeleccion(ramosGuardados.length === 0);
  }, []);

  // 🔹 Cargar todos los cursos disponibles
  useEffect(() => {
    getCursos()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
        setCursos(sorted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (curso) => {
    setCursoSeleccionado(curso);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCursoSeleccionado(null);
  };

  const handleSeleccionarRamo = (curso) => {
    if (misRamos.find((r) => r._id === curso._id)) {
      const nuevosRamos = misRamos.filter((r) => r._id !== curso._id);
      setMisRamos(nuevosRamos);
      localStorage.setItem("misRamos", JSON.stringify(nuevosRamos));
    } else {
      if (misRamos.length < MAX_RAMOS) {
        const nuevosRamos = [...misRamos, curso];
        setMisRamos(nuevosRamos);
        localStorage.setItem("misRamos", JSON.stringify(nuevosRamos));
      }
    }
  };

  const handleConfirmarSeleccion = () => {
    if (misRamos.length > 0) {
      setModoSeleccion(false);
      setCurrentPage(1);
    }
  };

  const handleLimpiarRamos = () => {
    setShowConfirmModal(true);
  };

  const confirmarLimpiar = () => {
    setMisRamos([]);
    localStorage.removeItem("misRamos");
    setModoSeleccion(true);
    setShowConfirmModal(false);
    setCurrentPage(1);
  };

  const estaSeleccionado = (cursoId) => {
    return misRamos.some((r) => r._id === cursoId);
  };

  // 🔹 Render principal
  return (
    <Container style={{ marginTop: 100, marginBottom: 50 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Mis Asignaturas</h2>
        {!modoSeleccion && misRamos.length > 0 && (
          <Button className="btn-limpiar-ramos" onClick={handleLimpiarRamos}>
            Limpiar Ramos
          </Button>
        )}
      </div>

      {/* 👋 Mensaje personalizado con email */}
      {!modoSeleccion && misRamos.length > 0 && (
        <p className="text-muted mb-4">
          Bienvenido <strong>{usuarioEmail}</strong>, a tus ramos este semestre.
        </p>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {modoSeleccion ? (
            <>
              <Alert variant="info" className="mb-4">
                <strong>Selecciona tus asignaturas</strong> (máximo {MAX_RAMOS} ramos)
                <br />
                Haz clic en las tarjetas para seleccionar o deseleccionar.{" "}
                Has seleccionado: <strong>{misRamos.length}/{MAX_RAMOS}</strong>
              </Alert>

              <Row>
                {cursos.length === 0 ? (
                  <p className="text-center text-muted mt-5">
                    No se encontraron asignaturas disponibles.
                  </p>
                ) : (
                  currentItems.map((curso) => {
                    const seleccionado = estaSeleccionado(curso._id);
                    return (
                      <Col key={curso._id} md={6} lg={4} className="mb-4">
                        <Card
                          className={`shadow-sm h-100 cursor-pointer ${
                            seleccionado ? "border-success border-3" : ""
                          }`}
                          onClick={() => handleSeleccionarRamo(curso)}
                          style={{
                            cursor: "pointer",
                            opacity:
                              !seleccionado && misRamos.length >= MAX_RAMOS
                                ? 0.5
                                : 1,
                            position: "relative",
                          }}
                        >
                          <Card.Body>
                            {seleccionado && (
                              <Badge
                                bg="success"
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                }}
                              >
                                ✓ Seleccionado
                              </Badge>
                            )}
                            <Card.Title>{curso.nombre}</Card.Title>
                            <Card.Subtitle className="text-muted mb-2">
                              Código: {curso.codigo}
                            </Card.Subtitle>
                            <Card.Text className="asignatura-profes">
                              <strong>Profesores:</strong>{" "}
                              <span className="badge-count">
                                {curso.profesores?.length || 0}
                              </span>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })
                )}
              </Row>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <Button
                          variant="link"
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {misRamos.length > 0 && (
                <div className="text-center mt-4">
                  <Button
                    className="btn-limpiar-ramos"
                    size="lg"
                    onClick={handleConfirmarSeleccion}
                  >
                    Confirmar Selección ({misRamos.length} ramos)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {misRamos.length === 0 ? (
                <div className="text-center mt-5">
                  <p className="text-muted">
                    No has seleccionado ninguna asignatura aún.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setModoSeleccion(true)}
                  >
                    Seleccionar Asignaturas
                  </Button>
                </div>
              ) : (
                <>
                  <Row>
                    {currentItems.map((curso) => (
                      <Col key={curso._id} md={6} lg={4} className="mb-4">
                        <Card
                          className="shadow-sm h-100 cursor-pointer"
                          onClick={() => handleOpenModal(curso)}
                        >
                          <Card.Body>
                            <Card.Title>{curso.nombre}</Card.Title>
                            <Card.Subtitle className="text-muted mb-2">
                              Código: {curso.codigo}
                            </Card.Subtitle>
                            <Card.Text className="asignatura-profes">
                              <strong>Profesores:</strong>{" "}
                              <span className="badge-count">
                                {curso.profesores?.length || 0}
                              </span>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li
                            key={i}
                            className={`page-item ${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                          >
                            <Button
                              variant="link"
                              className="page-link"
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Modal con detalle del curso */}
      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />

      {/* Modal de confirmación */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Limpieza</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar todas tus asignaturas
          seleccionadas? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarLimpiar}>
            Sí, Limpiar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
