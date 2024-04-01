<?php

namespace App\Livewire;

use App\Models\Block as ModelBlock;
use Livewire\Attributes\Renderless;
use Livewire\Component;

abstract class Block extends Component
{
    #[Renderless]
    public bool $selected = false, $resize = false;

    public int $x = 0, $y = 0, $h = 0, $w = 0;
    public int $minH = 0, $minW = 0;

    public ModelBlock $block;

    public function mount(int $idb = null): void
    {
        $this->block = $idb == null ? new ModelBlock([
            'x' => $this->x ?? 0,
            'y' => $this->y ?? 0,
            'w' => $this->w ?? 0,
            'h' => $this->h ?? 0,
        ]) : ModelBlock::findOr($idb, function () {
            return ModelBlock::create([
                'x' => $this->x ?? 0,
                'y' => $this->y ?? 0,
                'w' => $this->w ?? 0,
                'h' => $this->h ?? 0,
            ]);
        });

        $this->x = $this->block->x;
        $this->y = $this->block->y;
        $this->w = $this->block->w;
        $this->h = $this->block->h;
    }

    public function updated($property): void
    {
        if($property == "selected" || $property == "resize") return;
        $this->block->update([
            'x' => $this->x,
            'y' => $this->y,
            'w' => $this->w,
            'h' => $this->h,
        ]);
    }
}
