<?php

namespace App\Livewire;

enum ConsoleType : int {
    case Text = 0;
    case GUI = 1;
    case Web = 2;
}

class ConsoleBlock extends TextBlock
{
    public ConsoleType $consoleType = ConsoleType::Text;
}
