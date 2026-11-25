<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class BiodataController extends Controller
{
    /**
     * Menampilkan semua biodata anggota.
     */
    public function index()
    {
        $biodatas = Biodata::latest()->get();
        return view('biodata.index', compact('biodatas'));
    }

    /**
     * Form tambah biodata.
     */
    public function create()
    {
        return view('biodata.create');
    }

    /**
     * Simpan biodata baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|min:2|max:255',
            'nim'   => 'required|digits:11',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $photoName = null;
        if ($request->hasFile('photo')) {
            $file      = $request->file('photo');
            $photoName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $file->move(public_path('images'), $photoName);
        }

        Biodata::create([
            'name'  => $request->name,
            'nim'   => $request->nim,
            'photo' => $photoName,
        ]);

        return redirect()
            ->route('biodata.index')
            ->with('success', 'Biodata berhasil ditambahkan.');
    }

    /**
     * Form edit biodata.
     */
    public function edit(Biodata $biodata)
    {
        return view('biodata.edit', compact('biodata'));
    }

    /**
     * Perbarui biodata yang dipilih.
     */
    public function update(Request $request, Biodata $biodata)
    {
        $request->validate([
            'name'  => 'required|string|min:2|max:255',
            'nim'   => 'required|digits:11',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $photoName = $biodata->photo; // pertahankan foto lama

        if ($request->hasFile('photo')) {
            // Hapus foto lama
            if ($biodata->photo && file_exists(public_path('images/' . $biodata->photo))) {
                unlink(public_path('images/' . $biodata->photo));
            }
            $file      = $request->file('photo');
            $photoName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $file->move(public_path('images'), $photoName);
        }

        $biodata->update([
            'name'  => $request->name,
            'nim'   => $request->nim,
            'photo' => $photoName,
        ]);

        return redirect()
            ->route('biodata.index')
            ->with('success', 'Biodata berhasil diperbarui.');
    }

    /**
     * Hapus biodata yang dipilih.
     */
    public function destroy(Biodata $biodata)
    {
        if ($biodata->photo && file_exists(public_path('images/' . $biodata->photo))) {
            unlink(public_path('images/' . $biodata->photo));
        }

        $biodata->delete();

        return redirect()
            ->route('biodata.index')
            ->with('success', 'Biodata berhasil dihapus.');
    }
}
