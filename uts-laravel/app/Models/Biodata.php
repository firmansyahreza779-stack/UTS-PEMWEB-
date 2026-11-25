<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'nim', 'description', 'photo'])]
class Biodata extends Model
{
    protected $table = 'biodatas';

    protected $appends = ['photo_url'];

    protected function photoUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->photo ? url('/storage/'.$this->photo) : null
        );
    }
}
