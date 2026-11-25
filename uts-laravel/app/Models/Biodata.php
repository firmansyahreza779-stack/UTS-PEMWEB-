<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'nim', 'description', 'photo'])]
class Biodata extends Model
{
    use HasFactory;

    protected $table = 'biodatas';

    protected $fillable = [
        'name',
        'nim',
        'description',
        'photo',
    ];

    protected $appends = ['photo_url'];

    protected function photoUrl(): Attribute
    {
        return Attribute::get(
<<<<<<< HEAD
            fn (): ?string => $this->photo
                ? (str_starts_with($this->photo, 'http') ? $this->photo : Storage::disk('public')->url($this->photo))
                : null
=======
            fn (): ?string => $this->photo ? url('/storage/'.$this->photo) : null
>>>>>>> 1eaada43ccb31ff9e5ed86e6908c77545682c342
        );
    }
}
