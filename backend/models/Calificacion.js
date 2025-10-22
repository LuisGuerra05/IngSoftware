// models/Calificacion.js
const mongoose = require("mongoose");

const calificacionSchema = new mongoose.Schema(
  {
    profesorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profesor",
      required: true,
    },
    estudianteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    claridadComunicacion: { type: Number, min: 1, max: 5, required: true },
    dominioContenido: { type: Number, min: 1, max: 5, required: true },
    motivacion: { type: Number, min: 1, max: 5, required: true },
    exigenciaCarga: { type: Number, min: 1, max: 5, required: true },
    disponibilidadApoyo: { type: Number, min: 1, max: 5, required: true },
    comentario: { type: String, trim: true, maxlength: 500 },

    // 🔹 NUEVOS CAMPOS
    volveriaTomar: {
      type: Boolean,
      required: true,
    },
    dificultad: {
      type: String,
      enum: ["baja", "media", "alta"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Evitar calificación duplicada por estudiante/profesor
calificacionSchema.index({ profesorId: 1, estudianteId: 1 }, { unique: true });

module.exports = mongoose.model("Calificacion", calificacionSchema);
