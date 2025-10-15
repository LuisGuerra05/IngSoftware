const express = require('express');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');

const router = express.Router();

// Crear profesor
router.post('/', async (req, res) => {
  try {
    const profesor = new Profesor(req.body);
    await profesor.save();
    res.status(201).json(profesor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los profesores
router.get('/', async (_req, res) => {
  try {
    const profesores = await Profesor.find().populate('cursos');
    res.json(profesores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un profesor por ID
router.get('/:id', async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.params.id).populate('cursos');
    if (!profesor) return res.status(404).json({ message: 'Profesor no encontrado' });
    res.json(profesor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Asignar curso a profesor
router.post('/:id/cursos', async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.params.id);
    if (!profesor) return res.status(404).json({ message: 'Profesor no encontrado' });

    const curso = new Curso({ ...req.body, profesor: profesor._id });
    await curso.save();

    profesor.cursos.push(curso._id);
    await profesor.save();

    res.status(201).json({ message: 'Curso asignado correctamente', curso });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
