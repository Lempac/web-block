<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(properties: [
    new Property(property: 'id', type: 'integer'),
    new Property(property: 'x', type: 'integer', default: 0),
    new Property(property: 'y', type: 'integer', default: 0),
    new Property(property: 'width', type: 'integer', default: 0),
    new Property(property: 'height', type: 'integer', default: 0),
    new Property(property: 'path', type: 'string'),
    new Property(property: 'is_file', type: 'boolean'),
    new Property(property: 'is_folder', type: 'boolean'),
    new Property(property: 'block_id', type: 'integer', nullable: true),
    new Property(property: 'project_id', type: 'integer'),
], required: ['id', 'x', 'y', 'path', 'is_file', 'is_folder'])]
class Block extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['is_folder', 'is_file'];

    protected $fillable = [
        'x',
        'y',
        'width',
        'height',
        'path',
        'block_id',
        'project_id',
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
