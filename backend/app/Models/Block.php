<?php

namespace App\Models;

use Database\Factories\BlockFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    /** @use HasFactory<BlockFactory> */
    use HasFactory;

    protected $fillable = [
        'x',
        'y',
        'sha',
        'path',
    ];
}
