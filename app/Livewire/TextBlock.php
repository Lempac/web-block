<?php

namespace App\Livewire;

use App\Models\TextBlock as ModelTextBlock;

class TextBlock extends Block
{
    protected $rules = [
        'textBlock.text' => ''
    ];

    public string $title;
    public string $text;
    public ModelTextBlock $textBlock;

    public function mount(int $id = null): void
    {
        parent::mount($id);
        $this->textBlock = $id == null ? new ModelTextBlock([
            'text' => $this->text ?? '',
        ]) : ModelTextBlock::findOr($id, function () {
            return ModelTextBlock::create([
                'text' => $this->text ?? '',
                'block_id' => $this->block->id
            ]);
        });

        $this->title = $this->title ?? '';
        $this->text = $this->textBlock->text;
    }

    public function updated($property): void
    {
        if($property != "text" && $property != "title") return;
        $this->textBlock->update([
            'title' => $this->title,
            'text' => $this->text
        ]);
    }
}
