<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateStyleRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Auth;
use Hash;
use OpenApi\Attributes\AdditionalProperties;
use OpenApi\Attributes\Delete;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\Patch;
use OpenApi\Attributes\PathParameter;
use OpenApi\Attributes\Put;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Response;
use OpenApi\Attributes\Schema;

class UserController extends Controller
{
    #[Get(path: '/api/user', tags: ['user'])]
    #[Response(response: 200, description: 'User data.', content: new JsonContent(ref: '#/components/schemas/User'))]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function index()
    {
        return Auth::user();
    }

    #[Put(path: '/api/user', tags: ['user'], security: ['sessionAuth'])]
    #[Patch(path: '/api/user', tags: ['user'], security: ['sessionAuth'])]
    #[RequestBody(description: 'User data to update.', content: new JsonContent(ref: '#/components/schemas/UpdateUserRequest'))]
    #[Response(response: 204, description: 'User updated.')]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function update(UpdateUserRequest $request)
    {
        $user = Auth::user();
        // Merge the new data into the user's existing attributes
        $user->update($request->safe()->only([
            'name',
            'email',
            'password',
        ]));
        // Get the existing settings
        $existingSettings = $user->settings;
        // Ensure the settings are an array
        if (! is_array($existingSettings)) {
            $existingSettings = [];
        }

        // Initialize the array if it doesn't exist
        if (! isset($existingSettings)) {
            $existingSettings = [];
        }
        // Merge the new data into the existing settings
        $existingSettings = array_merge($existingSettings, $request->safe()->only([
            'settings.hideExtensions',
            'settings.defaultBranch',
            'settings.lang',
        ])['settings']);
        // Update the settings
        $user->settings = $existingSettings;
        $user->save();

        return response()->noContent();
    }

    #[Put(path: '/api/user/style', tags: ['user'], security: ['sessionAuth'])]
    #[Patch(path: '/api/user/style', tags: ['user'], security: ['sessionAuth'])]
    #[RequestBody(description: 'User style data to update.', content: new JsonContent(ref: '#/components/schemas/UpdateStyleRequest'))]
    #[Response(response: 204, description: 'User style updated.')]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function updateStyle(UpdateStyleRequest $request)
    {
        $user = Auth::user();
        // Get the existing settings
        $existingSettings = $user->settings;
        // Ensure the settings are an array
        if (! is_array($existingSettings)) {
            $existingSettings = [];
        }

        // Initialize the style array if it doesn't exist
        if (! isset($existingSettings['style'])) {
            $existingSettings['style'] = [];
        }

        // Merge the new style data into the existing settings
        $existingSettings['style'] = array_merge($existingSettings['style'], $request->only([
            'controlPosition',
            'minimapPosition',
            'pathPosition',
            'baseLightTheme',
            'baseDarkTheme',
        ]));

        // Update the settings
        $user->settings = $existingSettings;
        $user->save();
        \App::setLocale($user->settings['lang']);

        return response()->noContent();
    }

    #[Put(path: '/api/user/password', tags: ['user'], security: ['sessionAuth'])]
    #[Patch(path: '/api/user/password', tags: ['user'], security: ['sessionAuth'])]
    #[RequestBody(description: 'User password to update.', content: new JsonContent(ref: '#/components/schemas/UpdatePasswordRequest'))]
    #[Response(response: 204, description: 'User password updated.')]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();
        $val = $request->validated();
        if ($user->has_github && ($user->password === null || $user->password === '') && $val['oldPassword']) {
            $user->password = Hash::make($val['newPassword']);
        } else {
            $user->password = Hash::make($val['newPassword']);
        }
        $user->save();

        return response()->noContent();
    }

    #[Get(path: '/api/user/repos', tags: ['user'], security: ['sessionAuth'])]
    #[Response(response: 200, description: 'User repos from github.', content: new JsonContent(type: 'object', additionalProperties: new AdditionalProperties(type: 'number'), nullable: false))]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function indexRepos()
    {
        return Auth::user()->getGithubProjects();
    }

    #[Get(path: '/api/user/repo/{name}', tags: ['user'], security: ['sessionAuth'])]
    #[PathParameter(name: 'name', required: true, schema: new Schema(type: 'string'))]
    #[Response(response: 200, description: 'Repos url.', content: new JsonContent(type: 'string', nullable: true))]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function indexRepoUrl(string $name)
    {
        $user = Auth::user();
        $token = $user->github_token;
        $username = $user->name;
        if (! $user->hasGithub) {
            return null;
        }

        return response()->json("https://$token@github.com/$username/$name.git");
    }

    #[Delete(path: '/api/user', tags: ['user'], security: ['sessionAuth'])]
    #[RequestBody(description: 'User password', content: new JsonContent(ref: '#/components/schemas/DeleteUserRequest'))]
    #[Response(response: 204, description: 'User deleted.')]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function destroy(DeleteUserRequest $request)
    {
        if ($request->user()->id !== Auth::id()) {
            abort(401, 'Unauthorized.');
        }
        Auth::user()->delete();

        return response()->noContent();
    }
}
