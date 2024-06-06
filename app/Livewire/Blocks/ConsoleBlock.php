<?php

namespace App\Livewire\Blocks;

enum ConsoleType : int {
    case Text = 0;
    case GUI = 1;
    case Web = 2;
}

class ConsoleBlock extends TextBlock
{
    public \App\Livewire\ConsoleType $consoleType = ConsoleType::Text;
}
