<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GithubProvider;

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
Route::get('/auth/redirect', function (){
    if (empty(env('GITHUB_CLIENT_REDIRECT'))) {
        return response()->json(['error' => 'GitHub client redirect not configured'], 400);
    }
    return Socialite::driver('github')->scopes(['repo', 'user:email'])->redirect();
})->name('auth.redirect');

Route::get('auth/callback', function (){
    if (request()->has('error')){
        Log::error(request());
        return redirect('/', status: 301);
    }

    $githubUser = Socialite::driver('github')->user();
    if (Auth::check()){
        if (User::where('github_id', '=', $githubUser->getId())->count('github_id') > 0){
            session()->flash('register-github-error', 'Already have an account with same github!');
            return response()->redirectTo('/', status: 301);
        }
        Auth::user()->update([
            'github_name' => $githubUser->nickname,
            'github_id' => $githubUser->getId(),
            'github_token' => $githubUser->token,
            'github_refresh_token' => $githubUser->refreshToken,
        ]);
    }
    else
    {
        Auth::login(User::updateOrCreate(['github_id' => $githubUser->getId()],[
            'email' => $githubUser->getEmail(),
            'github_name' => $githubUser->nickname,
            'github_token' => $githubUser->token,
            'github_refresh_token' => $githubUser->refreshToken,
            'password' => bcrypt(request(Str::random()))
        ]));
    }
    return response()->redirectTo('/', status: 301);
});

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
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');
});
