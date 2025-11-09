const API_URL = '/api/keuangan';
const tableBody = document.getElementById('keuanganTable');
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');

async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  tableBody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.tanggal}</td>
      <td>${item.deskripsi}</td>
      <td>Rp ${Number(item.nominal).toLocaleString()}</td>
      <td>${item.jenis}</td>
      <td>
        <button class="btn btn-warning btn-sm editBtn" data-id="${item.id}">Edit</button>
        <button class="btn btn-danger btn-sm deleteBtn" data-id="${item.id}">Hapus</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.id));
  });
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', () => deleteData(btn.dataset.id));
  });
}

addForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(addForm).entries());
  
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  addForm.reset();
  bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
  loadData();
});

async function openEditModal(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();

  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  editForm.id.value = data.id;
  editForm.tanggal.value = data.tanggal;
  editForm.deskripsi.value = data.deskripsi;
  editForm.nominal.value = data.nominal;
  editForm.jenis.value = data.jenis;

  modal.show();
}

editForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id = editForm.id.value;
  const formData = Object.fromEntries(new FormData(editForm).entries());

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
  loadData();
});

async function deleteData(id) {
  if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadData();
}

loadData();