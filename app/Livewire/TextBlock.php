<?php

namespace App\Livewire;

use App\Models\TextBlock as ModelTextBlock;

class TextBlock extends Block
{
    public string $title, $text,
        $placeholderTitle = "Title here...",
        $placeholderText = "Text here...";

    public ModelTextBlock $textBlock;

    public function mount(int $idb = null): void
    {
        parent::mount($idb);
        $this->textBlock = $idb == null ? new ModelTextBlock([
            'text' => $this->text ?? '',
        ]) : ModelTextBlock::findOr($idb, function ($idb) {
            return ModelTextBlock::create([
                'text' => $this->text ?? '',
                'block_id' => \App\Models\Block::find($idb)
            ]);
        });

        $this->title = $this->title ?? '';
        $this->text = $this->textBlock->text;
    }

    public function updated($property): void
    {
        parent::updated($property);
        if($property != "text" && $property != "title") return;
        $this->textBlock->update([
            'title' => $this->title,
            'text' => $this->text
        ]);
    }
}
