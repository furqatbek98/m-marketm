const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateAdmin } = require('../middleware/auth');

// Barcha mahsulotlarni olish
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Bitta mahsulot
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Topilmadi' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin: mahsulot qo‘shish
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: mahsulotni yangilash
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Topilmadi' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: mahsulotni o‘chirish
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'O\'chirildi' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;