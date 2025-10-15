const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  codigo: {
    type: String,
    required: true,
    trim: true
  },
  profesor: {
    type: Schema.Types.ObjectId,
    ref: 'Profesor'
  }
});

module.exports = mongoose.model('Curso', cursoSchema);
