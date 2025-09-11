import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Heurística simple: si parece código de ramo, manda a /asignaturas; si no, a /profesores
    const isCourseCode = /[A-Za-z]{2,}\\d{3,}/.test(query);
    const target = isCourseCode
      ? `/asignaturas?q=${encodeURIComponent(query)}`
      : `/profesores?q=${encodeURIComponent(query)}`;
    window.location.href = target;
  };

  const solidBtn = {
    padding: '10px 14px', borderRadius: 12, background: '#111',
    color: '#fff', border: '1px solid #111', cursor: 'pointer', textDecoration: 'none'
  };
  const outlineBtn = {
    padding: '10px 14px', borderRadius: 12, background: '#fff',
    color: '#111', border: '1px solid #d1d5db', cursor: 'pointer', textDecoration: 'none'
  };
  const chipBtn = {
    padding: '8px 12px', borderRadius: 999, background: '#fff',
    color: '#111', border: '1px solid #e5e7eb', cursor: 'pointer', textDecoration: 'none'
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', color: '#111' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 16px' }}>
        {/* Hero */}
        <section>
          <h1 style={{ fontSize: 36, lineHeight: 1.2, margin: 0 }}>
            Decide mejor tu <u style={{ textDecorationColor: '#e5e7eb' }}>profe</u> y tu <u style={{ textDecorationColor: '#e5e7eb' }}>ramo</u>
          </h1>
          <p style={{ marginTop: 8, color: '#6b7280', fontSize: 16 }}>
            Centraliza evaluaciones y datos en un solo lugar.
          </p>

          {/* Buscador */}
          <form onSubmit={handleSearch} role="search" aria-label="Buscar"
                style={{ display: 'flex', gap: 8, maxWidth: 800, marginTop: 16 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por profesor o asignatura…"
              style={{
                flex: 1, padding: '12px 14px', borderRadius: 12,
                border: '1px solid #d1d5db', outline: 'none'
              }}
            />
            <button type="submit" style={solidBtn}>Buscar</button>
          </form>

          {/* Chips rápidos */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <a style={chipBtn} href="/profesores?campus=PE">Peñalolén</a>
            <a style={chipBtn} href="/profesores?campus=VI">Viña</a>
            <a style={chipBtn} href="/asignaturas?tipo=obligatorio">Obligatorio</a>
            <a style={chipBtn} href="/asignaturas?tipo=electivo">Electivo</a>
          </div>

          {!user && (
            <div style={{
              marginTop: 16, padding: 12, border: '1px dashed #e5e7eb',
              borderRadius: 12, color: '#6b7280', fontSize: 14
            }}>
              Para guardar favoritos y opinar, <a href="/login" style={{ color: '#111' }}>inicia sesión</a>.
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <a href="/profesores" style={solidBtn}>Buscar Profes</a>
            <a href="/asignaturas" style={outlineBtn}>Buscar Asignaturas</a>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Cómo funciona</h2>
          <div style={{
            display: 'grid', gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
          }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 }}>
              <p><strong>1)</strong> Busca por profe o ramo</p>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Usa el buscador o atajos.</p>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 }}>
              <p><strong>2)</strong> Filtra por campus y escuela</p>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Resultados más precisos.</p>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 }}>
              <p><strong>3)</strong> Lee métricas y comentarios</p>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Promedio, % aprobación y estilo.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
