<?php

namespace App\Livewire;

use Livewire\Component;

class Display extends Component
{
    public int $x = 0, $y = 0;
    public float $scale = 1;

    public function updated(): void
    {
        $this->scale = max(0.1, min(5, $this->scale));
    }
}
