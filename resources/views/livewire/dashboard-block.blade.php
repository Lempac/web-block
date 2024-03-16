@extends('livewire.block')
@section('content')
    <div class="leading-normal pointer-events-none">
        @switch($menu)
            @case(\App\Livewire\Menu::None)
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 1)">Projects</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 2)">Settings</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click='logout'>Logout</button>
                @break
            @case(\App\Livewire\Menu::Projects)
                <button class="p-2 px-3 border rounded-lg shadow border-gray-700 bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 0)">Projects</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 2)">Settings</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click='logout'>Logout</button>
                @for ($i = 0; $i < 10; $i++)
                    <p>test</p>
                @endfor
                @break
            @case(\App\Livewire\Menu::Settings)
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 1)">Projects</button>
                <button class="p-2 px-3 border rounded-lg shadow border-gray-700 bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 0)">Settings</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click='logout'>Logout</button>
                <p>test 2</p>
                @break
        @endswitch
    </div>
@endsection

@script
    <script>
        let main = $wire.el;
        $wire.set('x', (window.innerWidth - main.offsetWidth) / 2);
        $wire.set('y', (window.innerHeight - main.offsetHeight) / 2);
    </script>
@endscript
