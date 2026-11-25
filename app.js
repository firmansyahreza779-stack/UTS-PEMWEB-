const apiBaseUrl = document
  .querySelector('meta[name="api-base-url"]')
  ?.content
  .trim()
  .replace(/\/+$/, '') || window.location.origin;
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
let previewUrl;

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute('role', 'alert');

  const text = document.createElement('span');
  text.textContent = message;
  alert.append(text);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.dataset.bsDismiss = 'alert';
  closeButton.setAttribute('aria-label', 'Tutup');
  alert.append(closeButton);

  alertContainer.replaceChildren(alert);
}

function showFormError(message = '') {
  formError.textContent = message;
  formError.classList.toggle('d-none', message.length === 0);
}

async function requestJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Tidak dapat menghubungi backend. Pastikan Laravel berjalan di port 8000.');
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('Backend mengirim respons yang tidak dapat dibaca.');
  }

  if (!response.ok) {
    const validationErrors = Object.values(payload.errors || {}).flat();
    const message = validationErrors.join(' ') || payload.message || `Permintaan gagal (${response.status}).`;

    throw new Error(message);
  }

  return payload;
}

function createAddCard() {
  const column = document.createElement('div');
  column.className = 'col';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card h-100 w-100 border-0 shadow-sm align-items-center justify-content-center';
  button.style.minHeight = '30rem';
  button.setAttribute('aria-label', 'Tambah biodata anggota');
  button.addEventListener('click', () => openBiodataModal());

  const icon = document.createElement('span');
  icon.className = 'd-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white';
  icon.style.width = '5rem';
  icon.style.height = '5rem';
  icon.style.fontSize = '3rem';
  icon.textContent = '+';

  const label = document.createElement('span');
  label.className = 'visually-hidden';
  label.textContent = 'Tambah biodata';

  button.append(icon, label);
  column.append(button);

  return column;
}

function createBiodataCard(biodata) {
  const column = document.createElement('div');
  column.className = 'col';

  const card = document.createElement('article');
  card.className = 'card h-100 border-0 shadow-sm';

  if (biodata.photo_url) {
    const photo = document.createElement('img');
    photo.className = 'card-img-top';
    photo.src = biodata.photo_url;
    photo.alt = `Foto ${biodata.name}`;
    photo.style.height = '18rem';
    photo.style.objectFit = 'cover';
    photo.addEventListener('error', () => {
      photo.replaceWith(createPhotoPlaceholder());
    }, { once: true });
    card.append(photo);
  } else {
    card.append(createPhotoPlaceholder());
  }

  const body = document.createElement('div');
  body.className = 'card-body';

  const name = document.createElement('h2');
  name.className = 'h6 fw-bold text-uppercase mb-1';
  name.textContent = biodata.name;

  const nim = document.createElement('p');
  nim.className = 'small text-secondary mb-2';
  nim.textContent = `NIM ${biodata.nim}`;

  body.append(name, nim);

  if (biodata.description) {
    const description = document.createElement('p');
    description.className = 'small text-secondary mb-0';
    description.textContent = biodata.description;
    body.append(description);
  }

  const footer = document.createElement('div');
  footer.className = 'card-footer bg-white border-top d-flex gap-2';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'btn btn-sm btn-outline-primary';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => openBiodataModal(biodata));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'btn btn-sm btn-outline-danger';
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => deleteBiodata(biodata));

  footer.append(editButton, deleteButton);
  card.append(body, footer);
  column.append(card);

  return column;
}

function createPhotoPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'd-flex align-items-center justify-content-center bg-light text-secondary';
  placeholder.style.height = '18rem';
  placeholder.textContent = 'Belum ada foto';

  return placeholder;
}

async function loadBiodata() {
  listStatusElement.textContent = 'Memuat biodata anggota...';
  listStatusElement.classList.remove('d-none', 'alert-danger');
  listStatusElement.classList.add('alert-info');

  try {
    const response = await requestJson(biodataUrl);
    const biodatas = Array.isArray(response.data) ? response.data : [];
    const cards = [createAddCard(), ...biodatas.map(createBiodataCard)];

    cardsElement.replaceChildren(...cards);
    listStatusElement.classList.add('d-none');
  } catch (error) {
    listStatusElement.textContent = error.message;
    listStatusElement.classList.remove('d-none', 'alert-info');
    listStatusElement.classList.add('alert-danger');
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
  submitButton.textContent = biodata ? 'Simpan perubahan' : 'Tambah biodata';
  nameInput.value = biodata?.name ?? '';
  nimInput.value = biodata?.nim ?? '';
  descriptionInput.value = biodata?.description ?? '';
  photoInput.required = !biodata;

  if (biodata?.photo_url) {
    const currentPhoto = document.createElement('img');
    currentPhoto.src = biodata.photo_url;
    currentPhoto.alt = `Foto ${biodata.name} saat ini`;
    currentPhoto.className = 'img-thumbnail mt-2';
    currentPhoto.style.maxHeight = '8rem';
    photoPreview.append(currentPhoto);
  }

  biodataModal.show();
}

async function deleteBiodata(biodata) {
  if (!window.confirm(`Hapus biodata ${biodata.name}?`)) {
    return;
  }

  try {
    const response = await requestJson(`${biodataUrl}/${biodata.id}`, {
      method: 'DELETE',
    });
    showAlert(response.message || 'Biodata berhasil dihapus.');
    await loadBiodata();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

photoInput.addEventListener('change', () => {
  clearPhotoPreview();

  const file = photoInput.files[0];

  if (file) {
    previewUrl = URL.createObjectURL(file);
    const preview = document.createElement('img');
    preview.src = previewUrl;
    preview.alt = 'Pratinjau foto anggota';
    preview.className = 'img-thumbnail mt-2';
    preview.style.maxHeight = '8rem';
    photoPreview.append(preview);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showFormError();
  submitButton.disabled = true;

  const id = idInput.value;
  const formData = new FormData(form);

  if (!photoInput.files.length) {
    formData.delete('photo');
  }

  if (id) {
    formData.append('_method', 'PUT');
  }

  try {
    const response = await requestJson(id ? `${biodataUrl}/${id}` : biodataUrl, {
      method: 'POST',
      body: formData,
    });

    biodataModal.hide();
    showAlert(response.message || 'Biodata berhasil disimpan.');
    await loadBiodata();
  } catch (error) {
    showFormError(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById('addBiodataButton').addEventListener('click', () => openBiodataModal());
loadBiodata();
