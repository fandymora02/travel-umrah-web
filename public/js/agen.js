const API_URL = "/api/agen"; // endpoint backend

const agenTable = document.getElementById("agenTable");
const addForm = document.getElementById("addForm");
const editForm = document.getElementById("editForm");

// 🔁 Ambil semua data agen dari backend
async function loadAgen() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    agenTable.innerHTML = "";
    if (data.length === 0) {
      agenTable.innerHTML = `
        <tr><td colspan="5" class="text-center text-muted">Belum ada data agen</td></tr>
      `;
      return;
    }

    data.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center">${row.id}</td>
        <td>${row.nama}</td>
        <td>${row.cabang}</td>
        <td>${row.no_hp}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1" onclick="openEdit('${row.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAgen('${row.id}')">Hapus</button>
        </td>
      `;
      agenTable.appendChild(tr);
    });
  } catch (err) {
    console.error("Gagal memuat data agen:", err);
  }
}

// ➕ Tambah data agen baru
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(addForm).entries());

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (res.ok) {
    addForm.reset();
    bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
    loadAgen();
  } else {
    alert("Gagal menambah agen!");
  }
});

// ✏️ Buka modal edit
async function openEdit(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();

  for (const key in data) {
    if (editForm[key]) editForm[key].value = data[key];
  }

  new bootstrap.Modal(document.getElementById("editModal")).show();
}

// 🔄 Update data agen
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(editForm).entries());

  const res = await fetch(`${API_URL}/${formData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (res.ok) {
    editForm.reset();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    loadAgen();
  } else {
    alert("Gagal memperbarui agen!");
  }
});

// ❌ Hapus data agen
async function deleteAgen(id) {
  if (!confirm("Yakin ingin menghapus data agen ini?")) return;
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (res.ok) loadAgen();
  else alert("Gagal menghapus data agen!");
}

// 🚀 Jalankan saat halaman dibuka
loadAgen();
