import React from 'react';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <div className="navbar__brand">
          <div className="navbar__logo" aria-hidden />
          <span className="navbar__title">UAI Profes</span>
        </div>

        <div className="navbar__links">
          <a href="/profesores" className="link">Buscar Profes</a>
          <a href="/asignaturas" className="link">Buscar Asignaturas</a>
          <a href="#como-funciona" className="link link--ghost">Cómo funciona</a>
        </div>

        <div className="navbar__auth">
          {user ? (
            <>
              <span className="user">{user.email}</span>
              <button className="btn btn--outline" onClick={onLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <a className="btn btn--solid" href="/login">Entrar</a>
          )}
        </div>
      </nav>
    </header>
  );
}
