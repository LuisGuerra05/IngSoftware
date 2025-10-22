import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import "./Navbar.css";
import "./ModalPerfil.css"; // ✅ nuevo CSS para el modal de perfil

function AppNavbar() {
  const [show, setShow] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const lastScroll = useRef(window.scrollY);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Mostrar / ocultar navbar según scroll
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

  // Cerrar el collapse al cambiar de ruta
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const handleNavClick = () => setExpanded(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
                onClick={handleNavClick}
                className="py-2"
              >
                Profesores
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/asignaturas"
                active={location.pathname === "/asignaturas"}
                onClick={handleNavClick}
                className="py-2"
              >
                Asignaturas
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/mis-asignaturas"
                active={location.pathname === "/mis-asignaturas"}
                onClick={handleNavClick}
                className="py-2"
              >
                Mis Asignaturas
              </Nav.Link>
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
            <strong>{user.email}</strong>
          </p>

          <p className="perfil-fecha">
            Último acceso: {new Date().toLocaleDateString("es-CL")}{" "}
            {new Date().toLocaleTimeString("es-CL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

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
