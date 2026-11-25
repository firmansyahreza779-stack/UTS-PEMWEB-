<?php

namespace Database\Seeders;

use App\Models\Biodata;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class BiodataSeeder extends Seeder
{
    public function run(): void
    {
        $biodatas = [
            [
                'name' => 'Muhammada Miq Raja Purnamastu',
                'nim' => '24010110196',
                'description' => 'Anggota tim pengembang backend.',
                'image' => 'muhammada-miraja.jpg',
                'photo' => 'biodata/muhammada-miraja.jpg',
            ],
            [
                'name' => 'Lalu Reza Ardiansyah',
                'nim' => '24010110173',
                'description' => 'Master yang mengerjakan frontend.',
                'image' => 'lalu-reza.jpg',
                'photo' => 'biodata/lalu-reza.jpg',
            ],
        ];

        foreach ($biodatas as $biodata) {
            $imagePath = database_path('seeders/images/'.$biodata['image']);
            $photoContents = File::get($imagePath);

            if (! Storage::disk('public')->put($biodata['photo'], $photoContents)) {
                throw new RuntimeException("Unable to store biodata photo: {$biodata['photo']}");
            }

            Biodata::query()->updateOrCreate(
                ['nim' => $biodata['nim']],
                [
                    'name' => $biodata['name'],
                    'description' => $biodata['description'],
                    'photo' => $biodata['photo'],
                ],
            );
        }
    }
}
