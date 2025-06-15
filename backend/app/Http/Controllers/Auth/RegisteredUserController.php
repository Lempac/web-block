<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\Post;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Response as R;
use OpenApi\Attributes\Schema;

#[Schema(schema: 'RegisterRequest', properties: [
], allOf: [
    new Schema(properties: [new Property(property: 'name', type: 'string')]),
    new Schema(ref: '#/components/schemas/LoginRequest'),
], required: ['name'])]
class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    #[Post(path: '/api/register', operationId: 'apiRegister', tags: ['auth'])]
    #[RequestBody(description: 'Create user model and login in user.', required: true, content: new JsonContent(
        ref: '#/components/schemas/RegisterRequest'
    ))]
    #[R(response: 201, description: 'User successfully registered.', content: new JsonContent(ref: '#/components/schemas/AuthTokenResponse'))]
    #[R(response: 401, description: 'Error with registering.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email:rfc,dns', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'remember' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);

        event(new Registered($user));

        // --- Grab Device Info ---
        $userAgent = $request->header('User-Agent');
        $ipAddress = $request->ip();
        $deviceNameInput = $request->input('device_name', 'Unknown Device'); // Still use input if provided

        $tokenName = $deviceNameInput.' - '.substr(md5($userAgent.$ipAddress), 0, 8); // Example: "web-client - 1a2b3c4d"

        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
        ], 201);
    }
}
