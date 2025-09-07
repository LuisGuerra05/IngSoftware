# Plataforma Académica: Calificador de Profesores

## Descripción del proyecto

Plataforma web institucional que centraliza información para la elección de profesores y asignaturas. Su objetivo es reemplazar la búsqueda fragmentada en redes sociales por una consulta estructurada, confiable y comparable, reduciendo tiempo y mejorando la calidad de decisión al inscribirse.

## Requerimientos clave

- Autenticación institucional: solo acceden correos *@alumnos.uai.cl.

- Gestión de profesores y cursos: búsqueda por curso o profesor; ficha pública de profesor con cursos impartidos.

- Calificaciones: reseñas con nota 1–5 y comentario.

- Moderación y reportes: reportar reseñas; estados pendiente/aprobada/rechazada para mantener calidad y respeto.

## Objetivos 

- Reducir el tiempo de búsqueda y comparación.

- Aumentar la satisfacción del estudiante con su elección.

- Mejorar la transparencia y trazabilidad de la evaluación docente.

### ⚙️ Stack
- Frontend: React (Vite/CRA), CSS
- Backend: Node.js + Express, Mongoose
- DB: MongoDB Atlas
- Auth (prototipo): filtro por dominio @alumnos.uai.cl (sin SSO real)