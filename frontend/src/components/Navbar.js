import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import "./Navbar.css";

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

  const handleLogoClick = () => {
    navigate("/");       // 🔹 Ir al home
    window.scrollTo(0, 0); // 🔹 Volver al inicio visualmente
  };

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
                Buscar Profesor
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/asignaturas"
                active={location.pathname === "/asignaturas"}
                onClick={handleNavClick}
                className="py-2"
              >
                Buscar Asignatura
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

      {/* 🔹 Modal perfil */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="text-center"
      >
        <Modal.Body className="p-4">
          <img
            src="/img/Logo.png"
            alt="Logo Calificador de Profesores"
            style={{ width: 110, height: "auto", marginBottom: 10 }}
          />

          <h5 className="mb-2 fw-semibold">Sesión activa</h5>

          <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
            <strong>{user.email}</strong>
          </p>

          <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
            Último acceso: {new Date().toLocaleDateString("es-CL")}{" "}
            {new Date().toLocaleTimeString("es-CL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="d-grid gap-2 mt-3">
            <Button onClick={handleLogout} className="boton-negro">
              Cerrar sesión
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AppNavbar;
