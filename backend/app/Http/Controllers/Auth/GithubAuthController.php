<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Laravel\Socialite\Facades\Socialite;
use Log;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\Response;

class GithubAuthController extends Controller
{
    #[Get(path: '/api/redirect', tags: ['github', 'auth'])]
    #[Response(response: '302', description: 'Redirects to GitHub for authentication.')]
    #[Response(response: '400', description: 'GitHub client redirect not configured.')]
    public function redirect()
    {
        if (empty(config('services.github.redirect'))) {
            return response()->json(['error' => 'GitHub client redirect not configured'], 400);
        }

        return Socialite::driver('github')->stateless()->scopes(['repo', 'user:email'])->redirect();
    }

    #[Get(path: '/api/callback', tags: ['github', 'auth'])]
    #[Response(response: '301', description: 'Redirects to the frontend URL after authentication.')]
    #[Response(response: '400', description: 'Error during GitHub authentication.')]
    public function callback()
    {
        // Get stored device info from session
        $frontendurl = config('app.frontend_url').'/web-block';

        // Handle errors from GitHub
        if (request()->has('error')) {
            Log::error('GitHub OAuth error:', request()->all());
            // Redirect to frontend error page or with an error message
            $redirectUrl = "{$frontendurl}?message=GitHub%20authentication%20failed";

            return redirect($redirectUrl, 301);
        }

        try {
            $githubUser = Socialite::driver('github')->stateless()->user();
        } catch (\Exception $e) {
            Log::error('Socialite GitHub user fetch error: '.$e->getMessage());
            $redirectUrl = "{$frontendurl}?message=Could%20not%20retrieve%20GitHub%20user%20details";

            return redirect($redirectUrl, 301);
        }

        // Find or create the user in your database
        $user = User::updateOrCreate(
            ['github_id' => $githubUser->getId()],
            [
                'email' => $githubUser->getEmail(),
                'name' => $githubUser->nickname ?? $githubUser->getName(),
                'github_token' => $githubUser->token,
                'github_refresh_token' => $githubUser->refreshToken, // May be null for GitHub
                'email_verified_at' => Carbon::now(), // Mark email as verified if coming from GitHub
            ]
        );

        if (! method_exists($user, 'createToken')) {
            Log::error('User model is missing HasApiTokens trait for GitHub callback.');
            $redirectUrl = "{$frontendurl}?message=Server%20configuration%20error";

            return redirect($redirectUrl, 301);
        }

        $userAgent = request()->header('User-Agent');
        $ipAddress = request()->ip();
        $deviceNameInput = request()->input('device_name', 'Unknown Device');

        // Generate a unique token name
        $tokenName = $deviceNameInput.' - '.substr(md5($userAgent.$ipAddress), 0, 8);

        $token = $user->createToken($tokenName)->plainTextToken;

        $redirectUrl = $frontendurl.'?'.http_build_query([
            'token' => $token,
        ]);

        return redirect($redirectUrl, 301);
    }
}
