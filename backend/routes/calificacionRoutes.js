// routes/calificacionRoutes.js
const express = require('express');
const router = express.Router();
const Calificacion = require('../models/Calificacion');
const { authenticate } = require('../middleware/authenticate'); // tu middleware JWT

// 📤 Crear una nueva calificación
router.post('/', authenticate, async (req, res) => {
  try {
    const { profesorId, claridadComunicacion, dominioContenido, motivacion, exigenciaCarga, disponibilidadApoyo, comentario } = req.body;

    const estudianteId = req.user.id; // desde el token JWT

    // Verificar si ya calificó a este profesor
    const existente = await Calificacion.findOne({ profesorId, estudianteId });
    if (existente) {
      return res.status(400).json({ message: 'Ya has calificado a este profesor.' });
    }

    const calificacion = new Calificacion({
      profesorId,
      estudianteId,
      claridadComunicacion,
      dominioContenido,
      motivacion,
      exigenciaCarga,
      disponibilidadApoyo,
      comentario,
    });

    await calificacion.save();
    res.status(201).json(calificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Obtener todas las calificaciones de un profesor (promedios + comentarios)
router.get('/:profesorId', async (req, res) => {
  try {
    const { profesorId } = req.params;

    const calificaciones = await Calificacion.find({ profesorId });

    if (!calificaciones.length) {
      return res.json({ message: 'Sin calificaciones registradas aún.' });
    }

    // Calcular promedios
    const promedios = {
      claridadComunicacion: 0,
      dominioContenido: 0,
      motivacion: 0,
      exigenciaCarga: 0,
      disponibilidadApoyo: 0,
    };

    calificaciones.forEach((c) => {
      promedios.claridadComunicacion += c.claridadComunicacion;
      promedios.dominioContenido += c.dominioContenido;
      promedios.motivacion += c.motivacion;
      promedios.exigenciaCarga += c.exigenciaCarga;
      promedios.disponibilidadApoyo += c.disponibilidadApoyo;
    });

    const total = calificaciones.length;
    for (let key in promedios) promedios[key] = (promedios[key] / total).toFixed(1);

    res.json({
      profesorId,
      promedios,
      totalResenas: total,
      comentarios: calificaciones
        .filter(c => c.comentario)
        .map(c => ({
          comentario: c.comentario,
          fecha: c.createdAt,
        })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
