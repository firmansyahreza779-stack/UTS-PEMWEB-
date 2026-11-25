<?php

namespace Tests\Feature;

use App\Models\Biodata;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BiodataApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_biodata_can_be_created_listed_updated_and_deleted(): void
    {
        $createResponse = $this->postJson('/api/biodata', [
            'name' => 'Rizki Eka Prasodjo',
            'nim' => '24010110196',
            'description' => 'Mengembangkan frontend.',
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('message', 'Biodata berhasil ditambahkan.')
            ->assertJsonPath('data.name', 'Rizki Eka Prasodjo')
            ->assertJsonPath('data.nim', '24010110196')
            ->assertJsonPath('data.photo_url', null);

        $biodata = Biodata::query()->firstOrFail();

        $this->getJson('/api/biodata')
            ->assertOk()
            ->assertJsonPath('data.0.id', $biodata->id);

        $this->getJson("/api/biodata/{$biodata->id}")
            ->assertOk()
            ->assertJsonPath('data.description', 'Mengembangkan frontend.');

        $this->putJson("/api/biodata/{$biodata->id}", [
            'name' => 'Rizki Prasodjo',
            'nim' => '24010110196',
            'description' => 'Mengembangkan backend.',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Rizki Prasodjo')
            ->assertJsonPath('data.description', 'Mengembangkan backend.');

        $this->deleteJson("/api/biodata/{$biodata->id}")
            ->assertOk();

        $this->assertDatabaseMissing('biodatas', ['id' => $biodata->id]);
    }

    public function test_nim_is_required_and_must_be_unique(): void
    {
        $this->postJson('/api/biodata', [
            'name' => 'Andi Agus Salim',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['nim']);

        Biodata::query()->create([
            'name' => 'Rizki Eka Prasodjo',
            'nim' => '24010110196',
        ]);

        $this->postJson('/api/biodata', [
            'name' => 'Andi Agus Salim',
            'nim' => '24010110196',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['nim']);

        $this->postJson('/api/biodata', [
            'name' => 'Another Member',
            'nim' => '12.11.5866',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['nim']);
    }

    public function test_photo_upload_is_returned_as_a_url_and_removed_when_biodata_is_deleted(): void
    {
        Storage::fake('public');

        $response = $this->post('/api/biodata', [
            'name' => 'Rizki Eka Prasodjo',
            'nim' => '24010110196',
            'photo' => UploadedFile::fake()->createWithContent(
                'portrait.png',
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC')
            ),
        ], ['Accept' => 'application/json']);

        $response->assertCreated();

        $biodata = Biodata::query()->firstOrFail();
        Storage::disk('public')->assertExists($biodata->photo);
        $response->assertJsonPath('data.photo_url', url('/storage/'.$biodata->photo));

        $this->post("/api/biodata/{$biodata->id}", [
            '_method' => 'PUT',
            'name' => 'Rizki Eka Prasodjo Updated',
            'nim' => '24010110196',
            'description' => 'Memperbarui profil tanpa mengganti foto.',
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Rizki Eka Prasodjo Updated');

        $this->assertDatabaseHas('biodatas', [
            'id' => $biodata->id,
            'photo' => $biodata->photo,
        ]);
        Storage::disk('public')->assertExists($biodata->photo);

        $this->deleteJson("/api/biodata/{$biodata->id}")
            ->assertOk();

        Storage::disk('public')->assertMissing($biodata->photo);
    }

    public function test_api_allows_requests_from_the_local_frontend_server(): void
    {
        $this->getJson('/api/biodata', [
            'Origin' => 'http://127.0.0.1:5500',
        ])
            ->assertOk()
            ->assertHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    }
}
