<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Carbon\Carbon;
use Laravel\Socialite\Facades\Socialite;
use Log;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\Response;

class GithubAuthController extends Controller
{
    #[Get(path: '/auth/redirect', tags: ['github', 'auth'])]
    #[Response(response: '302', description: 'Redirects to GitHub for authentication.')]
    #[Response(response: '400', description: 'GitHub client redirect not configured.')]
    public function redirect()
    {
        if (empty(config('services.github.redirect'))) {
            return response()->json(['error' => 'GitHub client redirect not configured'], 400);
        }

        return Socialite::driver('github')->scopes(['repo', 'user:email'])->redirect();
    }

    #[Get(path: '/auth/callback', tags: ['github', 'auth'])]
    #[Response(response: '301', description: 'Redirects to the frontend URL after authentication.')]
    #[Response(response: '400', description: 'Error during GitHub authentication.')]
    public function callback()
    {
        if (request()->has('error')) {
            Log::error(request());

            return redirect(config('app.frontend_url'), status: 400);
        }

        $githubUser = Socialite::driver('github')->user();
        if (Auth::check()) {
            if (User::where('github_id', '=', $githubUser->getId())->count('github_id') > 0) {
                session()->flash('register-github-error', 'Already have an account with same github!');

                return response()->redirectTo(config('app.frontend_url'), status: 301);
            }
            Auth::user()->update(['name' => $githubUser->nickname, 'github_id' => $githubUser->getId(), 'github_token' => $githubUser->token, 'github_refresh_token' => $githubUser->refreshToken]);
        } else {
            Auth::login(User::updateOrCreate(['github_id' => $githubUser->getId()], ['email' => $githubUser->getEmail(), 'name' => $githubUser->nickname, 'github_token' => $githubUser->token, 'github_refresh_token' => $githubUser->refreshToken]), true);
            Auth::user()->email_verified_at = Carbon::now();
            Auth::user()->save();
        }

        return response()->redirectTo(config('app.frontend_url'), status: 301);
    }
}
