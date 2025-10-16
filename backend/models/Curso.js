const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CursoSchema = new Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  profesores: [{ type: Schema.Types.ObjectId, ref: "Profesor" }], 
});

module.exports = mongoose.model("Curso", CursoSchema);
