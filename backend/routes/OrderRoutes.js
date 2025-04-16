const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create a new order
router.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 }); // newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an order
router.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;

  if (!['Under behandling', 'Ferdig'].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;