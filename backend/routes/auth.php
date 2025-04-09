<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GithubAuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    //    Route::get('register', [RegisteredUserController::class, 'create'])
    //                ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store'])->name('register');

    //    Route::get('login', [AuthenticatedSessionController::class, 'create'])
    //                ->name('login');

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
Route::get('/auth/redirect', [GithubAuthController::class, 'redirect'])->name('auth.redirect');

Route::get('auth/callback', [GithubAuthController::class, 'callback']);

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
