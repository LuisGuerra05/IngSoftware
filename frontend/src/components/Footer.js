import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__brand">
            <div className="footer__logo" aria-hidden />
            <span className="footer__title">UAI Profes</span>
          </div>
          <p className="muted">
            Decide mejor tu profe y tu ramo. Datos claros, decisiones rápidas.
          </p>
        </div>

        <div>
          <p className="heading">Enlaces</p>
          <ul className="list">
            <li><a href="/profesores">Profesores</a></li>
            <li><a href="/asignaturas">Asignaturas</a></li>
            <li><a href="#como-funciona">Cómo funciona</a></li>
          </ul>
        </div>

        <div>
          <p className="heading">Legal</p>
          <ul className="list">
            <li><a href="#">Términos</a></li>
            <li><a href="#">Privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__copy">© 2025</div>
    </footer>
  );
}
