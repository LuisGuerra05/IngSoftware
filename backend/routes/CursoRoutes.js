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

// Obtener todos los cursos (con profesor como array)
router.get('/', async (_req, res) => {
  try {
    const cursos = await Curso.find().populate('profesor');
    const cursosConProfesores = cursos.map((curso) => ({
      _id: curso._id,
      nombre: curso.nombre,
      codigo: curso.codigo,
      profesores: curso.profesor ? [curso.profesor] : [],
    }));
    res.json(cursosConProfesores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener curso por ID (manteniendo estructura coherente)
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('profesor');
    if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json({
      _id: curso._id,
      nombre: curso.nombre,
      codigo: curso.codigo,
      profesores: curso.profesor ? [curso.profesor] : [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
