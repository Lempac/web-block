{{-- resources/views/errors/403.blade.php --}}

{{-- Extend Orchid's authentication layout for a minimal page --}}
@extends('platform::auth')

@section('content')
    <div class="container-fluid d-flex flex-column justify-content-center align-items-center">
        <div class="text-center">
            <h1 class="display-1 text-danger">403</h1>
            <h2 class="display-4 text-warning">Access Denied</h2>
            <p class="lead">You do not have permission to access this page.</p>
            <p>
                Please contact an administrator if you believe this is an error.
            </p>
            <div class="mt-4">
                <form method="POST" action="{{ route('platform.logout') }}">
                    @csrf
                    <button type="submit" class="btn btn-primary">
                        <i class="tf-icons bs-box-arrow-right me-1"></i> Sign Out
                    </button>
                </form>
            </div>
        </div>
    </div>
@endsection