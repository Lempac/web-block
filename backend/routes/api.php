<?php

use App\Http\Controllers\BlockController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TranslationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/translations', [TranslationController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user');

    // Route::get('/user/settings', [UserController::class, 'indexSettings'])->name('user.settings');
    Route::get('/user/repos', [UserController::class, 'indexRepos'])->name('user.repos');

    Route::apiResource('projects', ProjectController::class);
    // Route::controller(ProjectController::class)->prefix('/projects')->name('projects')->group(function () {
    //     Route::get('/', 'index')->name('.index');
    //     Route::get('/{project}', 'show')->name('.show');
    //     Route::post('/', 'store')->name('.store');
    //     Route::patch('/{project}', 'update')->name('.update');
    //     Route::delete('/{project}', 'destroy')->name('.destroy');
    // });
    
    Route::controller(BlockController::class)->prefix('/blocks')->name('blocks')->group(function () {
        Route::get('/{project}/blocks', 'index')->name('.index');
        //     Route::get('/{block}', 'show')->name('.show');
        Route::get('/{block}/blocks', 'showBlocks')->name('.showBlocks');
        //     Route::post('/', 'store')->name('.store');
        //     Route::patch('/{block}', 'update')->name('.update');
        //     Route::delete('/{block}', 'destroy')->name('.destroy');
    });
    Route::apiResource('blocks', BlockController::class)->except(['index']);
});
