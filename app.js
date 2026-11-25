// app.js

// Utility to format date/time
function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const form = document.getElementById('studentForm');
const photoInput = document.getElementById('photo');
const previewDiv = document.getElementById('photoPreview');
const resultDiv = document.getElementById('result');
const commitTimeP = document.getElementById('commitTime');
const responseMsgP = document.getElementById('responseMsg');

// Show preview when a file is selected
photoInput.addEventListener('change', () => {
  previewDiv.innerHTML = '';
  const file = photoInput.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    previewDiv.appendChild(img);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Server responded with error');
    const data = await res.json();
    // Expected response: { success: true, commitTime: "2026-11-25T08:15:00Z" }
    const commitDate = data.commitTime ? new Date(data.commitTime) : new Date();
    commitTimeP.textContent = `Waktu commit (GitHub): ${formatDate(commitDate)}`;
    responseMsgP.textContent = data.message || 'Data berhasil dikirim ke backend.';
    resultDiv.classList.remove('hidden');
  } catch (err) {
    responseMsgP.textContent = `Error: ${err.message}`;
    resultDiv.classList.remove('hidden');
  }
});
