const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Bu email band' });

    const user = await User.create({ name, email, phone: phone || '', password });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Email yoki parol xato' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Email yoki parol xato' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;