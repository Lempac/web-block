<?php

use App\Http\Controllers\LoginControllerPatch;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => ['Laravel' => app()->version(), 'App name' => env('APP_NAME')]);
Route::post('panel/logout', [LoginControllerPatch::class, 'logout'])->name('platform.logout');
require __DIR__.'/auth.php';
