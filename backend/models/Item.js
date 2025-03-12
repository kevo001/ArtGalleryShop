const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String, // URL for the item image
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;