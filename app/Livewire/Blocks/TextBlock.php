<?php

namespace App\Livewire\Blocks;

use App\Models\TextBlock as ModelTextBlock;
use Livewire\Component;

class TextBlock extends Component
{
    public string $title, $text,
        $placeholderTitle = "Title here...",
        $placeholderText = "Text here...";

    public ModelTextBlock $textBlock;

    public function mount(): void
    {
        if (!isset($this->textBlock)) return;
        $this->title = $this->title ?? '';
        $this->text = $this->textBlock->content;
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
