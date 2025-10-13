import React, { useState } from "react";

function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Buscando:", query);
  };

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "0 auto",
        textAlign: "center",
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
        Escoge mejor tu{" "}
        <u style={{ textDecorationColor: "#e5e7eb" }}>profesor</u>
      </h1>

      <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 24 }}>
        Centraliza evaluaciones y datos en un solo lugar.
      </p>

      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 60,
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por profesor o asignatura..."
          style={{
            flex: 1,
            maxWidth: 600,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #d1d5db",
            outline: "none",
          }}
        />
        <button type="submit" className="boton-negro">
          Buscar
        </button>

      </form>
    </main>
  );
}

export default Home;