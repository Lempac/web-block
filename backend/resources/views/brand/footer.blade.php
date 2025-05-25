<p class="small text-center">
    © Copyright {{date('Y')}} 
    <a href="{{ \App::environment('production') ? config('app.frontend_url').'/web-block' : config('app.frontend_url') }}" target="_blank">
        {{ config('app.name') }}
    </a>
</p>