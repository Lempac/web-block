@extends('livewire.block')
@section('content')
    <input type="image" class="mr-3 p-0 max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 font-normal text-gray-700 dark:text-gray-400" width="64" height="64" wire:click="newText" src="images/icon-textbox.svg" alt="Text"/>
    <input type="image" class="mr-3 max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 font-normal text-gray-700 dark:text-gray-400" width="64" height="64" wire:click="newFile" src="images/icon-file.svg" alt="File"/>
    <input type="image" class="max-w-sm bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 font-normal text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-100" width="64" height="64" wire:click="newFolder" src="images/icon-folder.svg" alt="Folder"/>
@endsection

@script
    <script>
        let main = $wire.el
        $wire.set('x', (window.innerWidth - main.offsetWidth) / 2);
        $wire.set('y', (window.innerHeight - main.offsetHeight) / 2);
    </script>
@endscript
