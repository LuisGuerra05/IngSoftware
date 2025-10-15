const express = require('express');
const Curso = require('../models/Curso');

const router = express.Router();

// Crear curso independiente (sin profesor)
router.post('/', async (req, res) => {
  try {
    const curso = new Curso(req.body);
    await curso.save();
    res.status(201).json(curso);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los cursos
router.get('/', async (_req, res) => {
  try {
    const cursos = await Curso.find().populate('profesor');
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener curso por ID
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('profesor');
    if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(curso);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
