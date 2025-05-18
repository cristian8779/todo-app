const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "pendiente" },
  priority: { type: String, enum: ["baja", "media", "alta"], default: "media" },
  color: { type: String, default: '#ffffff' },
  fontSize: { type: String, default: '16px' },  // Agregado tamaño de fuente
  fontWeight: { type: String, default: 'normal' },  // Agregado negrita
  fontStyle: { type: String, default: 'normal' },  // Agregado cursiva
  dueDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
