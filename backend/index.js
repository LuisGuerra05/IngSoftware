// --- Configuración inicial ---
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// --- Rutas ---
const userRoutes = require('./routes/UserRoutes');
const profesorRoutes = require('./routes/ProfesorRoutes');
const cursoRoutes = require('./routes/CursoRoutes');
const calificacionRoutes = require('./routes/calificacionRoutes'); 

// --- Variables de entorno ---
const { MONGO_URI, DB_NAME } = process.env;

// --- Inicializar Express ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Rutas API ---
app.use('/api', userRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/calificaciones', calificacionRoutes);

// --- Servir frontend (React build) ---
const localFrontendPath = path.join(__dirname, '..', 'frontend', 'build');  // entorno local
const deployedFrontendPath = path.join(__dirname, 'frontend', 'build');     // entorno Azure

// Detectar cuál usar
const frontendPath = fs.existsSync(deployedFrontendPath)
  ? deployedFrontendPath
  : localFrontendPath;

// Servir archivos estáticos del frontend
app.use(express.static(frontendPath));

// Catch-all para rutas que no sean /api
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Conexión a MongoDB y arranque ---
mongoose.connect(MONGO_URI, { dbName: DB_NAME || 'ingsoftware' })
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`✅ Conectado a MongoDB: ${dbName}`);

    if (dbName === 'test') {
      console.error("⚠️ La conexión apunta a 'test'. Ajusta MONGO_URI o DB_NAME.");
      process.exit(1);
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });
