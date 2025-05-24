<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes\Delete;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\Post;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Response as R;
use OpenApi\Attributes\Schema;
#[Schema(
    schema: "AuthTokenResponse",
    properties: [
        new Property(property: "message", type: "string", example: "Login successful"),
        new Property(property: "token", type: "string", description: "Sanctum plain text API token", example: "1|abcdefghijklmnopqrstuvwxyzabcdefg")
    ],
    required: ['message', 'token']
)]
class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    #[Post(path: '/api/login', tags: ['auth'])]
    #[RequestBody(description: 'Login the user', content: new JsonContent(ref: '#/components/schemas/LoginRequest'))]
    #[R(response: 200,
        description: 'User successfully logged in and token issued.',
        content: new JsonContent(ref: '#/components/schemas/AuthTokenResponse'))]
    #[R(response: 401,
        description: 'Error with login credentials.',
        content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    #[R(response: 422,
        description: 'Validation error.',
        content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function store(LoginRequest $request)
    {

        $request->authenticate();
        // --- Grab Device Info ---
        $userAgent = $request->header('User-Agent');
        $ipAddress = $request->ip();
        $deviceNameInput = $request->input('device_name', 'Unknown Device'); // Still use input if provided

        $tokenName = $deviceNameInput.' - '.substr(md5($userAgent.$ipAddress), 0, 8); // Example: "web-client - 1a2b3c4d"

        $token = Auth::user()->createToken($tokenName)->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    #[Delete(path: '/api/logout', tags: ['auth'], security: ['sessionAuth'])]
    #[R(response: '204', description: 'User successfully logged out.')]
    public function destroy()
    {
        Auth::user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}
