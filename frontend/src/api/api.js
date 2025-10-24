import axios from "./axiosInstance";

// --- Autenticación ---
export async function login(email, password) {
  const { data } = await axios.post("/login", { email, password });
  return data; // { ok, token, user }
}

export async function getMe() {
  const { data } = await axios.get("/me");
  return data; // { ok, user }
}

// --- Profesores ---
export async function getProfesores() {
  const { data } = await axios.get("/profesores");
  return data;
}

export async function getProfesorById(id) {
  const { data } = await axios.get(`/profesores/${id}`);
  return data;
}

// --- Cursos ---
export async function getCursos() {
  const { data } = await axios.get("/cursos");
  return data;
}

export async function getCursoById(id) {
  const { data } = await axios.get(`/cursos/${id}`);
  return data;
}

// --- Calificaciones ---
export async function getCalificacionesByProfesor(id) {
  const { data } = await axios.get(`/calificaciones/${id}`);
  return data;
}

// --- Calificación del usuario autenticado ---
// 🔹 Cambiamos "mia" por "mis" para evitar conflicto con "/:profesorId"
export async function getMiCalificacionByProfesor(id, token) {
  const { data } = await axios.get(`/calificaciones/mis/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateCalificacion(id, formData, token) {
  const { data } = await axios.put(`/calificaciones/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deleteCalificacion(id, token) {
  const { data } = await axios.delete(`/calificaciones/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// --- Búsqueda (profesores + cursos) ---
export async function search(q) {
  const { data } = await axios.get(`/search`, { params: { q } });
  return data; // { profesores: [], cursos: [] }
}

// --- Mis Ramos (usuario) ---
export async function getMisRamos(token) {
  const { data } = await axios.get("/mis-ramos", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.misRamos;
}

export async function saveMisRamos(token, ramosIds) {
  const { data } = await axios.put(
    "/mis-ramos",
    { ramos: ramosIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.misRamos;
}

// --- Reportes ---
export async function crearReporte(token, comentarioId, profesorId, motivo) {
  const { data } = await axios.post(
    "/reportes",
    { comentarioId, profesorId, motivo },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function getReportes(token) {
  const { data } = await axios.get("/reportes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function actualizarEstadoReporte(token, id, accion) {
  const { data } = await axios.put(
    `/reportes/${id}`,
    { accion }, // ✅ cambiamos "estado" por "accion"
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

