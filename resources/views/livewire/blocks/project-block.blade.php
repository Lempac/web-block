<div wire:target="delete, updateProject, open" wire:loading.class.remove="pointer-events-auto" wire:loading.class="opacity-40" wire:click.self="open" class="p-2 grid grid-flow-row gap-2 shadow rounded-lg border transition-[border-width] duration-300 ease-linear text-center hover:border-4 border-gray-700 pointer-events-auto cursor-pointer">
    <div class="gap-2 grid grid-flow-col">
        <textarea wire:model.change="name" class="@error('name') !border-red-600 !border-2 @enderror @if($name != $project?->name) border-amber-200 border-2 @endif font-normal text-gray-400 bg-gray-700 rounded-lg shadow p-2 max-h-min overscroll-none resize-none overflow-hidden break-words"></textarea>
        <button class="@if(!isset($project) || $visibility->value != $project?->visibility) !border-amber-200 !border-2 @endif shadow rounded-lg hover:bg-gray-700 border border-gray-700 p-2" @click="$wire.set('visibility', $wire.visibility == 'public' ? 'private' : 'public')" title="Toggle project visibility">
            <template x-if="$wire.visibility == 'public'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </template>
            <template x-if="$wire.visibility == 'private'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </template>
        </button>
        <button title="Extend description" @click="$wire.$toggle('moreInfo')" class="@if($fullDescription != $project?->full_description) !border-amber-200 !border-2 @endif shadow rounded-lg hover:bg-gray-700 border border-gray-700 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        </button>
        <button title="Delete project" class="shadow rounded-lg hover:bg-gray-700 border border-gray-700 p-2" @click="if(confirm('Are you sure you want to delete \'{{$this->name}}\' project?')){ $wire.delete(); $wire.$parent.$refresh(); }" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        </button>
        @if($project?->name != $name || $project?->visibility != $visibility->value || $project?->full_description != $fullDescription)
            @unless($new)
            <button wire:click="updateProject" class="shadow rounded-lg hover:bg-green-600 border border-gray-700 p-1 transition-[background-color] ease-in" title="Confirm changes">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
            @endunless
            <button wire:click="resetProject" class="shadow rounded-lg hover:bg-white border border-gray-700 p-2 transition-[background-color] ease-in" title="Reset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            </button>
        @endif
        @if($new)
            <button @click="$wire.newProject(); $wire.$parent.$refresh()" class="shadow rounded-lg hover:bg-green-700 border border-gray-700 p-2 transition-[background-color] ease-in" title="Reset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        @endif
    </div>

    @if($moreInfo)
    <textarea wire:model.change="fullDescription" class="@if($fullDescription != $project?->full_description) !border-amber-200 !border-2 @endif shadow rounded-lg font-normal text-gray-400 bg-gray-900 hover:bg-gray-700 border border-gray-700 resize-none overflow-hidden hover:overflow-auto p-2 pb-[24px]"></textarea>
    @endif


{{--    <div class="rounded-b-lg border">--}}
{{--        <h2>Save changes...</h2>--}}
{{--    <button wire:click="updateProject" class="shadow rounded-lg hover:bg-green-600 border border-gray-700 p-1 transition-[background-color] ease-in flex" title="Confirm changes">--}}
{{--        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">--}}
{{--            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />--}}
{{--        </svg>--}}
{{--    </button>--}}
{{--        <button wire:click="resetProject" class="shadow rounded-lg hover:bg-red-600 border border-gray-700 p-1 transition-[background-color] ease-in" title="Cancel changes">--}}
{{--            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">--}}
{{--                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />--}}
{{--            </svg>--}}
{{--        </button>--}}
{{--    </div>--}}

</div>
