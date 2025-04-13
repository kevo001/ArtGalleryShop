const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Under behandling', 'Ferdig'], default: 'Under behandling' },
  date: { type: String, required: true },
  totalAmount: { type: Number, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;