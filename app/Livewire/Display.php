<?php

namespace App\Livewire;

use Livewire\Attributes\On;
use Livewire\Component;
use Livewire\Wireable;

class Display extends Component
{
    public int $x = 0, $y = 0;
    public array $tree = [];
}
