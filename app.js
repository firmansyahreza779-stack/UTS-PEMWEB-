const apiBaseUrl = document
  .querySelector('meta[name="api-base-url"]')
  ?.content
  .trim()
  .replace(/\/+$/, '') || 'http://127.0.0.1:8000';

const biodataUrl = `${apiBaseUrl}/api/biodata`;
const cardsElement = document.getElementById('biodataCards');
const listStatusElement = document.getElementById('listStatus');
const alertContainer = document.getElementById('alertContainer');
const form = document.getElementById('biodataForm');
const formTitle = document.getElementById('biodataModalTitle');
const formError = document.getElementById('formError');
const idInput = document.getElementById('biodataId');
const nameInput = document.getElementById('name');
const nimInput = document.getElementById('nim');
const descriptionInput = document.getElementById('description');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreview');
const submitButton = document.getElementById('submitBiodata');
const modalElement = document.getElementById('biodataModal');
const biodataModal = bootstrap.Modal.getOrCreateInstance(modalElement);

const STORAGE_KEY = 'uts_pemweb_biodatas';

// Data bawaan sesuai identitas kelompok tim UTS
const defaultFallbackMembers = [
  {
    id: 1,
    name: 'Lalu Reza Ardiansyah',
    nim: '24010110173',
    description: '24010110173 merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup',
    photo_url: 'uts-laravel/resources/css/reza.jpeg'
  },
  {
    id: 2,
    name: "Muhammada Mi'raja Purnamastu",
    nim: '24010110196',
    description: 'dengan NIM 24010110196 merupakan pegawai dan mempunyai tugas mengerjakan back-end pada UTS ini',
    photo_url: 'uts-laravel/resources/css/raja.jpeg'
  }
];

let previewUrl;
let isBackendConnected = false;

function showAlert(message, type = 'success') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center justify-content-between py-2 px-3" role="alert">
      <span>${message}</span>
      <button type="button" class="btn-close shadow-none p-2" data-bs-dismiss="alert" aria-label="Close" style="font-size: 0.75rem;"></button>
    </div>
  `;
}

function showFormError(message = '') {
  formError.textContent = message;
  formError.classList.toggle('d-none', message.length === 0);
}

function getLocalMembers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFallbackMembers));
    return defaultFallbackMembers;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return defaultFallbackMembers;
  }
}

function saveLocalMembers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Kartu Tambah (+) Berbentuk Lingkaran Hijau di Tengah Kartu Putih
function createAddCard() {
  const column = document.createElement('div');
  column.className = 'col';

  const card = document.createElement('div');
  card.className = 'card h-100 border rounded-3 d-flex align-items-center justify-content-center bg-white shadow-sm';
  card.style.minHeight = '420px';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn rounded-circle d-flex align-items-center justify-content-center text-white border-0 shadow-sm';
  button.style.width = '74px';
  button.style.height = '74px';
  button.style.backgroundColor = '#5cb85c';
  button.style.fontSize = '2.4rem';
  button.style.lineHeight = '1';
  button.setAttribute('aria-label', 'Tambah biodata anggota');
  button.innerHTML = '<i class="bi bi-plus-lg"></i>';
  button.addEventListener('click', () => openBiodataModal());

  card.append(button);
  column.append(card);
  return column;
}

// Kartu Anggota Tim
function createBiodataCard(biodata) {
  const column = document.createElement('div');
  column.className = 'col';

  const card = document.createElement('div');
  card.className = 'card h-100 border rounded-3 bg-white shadow-sm overflow-hidden d-flex flex-column';

  // Foto
  const photoContainer = document.createElement('div');
  photoContainer.style.height = '260px';
  photoContainer.className = 'bg-light w-100 overflow-hidden';

  const photo = document.createElement('img');
  photo.className = 'w-100 h-100';
  photo.style.objectFit = 'cover';
  photo.src = biodata.photo_url || biodata.photo || 'uts-laravel/resources/css/reza.jpeg';
  photo.alt = `Foto ${biodata.name}`;
  photo.addEventListener('error', () => {
    photo.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80';
  }, { once: true });
  photoContainer.append(photo);
  card.append(photoContainer);

  // Body
  const body = document.createElement('div');
  body.className = 'card-body p-3 d-flex flex-column flex-grow-1';

  const name = document.createElement('h6');
  name.className = 'fw-bold text-dark mb-1';
  name.textContent = biodata.name;

  const desc = document.createElement('p');
  desc.className = 'text-muted small mb-3 flex-grow-1';
  desc.style.fontSize = '0.84rem';
  desc.style.lineHeight = '1.45';
  desc.textContent = biodata.description || `dengan NIM ${biodata.nim} merupakan anggota tim dalam pengerjaan UTS Pemrograman Web ini.`;

  body.append(name, desc);

  // Footer Tombol Edit & Hapus
  const footer = document.createElement('div');
  footer.className = 'd-flex gap-2 pt-2 border-top';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn-sm btn-outline-primary px-3 py-1';
  editBtn.style.fontSize = '0.82rem';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => openBiodataModal(biodata));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-sm btn-outline-danger px-3 py-1';
  deleteBtn.style.fontSize = '0.82rem';
  deleteBtn.textContent = 'Hapus';
  deleteBtn.addEventListener('click', () => deleteBiodata(biodata));

  footer.append(editBtn, deleteBtn);
  body.append(footer);
  card.append(body);
  column.append(card);

  return column;
}

async function loadBiodata() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(biodataUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('API server returned error');
    const payload = await response.json();
    const biodatas = Array.isArray(payload.data) ? payload.data : [];

    isBackendConnected = true;
    renderGrid(biodatas.length > 0 ? biodatas : getLocalMembers());
  } catch (error) {
    // Fallback mulus ke localStorage
    isBackendConnected = false;
    const local = getLocalMembers();
    renderGrid(local);
  }
}

function renderGrid(members) {
  const cards = [createAddCard(), ...members.map(createBiodataCard)];
  cardsElement.replaceChildren(...cards);

  // Update info navbar jika ada anggota
  if (members.length > 0) {
    const namaEl = document.getElementById('navbarNama');
    const nimEl = document.getElementById('navbarNim');
    if (namaEl) namaEl.textContent = `(${members[0].name})`;
    if (nimEl) nimEl.textContent = `(${members[0].nim})`;
  }
}

function clearPhotoPreview() {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = undefined;
  }
  photoPreview.replaceChildren();
}

function openBiodataModal(biodata = null) {
  form.reset();
  clearPhotoPreview();
  showFormError();
  idInput.value = biodata?.id ?? '';
  formTitle.textContent = biodata ? 'Edit Biodata Anggota' : 'Tambah Biodata Anggota';
  submitButton.textContent = biodata ? 'Simpan Perubahan' : 'Tambah Biodata';
  nameInput.value = biodata?.name ?? '';
  nimInput.value = biodata?.nim ?? '';
  descriptionInput.value = biodata?.description ?? '';

  const currentPhoto = biodata?.photo_url || biodata?.photo;
  if (currentPhoto) {
    const img = document.createElement('img');
    img.src = currentPhoto;
    img.alt = `Foto ${biodata.name}`;
    img.className = 'img-thumbnail mt-2';
    img.style.maxHeight = '140px';
    photoPreview.append(img);
  }

  biodataModal.show();
}

async function deleteBiodata(biodata) {
  if (!window.confirm(`Hapus biodata ${biodata.name}?`)) return;

  if (isBackendConnected) {
    try {
      await fetch(`${biodataUrl}/${biodata.id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' }
      });
    } catch (e) {
      console.warn('API delete failed, fallback to local', e);
    }
  }

  // Hapus dari local storage
  let local = getLocalMembers();
  local = local.filter((m) => String(m.id) !== String(biodata.id));
  saveLocalMembers(local);

  showAlert('Biodata berhasil dihapus.');
  await loadBiodata();
}

