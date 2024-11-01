<?php

use App\Http\Controllers\Api\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(ProjectController::class)->prefix('/projects')->name('projects')->middleware('web')->group(function () {
    Route::get('/', 'index')->name('.index');
    Route::get('/create', 'create')->name('.create');
    Route::post('/', 'store')->name('.store');
    Route::get('/{project}', 'show')->name('.show');
    Route::patch('/{project}', 'update')->name('.update');
    Route::delete('/{project}', 'destroy')->name('.destroy');
});
