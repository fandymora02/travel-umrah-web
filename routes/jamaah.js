const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 🔹 Fungsi buat ID acak unik (contoh: JM-8A3C9F)
function generateRandomId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JM-${random}`;
}

// 🔹 GET semua data jamaah
router.get('/', (req, res) => {
  db.all('SELECT * FROM jamaah', [], (err, rows) => {
    if (err) {
      console.error('Error ambil data jamaah:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// 🔹 POST tambah data jamaah baru
router.post('/', (req, res) => {
  const { nama, alamat, no_hp, paket } = req.body;
  if (!nama || !alamat || !no_hp || !paket) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const id = generateRandomId();
  const query = 'INSERT INTO jamaah (id, nama, alamat, no_hp, paket) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [id, nama, alamat, no_hp, paket], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, message: '✅ Jamaah berhasil ditambahkan' });
  });
});

// 🔹 PUT edit/update data jamaah
router.put('/:id', (req, res) => {
  const { nama, alamat, no_hp, paket } = req.body;
  const { id } = req.params;

  const query = 'UPDATE jamaah SET nama = ?, alamat = ?, no_hp = ?, paket = ? WHERE id = ?';
  db.run(query, [nama, alamat, no_hp, paket, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Jamaah tidak ditemukan' });
    res.json({ message: '✏️ Jamaah berhasil diperbarui' });
  });
});

// 🔹 DELETE hapus data jamaah
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM jamaah WHERE id = ?';
  db.run(query, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Jamaah tidak ditemukan' });
    res.json({ message: '🗑️ Jamaah berhasil dihapus' });
  });
});

module.exports = router;