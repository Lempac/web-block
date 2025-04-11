<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // return Storage::url(Storage::disk('public')->get('Lempac'));
    return ['Laravel' => app()->version(), 'App name' => env('APP_NAME')];
});

require __DIR__.'/auth.php';
