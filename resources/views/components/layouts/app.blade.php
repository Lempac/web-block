<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ $title ?? config('app.name')  }}</title>
        <meta name="description" content="Block schema website with your project.">
        @vite('resources/js/app.js')
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
