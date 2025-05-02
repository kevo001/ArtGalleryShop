const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  size: { type: String, required: true },
  dimension: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  quantity:    { type: Number, default: 0 }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;