const express = require("express");
const router = express.Router();
const db = require("../models/db");

// 🔹 Fungsi buat ID random
function generateId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString().slice(-4);
  return `TRX-${random}${time}`;
}

router.get('/', (req, res) => {
  db.all('SELECT * FROM keuangan', [], (err, rows) => {
    if (err) {
      console.error('Error ambil data keuangan:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM keuangan WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

router.post("/", (req, res) => {
  const { tanggal, deskripsi, nominal, jenis } = req.body;
  const id = generateId();

  const query = "INSERT INTO keuangan (id, tanggal, deskripsi, nominal, jenis) VALUES (?, ?, ?, ?, ?)";
  db.run(query, [id, tanggal, deskripsi, nominal, jenis], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, message: "✅ Transaksi berhasil ditambahkan" });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { tanggal, deskripsi, nominal, jenis } = req.body;
  const query = "UPDATE keuangan SET tanggal=?, deskripsi=?, nominal=?, jenis=? WHERE id=?";
  db.run(query, [tanggal, deskripsi, nominal, jenis, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✏️ Transaksi berhasil diperbarui" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM keuangan WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Transaksi berhasil dihapus" });
  });
});

module.exports = router;