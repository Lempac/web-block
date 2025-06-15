<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GithubAuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/translations/{locate}/{module}', [TranslationController::class, 'index']);

// Route::get('/csrf-token',
// fn () => response()->json(['csrf_token' => csrf_token()])
// );
Route::post('/tokens/create', function (Request $request) {
    $token = Auth::user()->createToken($request->token_name);

    return ['token' => $token->plainTextToken];
});

Route::middleware('guest')->group(function () {
    Route::post('register', [RegisteredUserController::class, 'store'])->name('register');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login');
    //
    //    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
    //                ->name('password.request');
    //
    //    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
    //                ->name('password.email');
    //
    //    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
    //                ->name('password.reset');
    //
    //    Route::post('reset-password', [NewPasswordController::class, 'store'])
    //                ->name('password.store');
    //
});
Route::get('redirect', [GithubAuthController::class, 'redirect'])->name('auth.redirect');
Route::get('callback', [GithubAuthController::class, 'callback']);
Route::middleware('auth')->group(function () {

    //    Route::get('verify-email', EmailVerificationPromptController::class)
    //                ->name('verification.notice');
    //
    //    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
    //                ->middleware(['signed', 'throttle:6,1'])
    //                ->name('verification.verify');
    //
    //    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    //                ->middleware('throttle:6,1')
    //                ->name('verification.send');
    //
    //    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
    //                ->name('password.confirm');
    //
    //    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
    //
    //    Route::put('password', [PasswordController::class, 'update'])->name('password.update');
    //
    Route::delete('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    Route::put('/user', [UserController::class, 'update'])->name('user.update');
    Route::delete('/user', [UserController::class, 'destroy'])->name('user.destroy');

    // Route::get('/user/settings', [UserController::class, 'indexSettings'])->name('user.settings');
    Route::get('/user/repos', [UserController::class, 'indexRepos'])->name('user.repos');
    Route::get('/user/repo/{name}', [UserController::class, 'indexRepoUrl'])->name('user.repo.url');
    Route::put('/user/style', [UserController::class, 'updateStyle'])->name('user.style');
    Route::patch('/user/password', [UserController::class, 'updatePassword'])->name('user.password');

    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/create', [ProjectController::class, 'storeClientProject'])->name('projects.store.create');
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
