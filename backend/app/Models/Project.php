<?php

namespace App\Models;

use Gitonomy\Git\Repository;
use Gitonomy\Git\Tree;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;
use Storage;

#[Schema(properties: [
    new Property(property: 'id', type: 'string', format: 'uuid'),
    new Property(property: 'name', type: 'string'),
    new Property(property: 'description', type: 'string'),
    new Property(property: 'x', type: 'integer', default: 0),
    new Property(property: 'y', type: 'integer', default: 0),
    new Property(property: 'zoom', type: 'number', default: 1, format: 'float'),
    new Property(property: 'default_branch', type: 'string', default: 'main'),
    new Property(property: 'url', type: 'string'),
    new Property(property: 'oid', type: 'string'),
    new Property(property: 'cwd', type: 'string', default: '/'),
    // new Property(property: 'user_id', type: 'integer'),
], required: ['id', 'name', 'description', 'x', 'y', 'zoom', 'default_branch', 'url', 'oid', 'cwd'])]
class Project extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'x',
        'y',
        'zoom',
        'default_branch',
        'url',
        'oid',
        'cwd',
        'user_id',
    ];

    protected $hidden = [
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }

    public function generateGitProject()
    {
        $repo = new Repository(storage_path('app/private').'/'.$this->name);
        // $this->url ??= $repo->run('remote', ['get-url', 'origin']);
        $tree = $repo->getHeadCommit()->getTree();
        $this->gitToBlocks($tree);
    }

    protected static function boot()
    {
        parent::boot();
        self::deleted(function ($project) {
            Storage::disk('local')->deleteDirectory($project->name);
        });
    }

    private function gitToBlocks(Tree $rootTree, ?Block $parent = null)
    {
        foreach ($rootTree->getTreeEntries() as $name => [$mode, $tree]) {
            $newRoot = $this->blocks()->create([
                'path' => $name,
            ]);
            $newRoot->block()->associate($parent);
            $newRoot->save();
            $this->gitToBlocks($tree, $newRoot);
        }

        foreach ($rootTree->getBlobEntries() as $name => [$mode, $blob]) {
            if ($parent === null && str_ends_with($name, '.md') && $blob->isText()) {
                $this->description = $blob->getContent();
                $this->save();
            }
            $newBlob = $this->blocks()->create([
                'path' => $name,
                'mimetype' => $blob->getMimetype(),
                // 'path' => ,
            ]);
            $newBlob->block()->associate($parent);
            $newBlob->save();
        }

        // foreach ($tree->getEntries() as $name => $data) {
        //     [$mode, $entry] = $data;
        //     if ($entry instanceof Tree) {
        //         dd($entry);
        //         $newRoot = $parent === null ? Block::create([
        //             'title' => $entry,
        //             'content' => ''
        //             'path' => $entry->
        //         ]) : $parent?->blocks()->create([
        //             'title' => $entry
        //         ]);
        //         gitToBlocks($entry, $newRoot);
        //     } else {

        //     }
        // }
    }
}
