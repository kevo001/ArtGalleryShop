const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    // Generate order number (e.g. ORD-20250413-xyz)
    const dateCode = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const orderNumber = `ORD-${dateCode}-${Math.floor(Math.random() * 1000)}`;

    // Generate today's date in DD.MM.YYYY format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const date = `${day}.${month}.${year}`;

    const newOrder = new Order({
      ...req.body,
      orderNumber,
      date, // override any incoming date
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;