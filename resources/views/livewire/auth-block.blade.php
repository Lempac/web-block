@extends('livewire.block')
@section('content')
    @switch($form->currentScreen)
        @case(\App\Livewire\Forms\CurrentScreen::Auth)
            <div class="leading-[0] pointer-events-none">
                <input type="image" class="mr-3 hover:bg-gray-700 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto" width="64" height="64" wire:click="$set('form.currentScreen', 1)" src="images/sign-up.svg" alt="Sign-up" />
                <input type="image" class="hover:bg-gray-700 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto" width="64" height="64" wire:click="$set('form.currentScreen', 2)" src="images/login-in.svg" alt="Login" />
            </div>
        @break
        @case(\App\Livewire\Forms\CurrentScreen::Register)
            <button class="p-2 px-3 justify-self-end border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('form.currentScreen', 0)">X</button>
            <form class="grid pointer-events-none" wire:submit="save">
                <label class="pl-1 p-2 font-normal text-gray-400" for="email">Email:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="email" wire:model.change="form.email" name="email">
                <label class="pl-1 p-2 font-normal text-gray-400">Password:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="password" wire:model.change="form.password" name="password">
                <button class="mt-2 mb-2 p-2 px-3 justify-self-end border rounded-lg shadow border-gray-700 bg-gray-800 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" type="submit">Register</button>

                @error('form.email') <span class="p-2 px-3 justify-self-end  border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
                @error('form.password') <span class="p-2 px-3 justify-self-end  border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
            </form>
        @break
        @case(\App\Livewire\Forms\CurrentScreen::Login)
            <button class="p-2 px-3 justify-self-end  border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('form.currentScreen', 0)">X</button>
            <form class="grid pointer-events-none" wire:submit="login">
                @csrf
                <label class="pl-1 p-2 font-normal text-gray-400">Email:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="email" wire:model.change="form.email" name="email">
                <label class="pl-1 p-2 font-normal text-gray-400">Password:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="password" wire:model.change="form.password" name="password">
                <button class="mt-2 p-2 mb-2 px-3 justify-self-end  border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" type="submit">Login</button>
                @error('form.email') <span class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
                @error('form.password') <span class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
                @error('fail') <span class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
            </form>
        @break
    @endswitch
@overwrite