photoInput.addEventListener('change', () => {
  clearPhotoPreview();
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Pratinjau foto';
      img.className = 'img-thumbnail mt-2';
      img.style.maxHeight = '140px';
      photoPreview.replaceChildren(img);
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showFormError();
  submitButton.disabled = true;

  const id = idInput.value;
  const nameVal = nameInput.value.trim();
  const nimVal = nimInput.value.trim();
  const descVal = descriptionInput.value.trim();
  const photoFile = photoInput.files[0];

  let photoBase64 = null;
  if (photoFile) {
    photoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(photoFile);
    });
  }

  // 1. Simpan via API jika terhubung
  if (isBackendConnected) {
    try {
      const formData = new FormData(form);
      if (!photoInput.files.length) formData.delete('photo');
      if (id) formData.append('_method', 'PUT');

      await fetch(id ? `${biodataUrl}/${id}` : biodataUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
    } catch (e) {
      console.warn('Backend save failed, using local', e);
    }
  }

  // 2. Simpan di Local Storage
  const local = getLocalMembers();
  if (id) {
    const idx = local.findIndex((m) => String(m.id) === String(id));
    if (idx !== -1) {
      local[idx].name = nameVal;
      local[idx].nim = nimVal;
      local[idx].description = descVal;
      if (photoBase64) local[idx].photo_url = photoBase64;
    }
  } else {
    local.push({
      id: Date.now(),
      name: nameVal,
      nim: nimVal,
      description: descVal || `dengan NIM ${nimVal} merupakan anggota tim dalam pengerjaan UTS Pemrograman Web ini.`,
      photo_url: photoBase64 || 'uts-laravel/resources/css/reza.jpeg'
    });
  }
  saveLocalMembers(local);

  biodataModal.hide();
  showAlert(id ? 'Biodata berhasil diperbarui.' : 'Biodata berhasil ditambahkan.');
  submitButton.disabled = false;
  await loadBiodata();
});

document.getElementById('addBiodataButton').addEventListener('click', () => openBiodataModal());
loadBiodata();
