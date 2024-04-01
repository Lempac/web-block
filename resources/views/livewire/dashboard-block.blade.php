@extends('livewire.block')
@section('content')
    <div class="pointer-events-none p-3 grid grid-cols-3 min-w-max min-h-max w-full h-full gap-x-4 bg-gray-800 rounded-lg">
        @switch($menu)
            @case(\App\Livewire\Menu::None)
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 1)">Projects</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 2)">Settings</button>
                @break
            @case(\App\Livewire\Menu::Projects)
                <button class="p-2 px-3 border rounded-lg shadow border-gray-700 bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 0)">Projects</button>
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 2)">Settings</button>
                @break
            @case(\App\Livewire\Menu::Settings)
                <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 1)">Projects</button>
                <button class="p-2 px-3 border rounded-lg shadow border-gray-700 bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('menu', 0)">Settings</button>
                @break
        @endswitch
        <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click='logout'>Logout</button>
    </div>
    @switch($menu)
        @case(\App\Livewire\Menu::Projects)

            @break
        @case(\App\Livewire\Menu::Settings)

            @break
    @endswitch
@endsection

@script
    <script>
        let main = $wire.el;
        $wire.set('x', window.innerWidth/ 2);
        $wire.set('y', window.innerHeight / 2);
    </script>
@endscript
