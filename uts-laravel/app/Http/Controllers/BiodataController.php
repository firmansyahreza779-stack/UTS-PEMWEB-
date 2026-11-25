<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;

class BiodataController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Biodata::query()->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'digits:11', 'unique:biodatas,nim'],
            'description' => ['nullable', 'string', 'max:5000'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $this->storePhoto($request->file('photo'));
        }

        $biodata = Biodata::query()->create($validated);

        return response()->json([
            'message' => 'Biodata berhasil ditambahkan.',
            'data' => $biodata,
        ], 201);
    }

    public function show(Biodata $biodata): JsonResponse
    {
        return response()->json([
            'data' => $biodata,
        ]);
    }

    public function update(Request $request, Biodata $biodata): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'nim' => [
                'sometimes',
                'required',
                'string',
                'digits:11',
                Rule::unique('biodatas', 'nim')->ignore($biodata->id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'photo' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $oldPhoto = $biodata->photo;
        $newPhoto = null;

        if ($request->hasFile('photo')) {
            $newPhoto = $this->storePhoto($request->file('photo'));
            $validated['photo'] = $newPhoto;
        }

        $biodata->update($validated);

        if ($oldPhoto && $newPhoto) {
            Storage::disk('public')->delete($oldPhoto);
        }

        return response()->json([
            'message' => 'Biodata berhasil diperbarui.',
            'data' => $biodata->refresh(),
        ]);
    }

    public function destroy(Biodata $biodata): JsonResponse
    {
        $photo = $biodata->photo;
        $biodata->delete();

        if ($photo) {
            Storage::disk('public')->delete($photo);
        }

        return response()->json([
            'message' => 'Biodata berhasil dihapus.',
        ]);
    }

    private function storePhoto(UploadedFile $photo): string
    {
        $path = $photo->store('biodata', 'public');

        if ($path === false) {
            throw new RuntimeException('Foto biodata gagal disimpan.');
        }

        return $path;
    }
}
