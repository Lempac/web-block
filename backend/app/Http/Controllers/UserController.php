<?php

namespace App\Http\Controllers;
use App\Models\User;
use Auth;
use OpenApi\Attributes\{Get, Response, RequestBody, JsonContent, Property, Items};


class UserController extends Controller
{

    #[Get(path: '/api/user', tags:['user'])]
    #[Response(response: '200', description: 'User data.', content: new JsonContent(ref: '#/components/schemas/User'))]
    #[Response(response: '401', description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function index()
    {
        return Auth::user();
    }

    public function defaultUser()
    {
        return User::default();
    }

    // #[Get(path: '/api/user/settings', tags:['user'])]
    // #[Response(response: '200', description: 'User settings.', content: new JsonContent(ref: '#/components/schemas/Settings'))]
    // #[Response(response: '401', description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    // public function indexSettings()
    // {
    //     return Auth::user()->settings;
    // }

    #[Get(path: '/api/user/repos', tags:['user'])]
    #[Response(response: '200', description: 'User repos from github.', content: new JsonContent(type:'array', items: new Items(type: 'string'), nullable: false))]
    #[Response(response: '401', description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function indexRepos()
    {
        return Auth::user()->getGithubProjects();
    }
}