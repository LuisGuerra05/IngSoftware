const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");
const requireAuth = require("../middleware/requireAuth");

// 📌 Crear nuevo reporte
router.post("/", requireAuth, async (req, res) => {
  try {
    const { comentarioId, profesorId, motivo } = req.body;
    const usuarioId = req.user.sub;

    if (!comentarioId || !profesorId) {
      return res.status(400).json({ ok: false, error: "Datos incompletos." });
    }

    // 🔹 Evitar duplicados del mismo usuario
    const existe = await Reporte.findOne({ comentarioId, usuarioId });
    if (existe) {
      return res
        .status(409) // 409 = conflicto (más semántico que 400)
        .json({ ok: false, message: "Ya reportaste este comentario." });
    }

    // 🔹 Crear nuevo reporte
    const nuevoReporte = new Reporte({
      comentarioId,
      profesorId,
      usuarioId,
      motivo: motivo || "Comentario inapropiado",
    });

    await nuevoReporte.save();

    res.status(201).json({ ok: true, message: "Reporte enviado correctamente." });
  } catch (error) {
    console.error("❌ Error al crear reporte:", error);
    res.status(500).json({ ok: false, error: "Error interno al crear el reporte." });
  }
});

// 📋 Obtener todos los reportes (solo admins)
router.get("/", requireAuth, async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate({
        path: "comentarioId",
        model: "Calificacion",
        populate: {
          path: "estudianteId",
          model: "User",
          select: "email",
        },
        select: "comentario createdAt estudianteId",
      })
      .populate({
        path: "profesorId",
        model: "Profesor",
        select: "nombre",
      })
      .populate({
        path: "usuarioId",
        model: "User",
        select: "email",
      });

    res.json(reportes);
  } catch (error) {
    console.error("❌ Error al obtener reportes:", error);
    res.status(500).json({ ok: false, error: "Error al obtener reportes." });
  }
});

module.exports = router;
