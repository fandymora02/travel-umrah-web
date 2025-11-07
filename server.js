// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'rahasia_super_aman', // ubah jadi string rahasia kamu
  resave: false,
  saveUninitialized: true,
}));


// Routes
const jamaahRoutes = require('./routes/jamaah');
app.use('/api/jamaah', jamaahRoutes);

const agenRoutes = require('./routes/agen');
app.use('/api/agen', agenRoutes);

const keuanganRoutes = require('./routes/keuangan');
app.use('/api/keuangan', keuanganRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Root endpoint (akses dari browser)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
