<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Orchid\Platform\Http\Controllers\LoginController;

class LoginControllerPatch extends LoginController
{
    public function __construct(Auth $auth)
    {
        parent::__construct($auth);
    }

    /**
     * Log the user out of the application.
     *
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $this->guard->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect(\App::environment('production') ? config('app.frontend_url').'/web-block' : config('app.frontend_url'));
    }
}
