# Plataforma Académica: Calificador de Profesores

Sistema web institucional que centraliza la información necesaria para que los estudiantes puedan elegir profesores y asignaturas de manera informada. Reemplaza la búsqueda dispersa en redes sociales por una plataforma confiable, moderada y con datos estructurados.


## 1. Descripción General

El Calificador de Profesores es una plataforma donde los estudiantes pueden:

- Buscar cursos y profesores.
- Revisar fichas completas con información consolidada.
- Leer y publicar reseñas reales, moderadas y con calificaciones.
- Comparar alternativas antes de inscribirse.

El propósito principal es **mejorar la toma de decisiones académicas**, reduciendo tiempo, desinformación y sesgos asociados a fuentes informales.


## 2. Objetivos del Proyecto

- **Reducir el tiempo** que los estudiantes usan para comparar profesores.
- **Centralizar información** actualmente dispersa en redes, foros y chats.
- **Aumentar la transparencia** en la evaluación docente.
- **Mejorar la satisfacción estudiantil** al momento de inscribir ramos.


## 3. Funcionalidades Principales

### Autenticación institucional
- Acceso restringido a correos *@alumnos.uai.cl*.
- Validación de dominio (prototipo sin SSO real).

### Búsqueda y exploración
- Buscar por **curso** o **profesor**.
- Filtros básicos (código, nombre, escuela, etc.).

### Ficha del profesor
- Cursos impartidos.
- Promedio de calificaciones.
- Distribución de notas (1–5).
- Reseñas visibles (tarjetas).
- Conteos: número de reseñas, reportes, etc.

### Reseñas y calificaciones
- Nota **1 a 5** más comentario.
- Editar o eliminar reseñas propias.
- **1 reseña por estudiante por profesor**.

### Moderación y reportes
- Cualquier estudiante puede reportar una reseña.
- Estados:
  - **Pendiente**
  - **Aprobada**
  - **Rechazada**
- Vista especial para administradores (prototipo).



## 4. Arquitectura y Tecnologías

### Stack tecnológico
- **Frontend:** React + Vite, CSS
- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB Atlas
- **ODM:** Mongoose
- **Autenticación:** validación de dominio institucional



## 5. Estructura del Proyecto

Esta sección describe la organización general del repositorio y cómo se distribuyen los distintos módulos del proyecto. La separación entre backend y frontend permite un desarrollo más ordenado, facilitando la mantención, escalabilidad y despliegue independiente de cada parte del sistema.

### Estructura real del repositorio

```bash
INGSOFTWARE/
│
├── .github/
│
├── backend/
│ ├── middleware/
│ ├── models/
│ ├── node_modules/
│ ├── routes/
│ ├── scripts/
│ ├── .env
│ ├── index.js
│ ├── package-lock.json
│ ├── package.json
│
├── frontend/
│ ├── build/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── App.css
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── ProtectedRoute.jsx
│ ├── package-lock.json
│ ├── package.json
│
├── .gitignore
├── README.md
```

## 6. Instalación y Ejecución

A continuación se detallan los pasos necesarios para instalar, configurar y ejecutar el proyecto tanto en entorno local como en producción. Esto incluye la clonación del repositorio, la configuración del backend con variables de entorno y la inicialización del frontend construido en React.

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/ingsoftware.git
cd ingsoftware
```

### 2. Configurar el Backend

Ir a la carpeta:

```bash
cd backend
```

Crear archivo .env con las variables reales utilizadas en el proyecto:

```bash
MONGO_URI=mongodb+srv://...
DB_NAME=ingsoftware

PEPPER=tu_pepper_secreto
SALT_ROUNDS=12

JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=7d
PORT=4000
```

Instalar dependencias:

```bash
npm install
```

Levantar el servidor:

```bash
npm run dev
```

Si la conexión es correcta, verás en consola:

```bash
✅ Conectado a MongoDB: ingsoftware
🚀 Servidor backend escuchando en puerto 4000
```

### 3. Configurar el Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Luego abrir:

```bash
http://localhost:3000
```

### 4. Build de producción (solo si despliegas)

```bash
cd frontend
npm run build
```

El backend servirá el build automáticamente gracias a la configuración del `index.js`.



## 7. Endpoints Principales

A continuación se presentan los principales endpoints expuestos por la API del proyecto. Estas rutas permiten gestionar usuarios, profesores, cursos, calificaciones, reportes y búsquedas dentro de la plataforma. Todas siguen una estructura REST y utilizan prefijos organizados para mantener claridad y consistencia en el desarrollo.


### 👤 Usuarios (`/api` → userRoutes)

| Método | Ruta | Descripción |
|-------|-------|-------------|
| POST | `/api/register` | Registrar usuario |
| POST | `/api/login` | Iniciar sesión |
| GET | `/api/me` | Obtener usuario autenticado |

> *(Asumiendo las rutas estándar de tu UserRoutes; si quieres las exactas, pásame el archivo y te hago tabla real).*



### 👨‍🏫 Profesores (`/api/profesores`)

| Método | Ruta | Descripción |
|-------|-------|-------------|
| GET | `/api/profesores` | Obtener todos los profesores |
| GET | `/api/profesores/:id` | Obtener un profesor por ID |
| POST | `/api/profesores` | Crear profesor |
| PUT | `/api/profesores/:id` | Actualizar profesor |
| DELETE | `/api/profesores/:id` | Eliminar profesor |



### 📘 Cursos (`/api/cursos`)

| Método | Ruta | Descripción |
|-------|-------|-------------|
| GET | `/api/cursos` | Obtener todos los cursos |
| GET | `/api/cursos/:id` | Obtener curso por ID |
| POST | `/api/cursos` | Crear curso |
| PUT | `/api/cursos/:id` | Actualizar curso |
| DELETE | `/api/cursos/:id` | Eliminar curso |



### ⭐ Calificaciones (`/api/calificaciones`)

Basado en **calificacionRoutes.js**.

| Método | Ruta | Descripción |
|-------|-------|-------------|
| POST | `/api/calificaciones` | Crear calificación (requiere login) |
| GET | `/api/calificaciones/:profesorId` | Obtener calificaciones + promedios de un profesor |
| GET | `/api/calificaciones/mis/:profesorId` | Obtener la calificación del usuario autenticado |
| PUT | `/api/calificaciones/:id` | Editar calificación del usuario |
| DELETE | `/api/calificaciones/:id` | Eliminar calificación del usuario |


### 🔍 Búsqueda (`/api/search`)

| Método | Ruta | Descripción |
|-------|-------|-------------|
| GET | `/api/search?q=` | Buscar profesores o cursos |



### 🚨 Reportes (`/api/reportes`)

| Método | Ruta | Descripción |
|-------|-------|-------------|
| POST | `/api/reportes` | Crear reporte de calificación |
| GET | `/api/reportes` | Obtener reportes (admin) |
| PUT | `/api/reportes/:id` | Cambiar estado del reporte |




## 8. Seguridad y Buenas Prácticas

- Validación de dominio institucional.

- Sanitización de inputs.

- Rate limiting básico.

- Validación estricta de 1 reseña por usuario/profesor.
  

## 9. Estado Actual del Proyecto

- CRUD completo de profesores, cursos y reseñas.

- Autenticación funcionando.

- Moderación implementada.

- Conexión completa FE ↔ BE.

- Proyecto listo para demo final.


## 10. Próximos Pasos

- Autenticación real con SSO institucional.

- Panel administrativo avanzado.

- Dashboard con gráficos y analítica.

- Recomendación automática de profesores.

- Exportación de métricas en PDF.