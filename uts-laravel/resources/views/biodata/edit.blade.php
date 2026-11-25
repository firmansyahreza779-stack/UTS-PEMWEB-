@extends('layouts.app')

@section('content')
<div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
        <div class="card">
            <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold">Edit Biodata Anggota</h6>
            </div>
            <div class="card-body">
                <form action="{{ route('biodata.update', $biodata) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label for="name" class="form-label fw-semibold">Nama</label>
                        <input type="text"
                               class="form-control @error('name') is-invalid @enderror"
                               id="name" name="name"
                               value="{{ old('name', $biodata->name) }}"
                               required minlength="2">
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="nim" class="form-label fw-semibold">NIM</label>
                        <input type="text"
                               class="form-control @error('nim') is-invalid @enderror"
                               id="nim" name="nim"
                               value="{{ old('nim', $biodata->nim) }}"
                               pattern="\d{11}" title="NIM harus 11 digit angka"
                               required>
                        @error('nim')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-4">
                        <label for="photo" class="form-label fw-semibold">Foto</label>

                        {{-- Foto saat ini --}}
                        @if($biodata->photo && file_exists(public_path('images/' . $biodata->photo)))
                            <div class="mb-2">
                                <img src="{{ asset('images/' . $biodata->photo) }}"
                                     class="img-thumbnail" style="max-height:160px;"
                                     alt="Foto saat ini">
                                <p class="text-muted small mt-1 mb-0">
                                    Upload gambar baru untuk mengganti foto ini.
                                </p>
                            </div>
                        @endif

                        <input class="form-control @error('photo') is-invalid @enderror"
                               type="file" id="photo" name="photo" accept="image/*"
                               onchange="previewImg(this)">
                        @error('photo')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                        <div class="mt-2" id="imgPreview"></div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary btn-sm px-4">Perbarui</button>
                        <a href="{{ route('biodata.index') }}" class="btn btn-secondary btn-sm px-3">Batal</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function previewImg(input) {
    const preview = document.getElementById('imgPreview');
    preview.innerHTML = '';
    if (input.files && input.files[0]) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(input.files[0]);
        img.className = 'img-thumbnail mt-1';
        img.style.maxHeight = '180px';
        preview.appendChild(img);
    }
}
</script>
@endsection
