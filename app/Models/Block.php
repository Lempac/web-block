<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Block extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'block_id',
        'x',
        'y',
        'h',
        'w'
    ];

    public function textblock(): HasOne
    {
        return $this->hasOne(TextBlock::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }

    public function project() : BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function block() : BelongsTo
    {
        return $this->belongsTo(Block::class);
    }
}
