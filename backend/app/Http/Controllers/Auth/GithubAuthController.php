<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Carbon\Carbon;
use Laravel\Socialite\Facades\Socialite;
use Log;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\Parameter;
use OpenApi\Attributes\Response;
use OpenApi\Attributes\Schema;
use Request;

class GithubAuthController extends Controller
{
    #[Get(path: '/api/redirect', tags: ['github', 'auth'])]
    #[Response(response: '302', description: 'Redirects to GitHub for authentication.')]
    #[Response(response: '400', description: 'GitHub client redirect not configured.')]
    #[Parameter(
        name: "device_name",
        description: "A friendly name for the device initiating the login (e.g., 'web-browser', 'mobile-app'). Required to generate the API token name.",
        in: "query",
        required: true,
        schema: new Schema(type: "string")
    )]
    public function redirect(Request $request)
    {
        if (empty(config('services.github.redirect'))) {
            return response()->json(['error' => 'GitHub client redirect not configured'], 400);
        }

        // --- Store device_name in session for callback ---
        // This is crucial because the device_name comes from the frontend,
        // but the callback doesn't have direct access to the original request body/query params.
        if (!$request->has('device_name')) {
            return response()->json(['error' => 'device_name is required for GitHub redirect'], 400);
        }
        $request->session()->put('github_oauth_device_name', $request->query('device_name'));
        $request->session()->put('github_oauth_user_agent', $request->header('User-Agent'));
        $request->session()->put('github_oauth_ip_address', $request->ip());


        return Socialite::driver('github')->scopes(['repo', 'user:email'])->redirect();
    }

    #[Get(path: '/api/callback', tags: ['github', 'auth'])]
    #[Response(response: '301', description: 'Redirects to the frontend URL after authentication.')]
    #[Response(response: '400', description: 'Error during GitHub authentication.')]
    public function callback(Request $request)
    {
        // Get stored device info from session
        $deviceNameInput = $request->session()->pull('github_oauth_device_name', 'Unknown Device');
        $userAgent = $request->session()->pull('github_oauth_user_agent', 'Unknown User-Agent');
        $ipAddress = $request->session()->pull('github_oauth_ip_address', 'Unknown IP');
        $frontendurl = \App::environment('production') ? config('app.frontend_url').'/web-block' : config('app.frontend_url');
        // Handle errors from GitHub
        if ($request->has('error')) {
            Log::error('GitHub OAuth error:', $request->all());
            // Redirect to frontend error page or with an error message
            $frontendUrl = "{$frontendurl}/auth-error?message=GitHub%20authentication%20failed";
            return redirect($frontendUrl, 301);
        }

        try {
            $githubUser = Socialite::driver('github')->user();
        } catch (\Exception $e) {
            Log::error('Socialite GitHub user fetch error: ' . $e->getMessage());
            $frontendUrl = "{$frontendUrl}/auth-error?message=Could%20not%20retrieve%20GitHub%20user%20details";
            return redirect($frontendUrl, 400); // Changed to 400 as it's a server-side error with GitHub
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

        // --- Issue Sanctum API Token ---
        // Ensure user has the HasApiTokens trait
        if (!method_exists($user, 'createToken')) {
            Log::error('User model is missing HasApiTokens trait for GitHub callback.');
            $frontendUrl = "{$frontendurl}/auth-error?message=Server%20configuration%20error";
            return redirect($frontendUrl, 500);
        }

        // Generate a unique token name
        $tokenName = $deviceNameInput . ' - ' . substr(md5($userAgent . $ipAddress . $user->id . microtime()), 0, 8); // Added user ID and microtime for more uniqueness

        $token = $user->createToken($tokenName)->plainTextToken;

        // --- Redirect to Frontend with Token ---
        // Pass the token and user info as query parameters or in the URL hash.
        // Using query parameters is common for this flow.
        $redirectUrl = $frontendurl . '/auth-success?' . http_build_query([
            'token' => $token,
        ]);

        return redirect($redirectUrl, 301);
    }
}
