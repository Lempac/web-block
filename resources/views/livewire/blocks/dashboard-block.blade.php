<div class="pointer-events-none" x-init="$nextTick(() => { $wire.$parent.x = $wire.$parent.x ?? window.innerWidth / 2; $wire.$parent.y = $wire.$parent.y ?? window.innerHeight / 2; })">
    <div class="pointer-events-none p-3 grid grid-cols-3 gap-x-4 bg-gray-800 rounded-lg">
        <button
            :class="$wire.menu == 1 ? 'bg-gray-700' : 'bg-gray-800'"
            class="p-2 px-3 border rounded-lg shadow font-normal border-gray-700 text-gray-400 pointer-events-auto"
            @click="$wire.set('menu', $wire.menu == 1 ? 0 : 1)">Projects</button>
        <button
            :class="$wire.menu == 2 ? 'bg-gray-700' : 'bg-gray-800'"
            class="p-2 px-3 border rounded-lg shadow font-normal border-gray-700 text-gray-400 pointer-events-auto"
            @click="$wire.set('menu', $wire.menu == 2 ? 0 : 2)">Settings</button>
        <button class="p-2 px-3 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700 font-normal text-gray-400 pointer-events-auto" @click="$wire.logout()">Logout</button>
    </div>
    @if($menu == \App\Livewire\Blocks\Menu::Projects)
        <div class="flex grid-flow-col gap-2 justify-items-start">
            <h2 class="font-normal text-gray-400 pointer-events-none text-center p-3 mt-2">Search:</h2>
            <input type="search" wire:model.change="search" class="@error('search') !border-red-600 !border-2 @enderror mt-2 p-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal hover:bg-gray-700 text-gray-400 pointer-events-auto">
{{--            <button @click="add" class="mt-2 p-3 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal hover:bg-gray-700 text-gray-400 pointer-events-auto">--}}
{{--                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">--}}
{{--                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />--}}
{{--                </svg>--}}
{{--            </button>--}}
        </div>
        <div class="grid gap-2 p-3 pointer-events-none bg-gray-800 rounded-lg mt-2 grid-cols-3">
            @foreach(Auth::user()->projects as $project)
                @continue(!str_contains($project->name, $search) && !empty($search))
                <livewire:blocks.project-block :key="$project->id" :$project/>
            @endforeach
            <livewire:blocks.project-block :name="$newProject->name" :visibility="$newProject->visibility" :description="$newProject->description" :fullDescription="$newProject->full_description" new/>
        {{--    <div wire:click="new" class="p-2 shadow rounded-lg border-2 hover:border-4 transition-[border-width] duration-300 ease-linear border-b-gray-600 hover:bg-gray-700 border-dashed pointer-events-auto"> --}}

        {{--    </div> --}}
        </div>
    @endif
    @if($menu == \App\Livewire\Blocks\Menu::Settings)
        <div class="grid p-3 pointer-events-none bg-gray-800 rounded-lg mt-2 gap-y-2">
            @foreach(Arr::except(Auth::user()->settings->toArray(), ['id', 'user_id', 'created_at', 'updated_at']) as $name => $value)
                <div wire:key="{{ $name }}"
                     class="grid grid-flow-col gap-2 p-2 shadow rounded-lg hover:bg-gray-700 border border-gray-700 pointer-events-auto">
                    <h2 class="pointer-events-none self-center font-normal text-gray-400">{{ ucfirst($name) }}</h2>
                    <input type="{{ \App\Livewire\Blocks\typeToInputType::tryFrom(gettype($value)) }}" @change="$wire.settingUpdate('{{$name}}', '{{gettype($value)}}', $event.target.value)" class="hover:bg-gray-700 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 p-1">
                </div>
            @endforeach
            <button class="hover:bg-gray-700 border rounded-lg shadow bg-gray-800 border-gray-700 font-normal text-gray-400 p-1 pointer-events-auto">
                Reset password
            </button>
            @unless(Auth::user()->hasGithub())
                <a href="{{ route('auth.github') }}"
                   class="px-0.5 p-2 bg-gray-100 border border-gray-300 tracking-widest ease-in-out font-semibold text-xs transition-colors rounded-lg uppercase hover:bg-gray-100 focus:bg-gray-100 text-black pointer-events-auto">
                    <img src="https://www.cdnlogo.com/logos/g/55/github.svg"
                         class="w-4 text-white mx-1 float-start" alt="">Register with GitHub
                </a>
            @endunless
        </div>
    @endif
</div>
