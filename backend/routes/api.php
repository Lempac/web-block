<?php

use App\Http\Controllers\BlockController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', fn () => Auth::user())->name('user');
    Route::get('/user/settings', fn () => Auth::user()->settings)->name('user.settings');
    Route::get('/user/repos', fn() => Auth::user()->getGithubProjects())->name('user.repos');

    Route::controller(ProjectController::class)->prefix('/projects')->name('projects')->group(function () {
        Route::get('/', 'index')->name('.index');
        Route::get('/{project}', 'show')->name('.show');
        Route::post('/', 'store')->name('.store');
        Route::patch('/{project}', 'update')->name('.update');
        Route::delete('/{project}', 'destroy')->name('.destroy');
    });

    Route::controller(BlockController::class)->prefix('/blocks')->name('blocks')->group(function (){
        Route::get('/{project}', 'index')->name('.index');
        Route::get('/{block}', 'show')->name('.show');
        Route::get('/{block}/blocks', 'showBlocks')->name('.showBlocks');
        Route::post('/', 'store')->name('.store');
        Route::patch('/{block}', 'update')->name('.update');
        Route::delete('/{block}', 'destroy')->name('.destroy');
    });
});
