<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
})->name('user');

Route::get('/test', function (Request $request) {
    return response()->json(Auth::user()?->projects()->latest()->paginate(10));
})->name('test');

Route::controller(ProjectController::class)->prefix('/projects')->name('projects')->middleware('auth:sanctum')->group(function () {
    Route::get('/', 'index')->name('.index');
    Route::post('/', 'store')->name('.store');
    Route::get('/{project}', 'show')->name('.show');
    Route::patch('/{project}', 'update')->name('.update');
    Route::delete('/{project}', 'destroy')->name('.destroy');
});
