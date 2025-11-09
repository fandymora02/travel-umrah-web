const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar-wrapper");
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("d-none");
});

// Fetch data summary
async function loadDashboardData() {
  try {
    const [jamaahRes, agenRes, keuanganRes] = await Promise.all([
      fetch("/api/jamaah"),
      fetch("/api/agen"),
      fetch("/api/keuangan"),
    ]);

    const jamaah = await jamaahRes.json();
    const agen = await agenRes.json();
    const keuangan = await keuanganRes.json();

    // Hitung data
    document.getElementById("totalJamaah").innerText = jamaah.length;
    document.getElementById("totalAgen").innerText = agen.length;

    const pemasukan = keuangan
      .filter((k) => k.jenis === "Pemasukan")
      .reduce((a, b) => a + b.nominal, 0);
    const pengeluaran = keuangan
      .filter((k) => k.jenis === "Pengeluaran")
      .reduce((a, b) => a + b.nominal, 0);

    document.getElementById("totalPemasukan").innerText =
      "Rp " + pemasukan.toLocaleString("id-ID");
    document.getElementById("totalPengeluaran").innerText =
      "Rp " + pengeluaran.toLocaleString("id-ID");

    // Chart
    const ctx = document.getElementById("chartKeuangan");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Pemasukan", "Pengeluaran"],
        datasets: [
          {
            label: "Keuangan (Rp)",
            data: [pemasukan, pengeluaran],
            backgroundColor: ["#198754", "#dc3545"],
          },
        ],
      },
    });
  } catch (err) {
    console.error("Gagal memuat data dashboard:", err);
  }
}

loadDashboardData();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "/login.html";
});