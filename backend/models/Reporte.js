const mongoose = require("mongoose");

const reporteSchema = new mongoose.Schema({
  comentarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Calificacion", // referencia al modelo de calificación
  },
  profesorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profesor",
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // 🔹 CORREGIDO para coincidir con tu modelo real
  },
  motivo: {
    type: String,
    default: "Comentario inapropiado",
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: ["pendiente", "revisado", "descartado"],
    default: "pendiente",
  },
});

module.exports = mongoose.model("Reporte", reporteSchema);
