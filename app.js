// app.js - Manajemen Biodata Anggota Kelompok
const STORAGE_KEY = "uts_pemweb_biodata_list";

// Data Awal sesuai Gambar Referensi Tugas UTS
const defaultMembers = [
  {
    id: "member-1",
    name: "rizki eka prasodjo",
    nim: "12.11.5866",
    role: "12.11.5866 merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "member-2",
    name: "andi agus salim",
    nim: "12.11.6018",
    role: "dengan NIM 12.11.6018 merupakan pegawai dan mempunyai tugas mengerjakan back-end pada UTS ini",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  }
];

// Helper LocalStorage
function getStoredMembers() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMembers));
    return defaultMembers;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultMembers;
  }
}

function saveMembersToStorage(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

// Helper Tampilkan Alert Notifikasi
function triggerAlert(message, type = "success") {
  const container = document.getElementById("alertContainer");
  container.innerHTML = `
    <div class="alert alert-custom alert-dismissible fade show d-flex align-items-center justify-content-between py-2 px-3" role="alert">
      <span>${message}</span>
      <button type="button" class="btn-close shadow-none p-2" data-bs-dismiss="alert" aria-label="Close" style="font-size: 0.75rem;"></button>
    </div>
  `;
}

// Render Semua Kartu Anggota
function renderCards() {
  const members = getStoredMembers();
  const grid = document.getElementById("membersGrid");
  grid.innerHTML = "";

  // 1. KARTU PERTAMA: Tombol Tambah (+) Lingkaran Hijau di Tengah Kartu Putih (Persis Gambar)
  const addCardCol = document.createElement("div");
  addCardCol.className = "col-12 col-md-6 col-lg-4";
  addCardCol.innerHTML = `
    <div class="card card-member d-flex align-items-center justify-content-center p-4">
      <button class="btn-add-circle" title="Tambah Anggota Baru" onclick="openAddModal()">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
  `;
  grid.appendChild(addCardCol);

  // 2. KARTU ANGGOTA
  members.forEach((member) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    
    // Foto default jika kosong
    const photoUrl = member.photo && member.photo.trim() !== ""
      ? member.photo
      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80";

    const descText = member.role && member.role.trim() !== ""
      ? member.role
      : `dengan NIM ${member.nim} merupakan anggota tim dalam pengerjaan UTS Pemrograman Web ini.`;

    col.innerHTML = `
      <div class="card card-member d-flex flex-column h-100">
        <img src="${photoUrl}" alt="${member.name}" class="member-img">
        <div class="card-body p-3 d-flex flex-column">
          <h6 class="fw-bold text-dark mb-1">${member.name}</h6>
          <p class="small text-muted mb-3 flex-grow-1" style="font-size: 0.83rem; line-height: 1.4;">
            ${descText}
          </p>
          <div class="d-flex gap-2 pt-2 border-top">
            <button class="btn-outline-custom-edit" onclick="openEditModal('${member.id}')">Edit</button>
            <button class="btn-outline-custom-hapus" onclick="handleDelete('${member.id}')">Hapus</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  // Update Teks Navbar & Footer Sesuai Anggota Pertama & Kedua
  if (members.length > 0) {
    document.getElementById("navbarNama").textContent = members[0].name;
    document.getElementById("navbarNim").textContent = members[0].nim;
    document.getElementById("footerKetua").textContent = members[0].name;
    if (members.length > 1) {
      document.getElementById("footerAnggota").textContent = members[1].name;
    }
  }
}

// Inisialisasi Modal Bootstrap
let memberModalInstance = null;
let currentEditingId = null;
let uploadedPhotoBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("memberModal");
  if (modalEl) {
    memberModalInstance = new bootstrap.Modal(modalEl);
  }

  // Handle Upload Foto Preview
  const photoInput = document.getElementById("memberPhoto");
  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedPhotoBase64 = e.target.result;
        showPhotoPreview(uploadedPhotoBase64);
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle Simpan Modal
  document.getElementById("saveMemberBtn").addEventListener("click", handleSaveMember);

  // Render Pertama Kali
  renderCards();
});

function showPhotoPreview(url) {
  const box = document.getElementById("photoPreviewBox");
  box.innerHTML = `<img src="${url}" class="img-thumbnail" style="max-height: 140px; border-radius: 6px;">`;
}

// Buka Modal Tambah
window.openAddModal = function () {
  currentEditingId = null;
  uploadedPhotoBase64 = null;
  document.getElementById("memberModalLabel").textContent = "Tambah Biodata Anggota";
  document.getElementById("memberForm").reset();
  document.getElementById("photoPreviewBox").innerHTML = "";
  memberModalInstance.show();
};

// Buka Modal Edit
window.openEditModal = function (id) {
  const members = getStoredMembers();
  const target = members.find((m) => m.id === id);
  if (!target) return;

  currentEditingId = id;
  uploadedPhotoBase64 = target.photo || null;

  document.getElementById("memberModalLabel").textContent = "Edit Biodata Anggota";
  document.getElementById("memberName").value = target.name || "";
  document.getElementById("memberNim").value = target.nim || "";
  document.getElementById("memberRole").value = target.role || "";
  document.getElementById("memberPhoto").value = "";

  if (target.photo) {
    showPhotoPreview(target.photo);
  } else {
    document.getElementById("photoPreviewBox").innerHTML = "";
  }

  memberModalInstance.show();
};

// Simpan Anggota (Tambah / Edit)
function handleSaveMember() {
  const nameInput = document.getElementById("memberName").value.trim();
  const nimInput = document.getElementById("memberNim").value.trim();
  const roleInput = document.getElementById("memberRole").value.trim();

  if (!nameInput || !nimInput) {
    alert("Harap lengkapi Nama dan NIM!");
    return;
  }

  const members = getStoredMembers();

  if (currentEditingId) {
    // Mode EDIT
    const index = members.findIndex((m) => m.id === currentEditingId);
    if (index !== -1) {
      members[index].name = nameInput;
      members[index].nim = nimInput;
      members[index].role = roleInput || `dengan NIM ${nimInput} bertugas sebagai anggota kelompok.`;
      if (uploadedPhotoBase64) {
        members[index].photo = uploadedPhotoBase64;
      }
      saveMembersToStorage(members);
      triggerAlert("Biodata berhasil diperbarui.", "success");
    }
  } else {
    // Mode TAMBAH BARU
    const newMember = {
      id: "member-" + Date.now(),
      name: nameInput,
      nim: nimInput,
      role: roleInput || `dengan NIM ${nimInput} bertugas sebagai anggota tim kelompok.`,
      photo: uploadedPhotoBase64 || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80"
    };
    members.push(newMember);
    saveMembersToStorage(members);
    triggerAlert("Biodata berhasil ditambahkan.", "success");
  }

  memberModalInstance.hide();
  renderCards();
}

// Hapus Anggota
window.handleDelete = function (id) {
  if (confirm("Apakah Anda yakin ingin menghapus data anggota ini?")) {
    let members = getStoredMembers();
    members = members.filter((m) => m.id !== id);
    saveMembersToStorage(members);
    renderCards();
    triggerAlert("Biodata berhasil dihapus.", "success");
  }
};
