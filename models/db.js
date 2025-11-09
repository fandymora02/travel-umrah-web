const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Tentukan path ke file database
const dbPath = path.join(__dirname, '../data/travel_umrah.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Gagal koneksi ke database:', err.message);
  else console.log('✅ Database siap digunakan');
});

// Tabel Jamaah
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jamaah (
      id TEXT PRIMARY KEY,
      nama TEXT,
      alamat TEXT,
      no_hp TEXT,
      paket TEXT
    )
  `);
  console.log('📦 Tabel "jamaah" siap digunakan');
});

// Tabel Agen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS agen (
      id TEXT PRIMARY KEY,
      nama TEXT NOT NULL,
      cabang TEXT,
      no_hp TEXT
    )
  `);
  console.log('📦 Tabel "agen" siap digunakan');
});

// Tabel Keuangan
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS keuangan (
      id TEXT PRIMARY KEY , 
      tanggal TEXT, 
      deskripsi TEXT, 
      nominal REAL, 
      jenis TEXT
    )
  `);
  console.log('📦 Tabel "keuangan" siap digunakan');
});

// Tabel Users (untuk login & register)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `);
  console.log('📦 Tabel "users" siap digunakan');
});


module.exports = db;