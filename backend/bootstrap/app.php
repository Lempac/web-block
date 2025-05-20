<?php

use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Middleware\LocaleMiddleware;
use App\Http\Middleware\TrustProxies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append([
            TrustProxies::class,
        ]);
        $middleware->redirectTo(env('FRONTEND_URL', 'http://localhost:3000'));
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
            LocaleMiddleware::class,
        ]);
        $middleware->alias([
            'verified' => EnsureEmailIsVerified::class,
        ]);
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
