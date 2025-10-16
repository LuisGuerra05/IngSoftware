const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfesorSchema = new Schema({
  nombre: { type: String, required: true },
  campus: { type: String },
  linkUAI: { type: String },
  cursos: [{ type: Schema.Types.ObjectId, ref: "Curso" }],
});

module.exports = mongoose.model("Profesor", ProfesorSchema);
