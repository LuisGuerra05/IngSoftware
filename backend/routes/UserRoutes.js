const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

const UAI_STUDENT_REGEX = /^[a-z0-9._%+-]+@alumnos\.uai\.cl$/i;

// LOGIN -> emite JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }
    if (!UAI_STUDENT_REGEX.test(email)) {
      return res.status(400).json({ error: 'Solo correos @alumnos.uai.cl' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrecta' });
    }

    const ok = await user.verifyPassword(password, process.env.PEPPER || '');
    if (!ok) {
      return res.status(401).json({ error: 'Correo o contraseña incorrecta' });
    }

    const token = require('jsonwebtoken').sign(
      { sub: String(user._id), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return res.json({ ok: true, token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error en login' });
  }
});

// ===================================================
// 🔹 Guardar ramos seleccionados del usuario
// ===================================================
router.put("/mis-ramos", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub; // viene del JWT
    const { ramos } = req.body; // array de IDs de cursos

    if (!Array.isArray(ramos)) {
      return res.status(400).json({ error: "Formato inválido de ramos" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { misRamos: ramos },
      { new: true }
    ).populate("misRamos");

    res.json({ ok: true, misRamos: user.misRamos });
  } catch (err) {
    console.error("❌ Error guardando ramos:", err);
    res.status(500).json({ error: "Error guardando ramos del usuario" });
  }
});

// ===================================================
// 🔹 Obtener ramos guardados del usuario
// ===================================================
router.get("/mis-ramos", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId).populate("misRamos");
    res.json({ ok: true, misRamos: user.misRamos });
  } catch (err) {
    console.error("❌ Error obteniendo ramos:", err);
    res.status(500).json({ error: "Error obteniendo ramos del usuario" });
  }
});

module.exports = router;
