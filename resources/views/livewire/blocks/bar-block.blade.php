<input type="image"
       class="mr-3 p-0 max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 font-normal text-gray-700 dark:text-gray-400"
       width="64" height="64" wire:click="newText" src="{{ Vite::asset('resources/images/icon-textbox.svg') }}" alt="Text"/>
<input type="image"
       class="mr-3 max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 font-normal text-gray-700 dark:text-gray-400"
       width="64" height="64" wire:click="newFile" src="{{ Vite::asset('resources/images/icon-file.svg') }}" alt="File"/>
<input type="image"
       class="max-w-sm bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 font-normal text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-100"
       width="64" height="64" wire:click="newFolder" src="{{ Vite::asset('resources/images/icon-folder.svg') }}" alt="Folder"/>


{{--@script--}}
{{--<script>--}}
{{--    let block = $wire.$parent;--}}
{{--    if($wire.el !== undefined && block.el !== undefined) {--}}
{{--        $wire.$parent.setPosition(window.innerWidth / 2, window.innerHeight / 2);--}}
{{--    }--}}
{{--</script>--}}
{{--@endscript--}}
