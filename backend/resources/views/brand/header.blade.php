@push('head')
    <link
        href="/favicon.ico"
        id="favicon"
        rel="icon"
    >
@endpush

<div class="h2 d-flex align-items-center">
    @auth
        <x-orchid-icon path="bs.house" class="d-inline d-xl-none"/>
    @endauth
    <p class="my-0 invert {{ auth()->check() ? 'd-none d-xl-block' : '' }}">
        @if (Route::currentRouteName() === "platform.login" || auth()->check())
            {{ ucfirst(config('app.name')) }}
        @else
        <a href="{{ \App::environment('production') ? config('app.frontend_url').'/web-block' : config('app.frontend_url') }}" class="text-white">
            {{ ucfirst(config('app.name')) }}
        </a>
        @endif
    </p>
</div>