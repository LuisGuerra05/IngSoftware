const express = require("express");
const router = express.Router();
const Calificacion = require("../models/Calificacion");
const requireAuth = require("../middleware/requireAuth");

// 📤 Crear una nueva calificación
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      profesorId,
      claridadComunicacion,
      dominioContenido,
      motivacion,
      exigenciaCarga,
      disponibilidadApoyo,
      comentario,
      volveriaTomar,
      dificultad,
    } = req.body;

    const estudianteId = req.user.sub || req.user.id;

    // Verificar si ya calificó a este profesor
    const existente = await Calificacion.findOne({ profesorId, estudianteId });
    if (existente) {
      return res.status(400).json({ message: "Ya has calificado a este profesor." });
    }

    // Crear nueva calificación
    const calificacion = new Calificacion({
      profesorId,
      estudianteId,
      claridadComunicacion,
      dominioContenido,
      motivacion,
      exigenciaCarga,
      disponibilidadApoyo,
      comentario,
      volveriaTomar,
      dificultad,
    });

    await calificacion.save();
    res.status(201).json(calificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Obtener todas las calificaciones de un profesor (promedios + porcentajes)
router.get("/:profesorId", async (req, res) => {
  try {
    const { profesorId } = req.params;
    const calificaciones = await Calificacion.find({ profesorId });

    if (!calificaciones.length) {
      return res.json({ message: "Sin calificaciones registradas aún." });
    }

    // Promedios numéricos
    const promedios = {
      claridadComunicacion: 0,
      dominioContenido: 0,
      motivacion: 0,
      exigenciaCarga: 0,
      disponibilidadApoyo: 0,
    };

    let volveriaSi = 0;
    let dificultadBaja = 0;
    let dificultadMedia = 0;
    let dificultadAlta = 0;

    calificaciones.forEach((c) => {
      promedios.claridadComunicacion += c.claridadComunicacion;
      promedios.dominioContenido += c.dominioContenido;
      promedios.motivacion += c.motivacion;
      promedios.exigenciaCarga += c.exigenciaCarga;
      promedios.disponibilidadApoyo += c.disponibilidadApoyo;

      if (c.volveriaTomar) volveriaSi++;
      if (c.dificultad === "baja") dificultadBaja++;
      if (c.dificultad === "media") dificultadMedia++;
      if (c.dificultad === "alta") dificultadAlta++;
    });

    const total = calificaciones.length;
    for (let key in promedios) {
      promedios[key] = (promedios[key] / total).toFixed(1);
    }

    // Porcentajes agregados
    const indicadores = {
      volveriaTomar: ((volveriaSi / total) * 100).toFixed(1),
      dificultad: {
        baja: ((dificultadBaja / total) * 100).toFixed(1),
        media: ((dificultadMedia / total) * 100).toFixed(1),
        alta: ((dificultadAlta / total) * 100).toFixed(1),
      },
    };

    res.json({
      profesorId,
      promedios,
      totalResenas: total,
      indicadores,
      comentarios: calificaciones
        .filter((c) => c.comentario)
        .map((c) => ({
          comentario: c.comentario,
          fecha: c.createdAt,
        })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
