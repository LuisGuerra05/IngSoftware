import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import "./Navbar.css";
import "./ModalPerfil.css";

function AppNavbar() {
  const [show, setShow] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const lastScroll = useRef(window.scrollY);
  const location = useLocation();
  const navigate = useNavigate();

  const usuarioEmail = localStorage.getItem("usuario") || "usuario@alumnos.uai.cl";
  const role = localStorage.getItem("role"); // 🔹 Rol del usuario

  // 🔹 Mostrar / ocultar navbar según scroll
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < lastScroll.current || current < 10) setShow(true);
      else setShow(false);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Cerrar el collapse al cambiar de ruta
  useEffect(() => setExpanded(false), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`navbar shadow-sm ${show ? "navbar-show" : "navbar-hide"}`}
        bg="white"
        variant="light"
        expanded={expanded}
        onToggle={(next) => setExpanded(next)}
        fixed="top"
      >
        <Container>
          {/* 🔹 Logo clickable */}
          <Navbar.Brand as={Link} to="/" onClick={() => window.scrollTo(0, 0)}>
            <img
              src="/img/Logo.png"
              alt="Logo Calificador de Profesores"
              className="navbar-logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          />

          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/profesores"
                active={location.pathname === "/profesores"}
                className="py-2"
              >
                Profesores
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/asignaturas"
                active={location.pathname === "/asignaturas"}
                className="py-2"
              >
                Asignaturas
              </Nav.Link>

              {/* 🔹 Solo visible para estudiantes */}
              {role !== "admin" && (
                <Nav.Link
                  as={Link}
                  to="/mis-asignaturas"
                  active={location.pathname === "/mis-asignaturas"}
                  className="py-2"
                >
                  Mis Asignaturas
                </Nav.Link>
              )}

              {/* 🔹 Solo visible para administradores */}
              {role === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/moderacion"
                  active={location.pathname === "/moderacion"}
                  className={`py-2 fw-bold ${
                    location.pathname === "/moderacion"
                      ? "text-primary"
                      : "text-dark-blue"
                  }`}
                  style={{
                    fontWeight: "600",
                    color:
                      location.pathname === "/moderacion"
                        ? "#005fa3"
                        : "#002b5c",
                  }}
                >
                  Moderación
                </Nav.Link>
              )}
            </Nav>

            {/* 🔹 Ícono perfil */}
            <div
              onClick={() => setShowModal(true)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Ver perfil"
            >
              <PersonCircle size={36} color="#333" />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔹 Modal Perfil estilizado */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="modal-perfil"
        backdrop={true}
        keyboard={true}
      >
        <div className="modal-perfil-header">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Perfil del Usuario</Modal.Title>
          </Modal.Header>
        </div>

        <div className="modal-perfil-body text-center">
          <img
            src="/img/Logo.png"
            alt="Logo Calificador de Profesores"
            className="perfil-logo"
          />

          <h5 className="perfil-titulo">Sesión activa</h5>

          <p className="perfil-email">
            <strong>{usuarioEmail}</strong>
          </p>

          {role && (
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Rol: <strong>{role}</strong>
            </p>
          )}

          <div className="text-center mt-4">
            <Button onClick={handleLogout} className="btn-cerrar-sesion">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AppNavbar;
