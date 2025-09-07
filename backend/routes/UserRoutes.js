// backend/routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de tener este modelo

// Regex para permitir solo alumnos UAI en el prototipo
const UAI_STUDENT_REGEX = /^[a-z0-9._%+-]+@alumnos\.uai\.cl$/i;

/**
 * Ruta de prueba para crear usuario
 * POST /api/test-user
 * Body: { email, password }
 */
router.post('/test-user', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }
    if (!UAI_STUDENT_REGEX.test(email)) {
      return res.status(400).json({ error: 'Solo correos @alumnos.uai.cl' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({
      message: 'Usuario creado',
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

/**
 * (Opcional) Lista usuarios para probar
 * GET /api/users
 */
router.get('/users', async (_req, res) => {
  try {
    const users = await User.find({}, { email: 1 }).lean();
    return res.json(users);
  } catch (err) {
    console.error('Error al listar usuarios:', err);
    return res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

module.exports = router;
