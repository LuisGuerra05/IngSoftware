const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profesorSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  campus: {
    type: String,
    required: true,
    trim: true
  },
  linkUAI: {
    type: String,
    required: true,
    trim: true
  },
  cursos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Curso'
    }
  ]
});

module.exports = mongoose.model('Profesor', profesorSchema);
