<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Database\Factories\BlockFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Block extends Model
{
    /** @use HasFactory<BlockFactory> */
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */

    protected $appends = ['is_folder', 'is_file'];

    protected $fillable = [
        // 'title',
        'x',
        'y',
        'path',
        'content',
        'block_id',
        'project_id'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }

    /**
     * Determine if the block is an folder.
     */

    protected function isFolder(): Attribute
    {
        return new Attribute(
            get: fn () => $this->blocks()->exists(),
        );
    }

    /**
     * Determine if the block is an folder.
     */

    protected function isFile(): Attribute
    {
        return new Attribute(
            get: fn () => $this->blocks()->doesntExist(),
        );
    }
}
