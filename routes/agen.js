const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 🔹 Fungsi buat ID unik agen (contoh: AG-3F7B2C)
function generateRandomId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AG-${random}`;
}

// 🔹 GET semua data agen
router.get('/', (req, res) => {
  const query = 'SELECT * FROM agen';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error GET agen:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 🔹 GET satu agen berdasarkan ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM agen WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('❌ Error GET by ID:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Agen tidak ditemukan' });
    res.json(row);
  });
});

// 🔹 POST tambah agen baru
router.post('/', (req, res) => {
  const { nama, cabang, no_hp } = req.body;

  if (!nama || !cabang || !no_hp) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const id = generateRandomId();
  const query = 'INSERT INTO agen (id, nama, cabang, no_hp) VALUES (?, ?, ?, ?)';
  db.run(query, [id, nama, cabang, no_hp], function (err) {
    if (err) {
      console.error('❌ Error POST agen:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, message: '✅ Agen berhasil ditambahkan' });
  });
});

// 🔹 PUT update data agen
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nama, cabang, no_hp } = req.body;

  if (!nama || !cabang || !no_hp) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const query = 'UPDATE agen SET nama = ?, cabang = ?, no_hp = ? WHERE id = ?';
  db.run(query, [nama, cabang, no_hp, id], function (err) {
    if (err) {
      console.error('❌ Error PUT agen:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Agen tidak ditemukan' });
    }
    res.json({ message: '✏️ Agen berhasil diperbarui' });
  });
});

// 🔹 DELETE hapus agen
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM agen WHERE id = ?';
  db.run(query, id, function (err) {
    if (err) {
      console.error('❌ Error DELETE agen:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Agen tidak ditemukan' });
    }
    res.json({ message: '🗑️ Agen berhasil dihapus' });
  });
});

module.exports = router;
