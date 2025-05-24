<?php

namespace App\Http\Middleware;

class EnsureFrontendRequestsAreStateful extends \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful
{
    protected function configureSecureCookieSessions(): void {}
}
