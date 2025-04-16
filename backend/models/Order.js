// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String },
  address: {
    line1: String,
    line2: String,
    city: String,
    postal_code: String,
    country: String,
  },
  cart: [
    {
      title: String,
      quantity: Number,
      price: Number,
    }
  ],
  status: { type: String, enum: ['Under behandling', 'Ferdig'], default: 'Under behandling' },
  date: { type: String, required: true },
  totalAmount: { type: Number, required: true }
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
