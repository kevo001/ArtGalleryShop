
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 1000 },
});

module.exports = mongoose.models.Counter || mongoose.model('Counter', counterSchema);