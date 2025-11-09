const table = document.getElementById('jamaahTable');
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');

    // 🔹 Ambil semua data
    async function loadData() {
      const res = await fetch('/api/jamaah');
      const data = await res.json();
      table.innerHTML = '';
      data.forEach(j => {
        table.innerHTML += `
          <tr>
            <td>${j.id}</td>
            <td>${j.nama}</td>
            <td>${j.alamat}</td>
            <td>${j.no_hp}</td>
            <td>${j.paket}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="editData('${j.id}', '${j.nama}', '${j.alamat}', '${j.no_hp}', '${j.paket}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteData('${j.id}')">Hapus</button>
            </td>
          </tr>`;
      });
    }

    // 🔹 Tambah data baru
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(addForm));
      await fetch('/api/jamaah', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      addForm.reset();
      bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
      loadData();
    });

    // 🔹 Edit data (tampilkan di modal)
    function editData(id, nama, alamat, no_hp, paket) {
      const modal = new bootstrap.Modal(document.getElementById('editModal'));
      editForm.id.value = id;
      editForm.nama.value = nama;
      editForm.alamat.value = alamat;
      editForm.no_hp.value = no_hp;
      editForm.paket.value = paket;
      modal.show();
    }

    // 🔹 Update data
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(editForm));
      await fetch(`/api/jamaah/${formData.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      loadData();
    });

    // 🔹 Hapus data
    async function deleteData(id) {
      if (!confirm('Yakin mau hapus data ini?')) return;
      await fetch(`/api/jamaah/${id}`, { method: 'DELETE' });
      loadData();
    }

    loadData();

