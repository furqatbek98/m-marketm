const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/test', (req, res) => res.json({ message: 'Server ishlayapti' }));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/m-market';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB ga ulandi');
    app.listen(PORT, () => console.log(`✅ Server: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB ulanishda xatolik:', err.message);
    process.exit(1);
  });