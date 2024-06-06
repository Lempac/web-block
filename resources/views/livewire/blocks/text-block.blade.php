<div class="grid grid-cols-1 p-4 divide-y-2 divide-slate-700 pointer-events-none bg-gray-800 rounded-lg min-w-full min-h-full">
    @hasSection('header')
        @yield('header')
    @else
        <div x-data="{ content: @entangle('title') }" class="pointer-events-none pb-1">
            <h3 x-on:blur="content = $event.target.innerHTML" contenteditable class="max-h-fit max-w-fit min-w-24 font-normal text-gray-400 rounded-lg pb-2 cursor-text pointer-events-auto empty:before:content-[attr(placeholder)] empty:before:text-gray-500 empty:before:italic empty:focus:before:content-none" placeholder="{{$placeholderTitle}}">{{ $title }}</h3>
        </div>
    @endif
    <div x-data="{ content: @entangle('text') }" class="pointer-events-none pt-3">
            <h4 x-on:blur="content = $event.target.innerHTML" contenteditable class="overflow-hidden bg-gray-700 rounded-lg shadow p-1 font-normal text-gray-400 cursor-text pointer-events-auto empty:before:content-[attr(placeholder)] empty:before:text-gray-500 empty:focus:before:content-none" placeholder="{{$placeholderText}}">{{ $text }}</h4>
    </div>
</div>
