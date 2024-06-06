<div class="rounded-lg bg-gray-800 p-3 pointer-events-none min-w-full min-h-full" x-init="$nextTick(() => { $wire.$parent.x = window.innerWidth / 2; $wire.$parent.y = window.innerHeight / 2; })">
    @switch($form->currentScreen)
        @case(\App\Livewire\Forms\CurrentScreen::Auth)
            <div class="leading-[0] grid grid-cols-2 gap-x-2 justify-stretch  min-h-full">
                <div class="group">
                    <h2 class="relative top-1/2 z-20 text-gray-400 opacity-0 group-hover:opacity-100 font-bold max-w-[64px] max-h-[64px] transition-[opacity]">Register</h2>
                    <input type="image" class="group-hover:blur-sm transition-[filter] hover:bg-gray-700 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto" width="64" height="64" wire:click="$set('form.currentScreen', 1)" src="{{ Vite::asset('resources/images/register.svg') }}" alt="Register"/>
                </div>
                <div class="group">
                    <h2 class="relative top-1/2 z-20 text-nowrap text-gray-400 opacity-0 group-hover:opacity-100 font-bold max-w-[64px] max-h-[64px] transition-[opacity] text-clip">Login-in</h2>
                    <input type="image" class="group-hover:blur-sm transition-[filter] hover:bg-gray-700 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto" width="64" height="64" wire:click="$set('form.currentScreen', 2)" src="{{ Vite::asset('resources/images/log-in.svg') }}" alt="Login"/>
                </div>
            </div>
            @break
        @case(\App\Livewire\Forms\CurrentScreen::Register)
            <button class="p-2 px-3 justify-self-end border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('form.currentScreen', 0)">X</button>
            <form class="grid pointer-events-none min-w-full min-h-full " wire:submit="register">
                <label class="pl-1 p-2 font-normal text-gray-400 pointer-events-auto max-w-fit" for="email">Email:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="email" wire:model.change="form.email" name="email" id="email">
                <label class="pl-1 p-2 font-normal text-gray-400 pointer-events-auto max-w-fit" for="password">Password:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="password" wire:model.change="form.password" name="password" id="password">

                <div class="mt-4 flex pointer-events-none">
                    <a href="{{ route('auth.github') }}" class="px-0.5 p-2 bg-gray-100 border block max-w-fit border-gray-300 tracking-widest ease-in-out font-semibold text-xs transition-colors rounded-lg uppercase hover:bg-gray-100 focus:bg-gray-100 text-black pointer-events-auto">
                        <img src="https://www.cdnlogo.com/logos/g/55/github.svg" alt="" class="w-4 text-white mr-1 float-start">Register with GitHub
                    </a>
                    <button class="p-2 ml-2 border rounded-lg shadow border-gray-700 bg-gray-800 hover:bg-gray-700 font-semibold text-xs uppercase text-gray-400 pointer-events-auto" type="submit">Register</button>
                </div>

                @error('form.email') <span class="mb-2 last:mb-0 p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
                @error('form.password') <span class="mb-2 last:mb-0 p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
            </form>
            @break
        @case(\App\Livewire\Forms\CurrentScreen::Login)
            <button class="p-2 px-3 justify-self-end  border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" wire:click="$set('form.currentScreen', 0)">X</button>
            <form class="grid pointer-events-none" @submit="$wire.login()">
                <label class="pl-1 p-2 font-normal text-gray-400 pointer-events-auto max-w-fit" for="email">Email:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="email" wire:model.change="form.email" name="email" id="email">
                <label class="pl-1 p-2 font-normal text-gray-400 pointer-events-auto max-w-fit" for="password">Password:</label>
                <input class="font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-1 pointer-events-auto" type="password" wire:model.change="form.password" name="password" id="password">

                <div class="pointer-events-none flex mt-4">
                    <a href="{{ route('auth.github') }}" class="px-0.5 p-2 bg-gray-100 border block max-w-fit border-gray-300 tracking-widest ease-in-out font-semibold text-xs transition-colors rounded-lg uppercase hover:bg-gray-100 focus:bg-gray-100 text-black pointer-events-auto">
                        <img src="https://www.cdnlogo.com/logos/g/55/github.svg" alt=""  class="w-4 text-white mr-1 float-start">Login with GitHub
                    </a>
                    <button class="p-2 ml-2 justify-self-end border rounded-lg shadow border-gray-700 bg-gray-800 hover:bg-gray-700 font-semibold text-xs uppercase text-gray-400 pointer-events-auto" type="submit">Login</button>
                </div>

                @error('form.email') <span class="mb-2 last:mb-0 p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
                @error('form.password') <span class="mb-2 last:mb-0 p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
                @error('form.fail') <span class="mb-2 last:mb-0 p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 pointer-events-auto">{{ $message }}</span> @enderror
            </form>
            @break
    @endswitch
</div>
