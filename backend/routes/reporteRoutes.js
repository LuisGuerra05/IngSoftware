const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");
const requireAuth = require("../middleware/requireAuth");

// 📌 Crear nuevo reporte
router.post("/", requireAuth, async (req, res) => {
  try {
    const { comentarioId, profesorId, motivo } = req.body;

    if (!comentarioId || !profesorId) {
      return res.status(400).json({ ok: false, error: "Datos incompletos" });
    }

    // Evitar duplicados del mismo usuario
    const existe = await Reporte.findOne({
      comentarioId,
      usuarioId: req.user.sub,
    });

    if (existe) {
      return res
        .status(400)
        .json({ ok: false, message: "Ya reportaste este comentario." });
    }

    const nuevoReporte = new Reporte({
      comentarioId,
      profesorId,
      usuarioId: req.user.sub,
      motivo,
    });

    await nuevoReporte.save();
    res
      .status(201)
      .json({ ok: true, message: "Reporte enviado correctamente" });
  } catch (error) {
    console.error("Error al crear reporte:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error al crear el reporte" });
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
        select: "comentario createdAt usuario",
      })
      .populate({
        path: "profesorId",
        model: "Profesor",
        select: "nombre",
      })
      .populate({
        path: "usuarioId",
        model: "User", // Asegúrate que coincide con tu modelo de usuario
        select: "email",
      });

    res.json(reportes);
  } catch (error) {
    console.error("❌ Error al obtener reportes:", error);
    res.status(500).json({ ok: false, error: "Error al obtener reportes" });
  }
});

module.exports = router;
