<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Gitonomy\Git\Repository;
use Gitonomy\Git\Tree;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Storage;

class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'default_branch',
        'url',
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
        $tree = $repo->getHeadCommit()->getTree();
        $this->gitToBlocks($tree);
    }

    protected static function boot()
    {
        parent::boot();
        self::deleted(function ($project) {
            // Generate Git project here
            Storage::disk('local')->deleteDirectory($project->name);
        });
    }
    function gitToBlocks(Tree $rootTree, ?Block $parent = null)
    {
        foreach ($rootTree->getTreeEntries() as $name => [$mode, $tree]) {
            $newRoot = $this->blocks()->create([
                'title' => $name,
                'content' => '',
                // 'path' => $tree->resolvePath(''),
            ]);
            // $parent?->attach($newRoot);
            $newRoot->block()->associate($parent);
            $newRoot->save();
            $this->gitToBlocks($tree, $newRoot);
        }
    
        foreach ($rootTree->getBlobEntries() as $name => [$mode, $blob]) {
            $newBlob = $this->blocks()->create([
                'title' => $name,
                'content' => $blob->getContent(),
                // 'path' => $blob,
            ]);
            // $parent?->attach($newBlob);
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
