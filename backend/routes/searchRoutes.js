const express = require('express');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');

const router = express.Router();

// GET /api/search?q=texto
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ profesores: [], cursos: [] });

    // Construir un patrón que sea insensible a acentos (folding simple)
    const foldMap = {
      a: 'aáàâäãå',
      e: 'eéèêë',
      i: 'iíìîï',
      o: 'oóòôöõ',
      u: 'uúùûü',
      n: 'nñ'
    };

    const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const tokenToPattern = (token) => {
      return token
        .split('')
        .map((ch) => {
          const lower = ch.toLowerCase();
          if (foldMap[lower]) {
            // construir clase de caracteres con las variantes (lowercase suficiente con flag 'i')
            return `[${foldMap[lower]}]`;
          }
          return escapeForRegex(ch);
        })
        .join('');
    };

    const tokens = q.split(/\s+/).filter(Boolean);
    const pattern = tokens.map(tokenToPattern).join('|');
    const regex = new RegExp(pattern, 'i');

    const profesores = await Profesor.find({ nombre: regex })
      .limit(8)
      .populate('cursos');

    const cursos = await Curso.find({ $or: [{ nombre: regex }, { codigo: regex }] })
      .limit(8)
      .populate('profesores');

    res.json({ profesores, cursos });
  } catch (err) {
    console.error('Error /api/search:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
