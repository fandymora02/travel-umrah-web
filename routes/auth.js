const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username dan password wajib diisi' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed'))
            return res.status(400).json({ error: 'Username sudah digunakan' });
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: '✅ Registrasi berhasil' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Isi username dan password' });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Password salah' });

    res.json({ message: '✅ Login berhasil', user: { id: user.id, username: user.username, role: user.role } });
  });
});

module.exports = router;