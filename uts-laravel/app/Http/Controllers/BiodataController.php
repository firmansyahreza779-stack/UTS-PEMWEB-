<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BiodataController extends Controller
{
    public function index(Request $request)
    {
        $biodatas = Biodata::query()->latest()->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'data' => $biodatas,
            ]);
        }

        return view('biodata.index', compact('biodatas'));
    }

    public function create()
    {
        return view('biodata.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'max:50', 'unique:biodatas,nim'],
            'description' => ['nullable', 'string', 'max:5000'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('biodata', 'public');
        }

        $biodata = Biodata::query()->create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Biodata berhasil ditambahkan.',
                'data' => $biodata,
            ], 201);
        }

        return redirect()->route('biodata.index')->with('success', 'Biodata berhasil ditambahkan.');
    }

    public function show(Request $request, Biodata $biodata)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'data' => $biodata,
            ]);
        }

        return view('biodata.show', compact('biodata'));
    }

    public function edit(Biodata $biodata)
    {
        return view('biodata.edit', compact('biodata'));
    }

    public function update(Request $request, Biodata $biodata)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'nim' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('biodatas', 'nim')->ignore($biodata->id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'photo' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $oldPhoto = $biodata->photo;

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('biodata', 'public');
        }

        $biodata->update($validated);

        if ($oldPhoto && array_key_exists('photo', $validated)) {
            Storage::disk('public')->delete($oldPhoto);
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Biodata berhasil diperbarui.',
                'data' => $biodata->refresh(),
            ]);
        }

        return redirect()->route('biodata.index')->with('success', 'Biodata berhasil diperbarui.');
    }

    public function destroy(Request $request, Biodata $biodata)
    {
        $photo = $biodata->photo;
        $biodata->delete();

        if ($photo) {
            Storage::disk('public')->delete($photo);
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Biodata berhasil dihapus.',
            ]);
        }

        return redirect()->route('biodata.index')->with('success', 'Biodata berhasil dihapus.');
    }
}
