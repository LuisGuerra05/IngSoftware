const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");
const Calificacion = require("../models/Calificacion");
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
        .status(409) // 409 = conflicto (ya existe)
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

    res.status(201).json({
      ok: true,
      message: "Reporte enviado correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al crear reporte:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al crear el reporte." });
  }
});

// 📋 Obtener todos los reportes (solo admins)
router.get("/", requireAuth, async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate({
        path: "comentarioId",
        model: "Calificacion",
        select: "comentario createdAt estudianteId",
        populate: {
          path: "estudianteId",
          model: "User",
          select: "email", // ✅ Email del usuario que comentó
        },
      })
      .populate({
        path: "profesorId",
        model: "Profesor",
        select: "nombre",
      })
      .populate({
        path: "usuarioId",
        model: "User",
        select: "email", // ✅ Usuario que reportó
      })
      .sort({ fecha: -1 }); // orden descendente (más recientes primero)

    res.json(reportes);
  } catch (error) {
    console.error("❌ Error al obtener reportes:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error al obtener reportes desde el servidor." });
  }
});

// ✅ Actualizar estado del reporte y manejar comentario
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { accion } = req.body;

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res
        .status(404)
        .json({ ok: false, error: "Reporte no encontrado." });
    }

    if (accion === "eliminar") {
      // 🗑️ Eliminar el comentario asociado
      await Calificacion.findByIdAndDelete(reporte.comentarioId);
      reporte.estado = "descartado";
    } else if (accion === "mantener") {
      // ✅ Mantener el comentario, solo cerrar el reporte
      reporte.estado = "revisado";
    } else {
      return res.status(400).json({ ok: false, error: "Acción no válida." });
    }

    await reporte.save();

    res.json({
      ok: true,
      message:
        accion === "eliminar"
          ? "Comentario eliminado y reporte cerrado."
          : "Comentario mantenido y reporte marcado como revisado.",
      estado: reporte.estado,
    });
  } catch (error) {
    console.error("❌ Error al actualizar reporte:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al actualizar el reporte." });
  }
});

// 🗑️ Eliminar un reporte por ID (admin o autenticado)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({ ok: false, error: "Reporte no encontrado." });
    }

    // 🔹 Eliminar el reporte de la base de datos
    await Reporte.findByIdAndDelete(id);

    res.json({
      ok: true,
      message: "Reporte eliminado correctamente de la base de datos.",
    });
  } catch (error) {
    console.error("❌ Error al eliminar reporte:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al eliminar el reporte." });
  }
});

module.exports = router;
