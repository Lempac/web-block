<?php

namespace App\Livewire;

use Livewire\Component;

use App\Models\Block as ModelBlock;

class Base extends Component
{
    public bool
        $pin = false,
        $hasPin = false;
    public string $blockType = "block";
    public int $x = 0, $y = 0;
    public ModelBlock $block;

    public function mount(): void
    {
        if (!isset($this->block)) return;
        $this->pin = $this->block->isPinned;
        $this->x = $this->block->x;
        $this->y = $this->block->y;
    }

    public function save(): void
    {
        $this->block->x = $this->x;
        $this->block->y = $this->y;
        $this->block->isPinned = $this->pin;
        $this->block->save();
    }

    public function dehydrate(): void
    {
        if (!isset($this->block) ) return;
        $this->save();
    }

    public function test(){
        $this->js("alert('what the fuck? base')");
    }

    public function render()
    {
        return view('livewire.base');
    }
}
