<?php

use App\Http\Controllers\BiodataController;
use Illuminate\Support\Facades\Route;

Route::apiResource('biodata', BiodataController::class)
    ->parameters(['biodata' => 'biodata']);
