<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TextBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'block_id'
    ];

    public function block() : BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    protected static function booted(): void
    {
        static::deleting(function(TextBlock $textBlock){
            $textBlock->block()->delete();
        });
    }
}
