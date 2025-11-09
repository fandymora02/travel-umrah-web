const express = require("express");
const router = express.Router();
const db = require("../models/db");

// 🔹 Fungsi buat ID random
function generateId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString().slice(-4);
  return `TRX-${random}${time}`;
}

// 🔹 GET semua data + filter
// router.get("/", (req, res) => {
//   const { tanggalAwal, tanggalAkhir, jenis, keyword } = req.query;
//   let query = "SELECT * FROM keuangan WHERE 1=1";
//   const params = [];

//   if (tanggalAwal) {
//     query += " AND tanggal >= ?";
//     params.push(tanggalAwal);
//   }
//   if (tanggalAkhir) {
//     query += " AND tanggal <= ?";
//     params.push(tanggalAkhir);
//   }
//   if (jenis) {
//     query += " AND jenis = ?";
//     params.push(jenis);
//   }
//   if (keyword) {
//     query += " AND deskripsi LIKE ?";
//     params.push(`%${keyword}%`);
//   }

//   query += " ORDER BY tanggal DESC";

//   db.all(query, params, (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });

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


// 🔹 GET by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM keuangan WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// 🔹 POST tambah (ID random)
router.post("/", (req, res) => {
  const { tanggal, deskripsi, nominal, jenis } = req.body;
  const id = generateId();

  const query = "INSERT INTO keuangan (id, tanggal, deskripsi, nominal, jenis) VALUES (?, ?, ?, ?, ?)";
  db.run(query, [id, tanggal, deskripsi, nominal, jenis], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, message: "✅ Transaksi berhasil ditambahkan" });
  });
});

// 🔹 PUT edit
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { tanggal, deskripsi, nominal, jenis } = req.body;
  const query = "UPDATE keuangan SET tanggal=?, deskripsi=?, nominal=?, jenis=? WHERE id=?";
  db.run(query, [tanggal, deskripsi, nominal, jenis, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✏️ Transaksi berhasil diperbarui" });
  });
});

// 🔹 DELETE hapus
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM keuangan WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Transaksi berhasil dihapus" });
  });
});

module.exports = router;