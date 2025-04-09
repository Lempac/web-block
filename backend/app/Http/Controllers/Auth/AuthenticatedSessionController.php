<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes\Delete;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\Post;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Response as R;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    #[Post(path: '/login', tags: ['auth'])]
    #[RequestBody(description: 'Login the user', content: new JsonContent(ref: '#/components/schemas/LoginRequest'))]
    #[R(response: '204', description: 'User successfully logged in.')]
    #[R(response: '401', description: 'Error with login.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $request->session()->regenerate();

        return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    #[Delete(path: '/logout', tags: ['auth'])]
    #[R(response: '204', description: 'User successfully logged out.')]
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
