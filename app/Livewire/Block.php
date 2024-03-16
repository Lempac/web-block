<?php

namespace App\Livewire;

use App\Models\Block as ModelBlock;
use Livewire\Attributes\Renderless;
use Livewire\Component;

class Block extends Component
{
    #[Renderless]
    public bool $selected = false;

    public int $x, $y, $h, $w;

    public ModelBlock $block;

    public function mount(int $id = null): void
    {
        $this->block = $id == null ? new ModelBlock([
            'x' => $this->x ?? 0,
            'y' => $this->y ?? 0,
            'w' => $this->w ?? 0,
            'h' => $this->h ?? 0,
        ]) : ModelBlock::findOr($id, function () {
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
        if($property == "selected") return;
        $this->block->update([
            'x' => $this->x,
            'y' => $this->y,
            'w' => $this->w,
            'h' => $this->h,
        ]);
    }
}
