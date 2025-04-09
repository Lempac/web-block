<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
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
    #[Post(path: '/register', tags: ['auth'])]
    #[RequestBody(description: 'Create user model and login in user.', required: true, content: new JsonContent(
        ref: '#/components/schemas/RegisterRequest'
    ))]
    #[R(response: '204', description: 'User successfully registered.')]
    #[R(response: '401', description: 'Error with registering.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'remember' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);

        event(new Registered($user));

        Auth::login($user, $request->remeber);

        return response()->noContent();
    }
}
