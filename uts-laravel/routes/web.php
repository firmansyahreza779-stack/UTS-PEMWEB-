<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BiodataController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Semua route CRUD biodata (index, create, store, edit, update, destroy)
Route::resource('biodata', BiodataController::class);

// Root redirect ke daftar biodata
Route::get('/', function () {
    return redirect()->route('biodata.index');
});
