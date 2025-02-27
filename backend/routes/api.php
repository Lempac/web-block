<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', fn () => Auth::user())->name('user');
    Route::get('/user/settings', fn () => Auth::user()->settings)->name('user.settings');
    Route::get('/user/repos', fn() => Auth::user()->getGithubProjects())->name('user.repos');

    Route::controller(ProjectController::class)->prefix('/projects')->name('projects')->group(function () {
        Route::get('/', 'index')->name('.index');
        Route::post('/', 'store')->name('.store');
        Route::get('/{project}', 'show')->name('.show');
        Route::patch('/{project}', 'update')->name('.update');
        Route::delete('/{project}', 'destroy')->name('.destroy');
    });
});
