@switch($consoleType)
    @case(\App\Livewire\ConsoleType::Text)
        @extends('livewire.text-block')
        @section('content')

        @overwrite
        @break
    @case(\App\Livewire\ConsoleType::GUI)

        @break
    @case(\App\Livewire\ConsoleType::Web)

        @break
@endswitch
