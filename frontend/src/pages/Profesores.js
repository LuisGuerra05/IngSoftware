import React, { useEffect, useState } from "react";
import { getProfesores } from "../api/api";

function Profesores() {
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    getProfesores()
      .then(setProfesores)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Listado de Profesores</h2>
      <ul>
        {profesores.map((p) => (
          <li key={p._id}>
            <strong>{p.nombre}</strong> – {p.campus}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profesores;
