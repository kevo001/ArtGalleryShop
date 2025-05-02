// models/Artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  bio:      String,
  imageUrl: String,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ] // ← add this
});

module.exports = mongoose.model('Artist', artistSchema);
