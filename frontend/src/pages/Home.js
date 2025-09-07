import React from 'react';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Página principal</h1>
      <p>Bienvenido{user ? `, ${user.email}` : ''}.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
