@extends('layouts.app')

@section('content')
<div class="row g-3">

    {{-- ===== Card Tambah Anggota ===== --}}
    <div class="col-12 col-md-6 col-lg-4">
        <div class="add-card">
            <a href="{{ route('biodata.create') }}" class="add-btn">+</a>
        </div>
    </div>

    {{-- ===== Kartu tiap anggota ===== --}}
    @foreach($biodatas as $biodata)
    <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
            {{-- Foto --}}
            @if($biodata->photo && file_exists(public_path('images/' . $biodata->photo)))
                <img src="{{ asset('images/' . $biodata->photo) }}"
                     class="card-img-top" alt="{{ $biodata->name }}">
            @else
                <div class="bg-light d-flex align-items-center justify-content-center"
                     style="height:240px;">
                    <span class="text-muted small">Tidak ada foto</span>
                </div>
            @endif

            {{-- Info --}}
            <div class="card-body pb-1">
                <p class="member-name">{{ $biodata->name }}</p>
                <p class="member-desc">{{ $biodata->nim }}</p>
            </div>

            {{-- Tombol Edit & Hapus --}}
            <div class="card-footer-btns">
                <a href="{{ route('biodata.edit', $biodata) }}" class="btn-edit">Edit</a>

                <form action="{{ route('biodata.destroy', $biodata) }}" method="POST"
                      onsubmit="return confirm('Yakin ingin menghapus?');" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn-hapus">Hapus</button>
                </form>
            </div>
        </div>
    </div>
    @endforeach

</div>
@endsection
