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

// --- Búsqueda (profesores + cursos) ---
export async function search(q) {
  const { data } = await axios.get(`/search`, { params: { q } });
  return data; // { profesores: [], cursos: [] }
}
