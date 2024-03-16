@extends('livewire.block')
@section('content')
    <div class="grid grid-cols-1 divide-y-8 divide-slate-700 pointer-events-none">
        @hasSection('header')
            @yield('header')
        @else
            <div x-data="{ content: @entangle('title') }" class="pointer-events-none">
                <h3 x-on:blur="content = $event.target.innerHTML" contenteditable="true" class="max-h-fit max-w-fit leading-[0] bg-gray-700 font-normal text-gray-400 pb-10 justify-self-start cursor-text pointer-events-auto">{{ $title }}</h3>
            </div>
        @endif
        <div x-data="{ content: @entangle('text') }" class="pointer-events-none">
            <h4 x-on:blur="content = $event.target.innerHTML" contenteditable="true" class="overflow-hidden max-w-min max-h-min leading-[0] bg-gray-700 rounded-lg shadow min-h-28 min-w-40 p-1 font-normal text-gray-400 cursor-text pointer-events-auto">{{ $text }}</h4>
        </div>
    </div>
@overwrite
