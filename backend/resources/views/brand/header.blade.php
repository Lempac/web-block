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
        
        @if (request()->is('login'))
            {{ ucfirst(config('app.name')) }}
        @else
        <a href="{{ config('app.frontend_url') }}" class=" text-white">
            {{ ucfirst(config('app.name')) }}
        </a>
        @endif
    </p>
</div>