<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BiodataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_biodata_seeder_creates_the_team_cards_and_public_photos_idempotently(): void
    {
        Storage::fake('public');

        $this->assertSame(0, Artisan::call('db:seed', [
            '--class' => 'Database\\Seeders\\BiodataSeeder',
            '--force' => true,
        ]));

        $this->assertDatabaseHas('biodatas', [
            'name' => "Muhammada Mi'raja Purnamastu",
            'nim' => '24010110196',
            'description' => 'Anggota tim pengembang backend.',
            'photo' => 'biodata/muhammada-miraja.jpg',
        ]);
        $this->assertDatabaseHas('biodatas', [
            'name' => 'Lalu Reza Ardiansyah',
            'nim' => '24010110173',
            'description' => 'Master yang mengerjakan frontend.',
            'photo' => 'biodata/lalu-reza.jpg',
        ]);
        Storage::disk('public')->assertExists([
            'biodata/muhammada-miraja.jpg',
            'biodata/lalu-reza.jpg',
        ]);

        $this->assertSame(0, Artisan::call('db:seed', [
            '--class' => 'Database\\Seeders\\BiodataSeeder',
            '--force' => true,
        ]));
        $this->assertDatabaseCount('biodatas', 2);
    }
}
