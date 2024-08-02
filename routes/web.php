<?php

use App\Livewire\Display;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', Display::class);

Route::get('/auth/github', function () {
    //\Log::debug("Running");
    // \Log::info(!str_starts_with(env('APP_URL'), env('GITHUB_REDIRECT_URL')) ||
    // empty(env('GITHUB_REDIRECT_URL')) || empty(env('GITHUB_CLIENT_ID')) || empty(env('GITHUB_CLIENT_SECRET')));
    // if(!str_starts_with(env('APP_URL'), env('GITHUB_REDIRECT_URL')) ||
    // empty(env('GITHUB_REDIRECT_URL')) || empty(env('GITHUB_CLIENT_ID')) || empty(env('GITHUB_CLIENT_SECRET')))
    // return redirect('/', status: 301);

    return Socialite::driver('github')->scopes(['repo', 'user:email'])->redirect();
})->name('auth.github');

Route::get('/auth/github/callback', function () {
    if (request()->has('error')){
        Log::error(request());
        return redirect('/', status: 301);
    }
    $githubUser = Socialite::driver('github')->stateless()->user();
    //\Log::info($githubUser->nickname);
if (Auth::check()){
        if (User::where('github_id', '=', $githubUser->getId())->count('github_id') > 0){
            session()->flash('register-github-error', 'Already have an account with same github!');
            return redirect('/', status: 301);
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
    return redirect('/', status: 301);
});
