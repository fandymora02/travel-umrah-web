const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar-wrapper");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

async function loadDashboardData() {
  document.querySelectorAll(".card h3").forEach(el => {
    el.innerText = "Loading...";
  });

  try {
    const [jamaahRes, agenRes, keuanganRes] = await Promise.all([
      fetch("/api/jamaah"),
      fetch("/api/agen"),
      fetch("/api/keuangan"),
    ]);

    const jamaah = await jamaahRes.json();
    const agen = await agenRes.json();
    const keuangan = await keuanganRes.json();

    const totalJamaah = jamaah.length;
    const totalAgen = agen.length;

    const pemasukan = keuangan
      .filter(k => k.jenis === "Pemasukan")
      .reduce((a, b) => a + b.nominal, 0);

    const pengeluaran = keuangan
      .filter(k => k.jenis === "Pengeluaran")
      .reduce((a, b) => a + b.nominal, 0);

    document.getElementById("totalJamaah").innerText = totalJamaah;
    document.getElementById("totalAgen").innerText = totalAgen;
    document.getElementById("totalPemasukan").innerText =
      "Rp " + pemasukan.toLocaleString("id-ID");
    document.getElementById("totalPengeluaran").innerText =
      "Rp " + pengeluaran.toLocaleString("id-ID");

    const ctx = document.getElementById("chartKeuangan").getContext("2d");

    const gradientIncome = ctx.createLinearGradient(0, 0, 0, 400);
    gradientIncome.addColorStop(0, "#28a745");
    gradientIncome.addColorStop(1, "#85e085");

    const gradientExpense = ctx.createLinearGradient(0, 0, 0, 400);
    gradientExpense.addColorStop(0, "#dc3545");
    gradientExpense.addColorStop(1, "#f7a6a6");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Pemasukan", "Pengeluaran"],
        datasets: [
          {
            label: "Keuangan (Rp)",
            data: [pemasukan, pengeluaran],
            backgroundColor: [gradientIncome, gradientExpense],
            borderRadius: 10,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context =>
                "Rp " + context.parsed.y.toLocaleString("id-ID"),
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutBounce",
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#555",
              font: { size: 13 },
              callback: function (value) {
                return "Rp " + value.toLocaleString("id-ID");
              },
            },
          },
          x: {
            ticks: { color: "#555", font: { size: 13 } },
          },
        },
      },
    });

    console.log("✅ Data dashboard berhasil dimuat");
  } catch (err) {
    console.error("❌ Gagal memuat data dashboard:", err);
    document.querySelectorAll(".card h3").forEach(el => {
      el.innerText = "Error";
    });
  }
}

loadDashboardData();


setInterval(loadDashboardData, 60000);


document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Yakin ingin logout, bro?")) {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
  }
});
