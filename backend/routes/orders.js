const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Buyurtma o\'chirildi' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;