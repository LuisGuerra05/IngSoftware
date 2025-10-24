import React, { useEffect, useState } from "react";
import { getCursos, getCursoById, getMisRamos, saveMisRamos } from "../api/api";
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
  Pagination,
  Form,
} from "react-bootstrap";
import ModalAsignatura from "../components/modalAsignatura";
import "./MisAsignaturas.css";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import NoResults from "../components/NoResults";

export default function MisAsignaturas() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [misRamos, setMisRamos] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [query, setQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const MAX_RAMOS = 8;

  // 🔹 Usuario
  const usuarioEmail = localStorage.getItem("usuario") || "usuario@alumnos.uai.cl";
  const token = localStorage.getItem("token");

  // 🔹 Cargar cursos y ramos del usuario
  useEffect(() => {
    async function cargarDatos() {
      try {
        const dataCursos = await getCursos();
        const sorted = [...dataCursos].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
        setCursos(sorted);

        if (token) {
          const ramosBD = await getMisRamos(token);
          if (ramosBD && ramosBD.length > 0) {
            setMisRamos(ramosBD);
            localStorage.setItem("misRamos", JSON.stringify(ramosBD));
            setModoSeleccion(false);
          } else {
            setModoSeleccion(true);
          }
        } else {
          const ramosLocal = JSON.parse(localStorage.getItem("misRamos") || "[]");
          setMisRamos(ramosLocal);
          setModoSeleccion(ramosLocal.length === 0);
        }
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, [token]);

  // 🔹 Normalizar texto para búsqueda
  const normalize = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  // 🔹 Filtrar localmente
  const dataToShow = modoSeleccion ? cursos : misRamos;
  const filteredCursos = dataToShow.filter(
    (c) =>
      normalize(c.nombre).includes(normalize(query)) ||
      normalize(c.codigo).includes(normalize(query))
  );

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
  const paginatedCursos = filteredCursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Modal de detalle
  const handleOpenModal = async (curso) => {
    try {
      const cursoCompleto = await getCursoById(curso._id);
      setCursoSeleccionado(cursoCompleto);
    } catch {
      setCursoSeleccionado(curso);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCursoSeleccionado(null);
  };

  // 🔹 Selección de ramos
  const estaSeleccionado = (cursoId) => misRamos.some((r) => r._id === cursoId);

  const handleSeleccionarRamo = (curso) => {
    if (misRamos.find((r) => r._id === curso._id)) {
      const nuevos = misRamos.filter((r) => r._id !== curso._id);
      setMisRamos(nuevos);
      localStorage.setItem("misRamos", JSON.stringify(nuevos));
    } else if (misRamos.length < MAX_RAMOS) {
      const nuevos = [...misRamos, curso];
      setMisRamos(nuevos);
      localStorage.setItem("misRamos", JSON.stringify(nuevos));
    }
  };

  // 🔹 Confirmar selección (guardar en BD)
  const handleConfirmarSeleccion = async () => {
    if (misRamos.length > 0) {
      try {
        if (token) {
          const ids = misRamos.map((r) => r._id);
          await saveMisRamos(token, ids);
        }
      } catch (err) {
        console.error("❌ Error guardando ramos:", err);
      }
      setModoSeleccion(false);
      setCurrentPage(1);
    }
  };

  // 🔹 Limpiar ramos
  const handleLimpiarRamos = () => setShowConfirmModal(true);
  const confirmarLimpiar = async () => {
    try {
      if (token) await saveMisRamos(token, []);
    } catch (err) {
      console.error("❌ Error al limpiar ramos:", err);
    }
    setMisRamos([]);
    localStorage.removeItem("misRamos");
    setModoSeleccion(true);
    setShowConfirmModal(false);
    setCurrentPage(1);
  };

  return (
    <Container style={{ marginTop: 100, marginBottom: 50 }}>
      {/* 🔹 Encabezado responsivo */}
      <Row className="align-items-center mb-4 gy-3">
        <Col xs={12} md="auto" className="text-md-start text-center">
          <h2 className="fw-bold mb-0">Mis Asignaturas</h2>
        </Col>

        {modoSeleccion && (
          <Col xs={12} md={6} lg={5} className="ms-md-auto">
            <Form
              className="d-flex gap-2 justify-content-center justify-content-md-end"
              onSubmit={(e) => e.preventDefault()}
            >
              <Form.Control
                type="text"
                placeholder="Buscar asignaturas..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="shadow-sm"
              />
              {query && (
                <Button variant="outline-secondary" onClick={() => setQuery("")}>
                  Limpiar
                </Button>
              )}
            </Form>
          </Col>
        )}

        {!modoSeleccion && misRamos.length > 0 && (
          <Col xs={12} md="auto" className="text-center text-md-end">
            <Button className="btn-limpiar-ramos" onClick={handleLimpiarRamos}>
              Limpiar Ramos
            </Button>
          </Col>
        )}
      </Row>

      {!modoSeleccion && misRamos.length > 0 && (
        <p className="text-muted mb-4">
          Bienvenido <strong>{usuarioEmail}</strong>, a tus ramos este semestre.
        </p>
      )}

      {/* 🔹 Contenido principal */}
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : modoSeleccion ? (
        <>
          <Alert variant="info" className="mb-4">
            <strong>Selecciona tus asignaturas</strong> (máximo {MAX_RAMOS} ramos)
            <br />
            Haz clic en las tarjetas para seleccionar o deseleccionar. Has seleccionado:{" "}
            <strong>
              {misRamos.length}/{MAX_RAMOS}
            </strong>
          </Alert>
          <Row>
            {filteredCursos.length === 0 ? (
              <NoResults
                query={query}
                message="No se encontraron asignaturas disponibles"
              />
            ) : (
              paginatedCursos.map((curso) => {
                const seleccionado = estaSeleccionado(curso._id);
                return (
                  <Col key={curso._id} md={6} lg={4} className="mb-4">
                    <Card
                      className={`shadow-sm h-100 cursor-pointer ${
                        seleccionado ? "border-success border-3" : ""
                      }`}
                      onClick={() => handleSeleccionarRamo(curso)}
                      style={{
                        opacity:
                          !seleccionado && misRamos.length >= MAX_RAMOS ? 0.5 : 1,
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
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
          {misRamos.length > 0 && (
            <div className="text-center mt-4">
              <Button
                className="btn-limpiar-ramos"
                size="lg"
                onClick={handleConfirmarSeleccion}
              >
                Confirmar Selección
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {misRamos.length === 0 ? (
            <div className="text-center mt-5">
              <p className="text-muted">No has seleccionado ninguna asignatura aún.</p>
              <Button variant="primary" onClick={() => setModoSeleccion(true)}>
                Seleccionar Asignaturas
              </Button>
            </div>
          ) : (
            <>
              <Row>
                {filteredCursos.length === 0 ? (
                  <p className="text-center text-muted mt-5">
                    No se encontraron asignaturas.
                  </p>
                ) : (
                  paginatedCursos.map((curso) => (
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
                  ))
                )}
              </Row>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modal Detalle */}
      <ModalAsignatura
        show={showModal}
        handleClose={handleCloseModal}
        asignatura={cursoSeleccionado}
      />

      {/* Modal Confirmación */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
        className="modal-confirmacion"
      >
        <Modal.Body className="text-center p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill text-warning mb-3 animate-pulse"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>

          <h5 className="fw-bold mb-2">¿Eliminar todas tus asignaturas?</h5>
          <p className="text-muted mb-4">
            Esta acción eliminará todos los ramos seleccionados y no se puede deshacer.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="outline-danger"
              className="btn-eliminar-confirm"
              onClick={confirmarLimpiar}
            >
              Sí, limpiar todo
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
