const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");
const Calificacion = require("../models/Calificacion");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

// 📌 Crear nuevo reporte
router.post("/", requireAuth, async (req, res) => {
  try {
    const { comentarioId, profesorId, motivo } = req.body;
    const usuarioId = req.user.sub;

    if (!comentarioId || !profesorId) {
      return res.status(400).json({ ok: false, error: "Datos incompletos." });
    }

    // Evitar duplicados del mismo usuario
    const existe = await Reporte.findOne({ comentarioId, usuarioId });
    if (existe) {
      return res
        .status(409)
        .json({ ok: false, message: "Ya reportaste este comentario." });
    }

    const nuevoReporte = new Reporte({
      comentarioId,
      profesorId,
      usuarioId,
      motivo: motivo || "Comentario inapropiado",
    });

    await nuevoReporte.save();

    res.status(201).json({
      ok: true,
      message: "Reporte enviado correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al crear reporte:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno al crear el reporte.",
    });
  }
});

// 📋 Obtener todos los reportes
router.get("/", requireAuth, async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate({
        path: "comentarioId",
        model: "Calificacion",
        select: "comentario createdAt estudianteId",
        populate: { path: "estudianteId", model: "User", select: "email" }
      })
      .populate({ path: "profesorId", model: "Profesor", select: "nombre" })
      .populate({ path: "usuarioId", model: "User", select: "email" })
      .sort({ fecha: -1 });

    res.json(reportes);
  } catch (error) {
    console.error("❌ Error al obtener reportes:", error);
    res.status(500).json({
      ok: false,
      error: "Error al obtener reportes desde el servidor.",
    });
  }
});

// 🔄 Actualizar estado del reporte
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { accion } = req.body;

    const reporte = await Reporte.findById(id).populate({
      path: "comentarioId",
      model: "Calificacion",
      populate: {
        path: "estudianteId",
        model: "User",
        select: "email"
      }
    });

    if (!reporte) {
      return res
        .status(404)
        .json({ ok: false, error: "Reporte no encontrado." });
    }

    if (accion === "eliminar") {
      // 🟡 1. Guardar backup antes de borrar (opcional)
      if (reporte.comentarioId) {
        reporte.comentarioBackup = {
          comentario: reporte.comentarioId.comentario,
          fecha: reporte.comentarioId.createdAt,
          usuario: reporte.comentarioId.estudianteId?.email || "No registrado",
        };
      }

      // 🟡 2. Borrar comentario real
      await Calificacion.findByIdAndDelete(reporte.comentarioId?._id);

      // 🟡 3. Eliminar también el reporte
      await Reporte.findByIdAndDelete(id);

      return res.json({
        ok: true,
        message: "Comentario eliminado y reporte eliminado completamente."
      });
    }

    if (accion === "mantener") {
      reporte.estado = "revisado";
      await reporte.save();

      return res.json({
        ok: true,
        message: "Comentario mantenido y reporte revisado.",
        estado: "revisado",
      });
    }
  } catch (error) {
    console.error("❌ Error al actualizar reporte:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno al actualizar el reporte.",
    });
  }
});

// 🗑️ Eliminar reporte individual (NO borra comentarios, solo limpiezas)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res
        .status(404)
        .json({ ok: false, error: "Reporte no encontrado." });
    }

    await Reporte.findByIdAndDelete(id);

    res.json({
      ok: true,
      message: "Reporte eliminado correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al eliminar reporte:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno al eliminar el reporte.",
    });
  }
});

module.exports = router;
