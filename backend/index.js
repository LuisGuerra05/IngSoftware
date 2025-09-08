// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Arranque + conexión a MongoDB
async function start() {
  try {
    // Mongoose 7 no requiere opciones extra
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'ingsoftware' });
    console.log('✅ Conectado a MongoDB. DB =', mongoose.connection.name);


    // Rutas (importa después de crear app)
    const userRoutes = require('./routes/UserRoutes'); // ojo con mayúsculas/minúsculas
    app.use('/api', userRoutes);

    // Health check
    app.get('/', (_req, res) => res.send('Backend funcionando'));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  }
}

start();
