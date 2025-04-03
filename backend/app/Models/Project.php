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
use OpenApi\Attributes\{Schema, Property};

#[Schema(properties: [
    new Property(property: 'id', type: 'integer'),
    new Property(property: 'name', type: 'string'),
    new Property(property: 'description', type: 'string', nullable: true),
    new Property(property: 'url', type: 'string'),
    new Property(property: 'user_id', type: 'integer'),
], required: [ 'id', 'name', 'description' ])]
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
        $this->url = $repo->run('remote',['get-url', 'origin']);
        $this->save();
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
    private function gitToBlocks(Tree $rootTree, ?Block $parent = null)
    {
        foreach ($rootTree->getTreeEntries() as $name => [$mode, $tree]) {
            $newRoot = $this->blocks()->create([
                'path' => $name,
                'content' => '',
            ]);
            $newRoot->block()->associate($parent);
            $newRoot->save();
            $this->gitToBlocks($tree, $newRoot);
        }
    
        foreach ($rootTree->getBlobEntries() as $name => [$mode, $blob]) {
            if($parent === null && str_ends_with($name, '.md') && $blob->isText()){
                $this->description = $blob->getContent();
                $this->save();
            }
            $newBlob = $this->blocks()->create([
                'path' => $name,
                'content' => $blob->getContent(),
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
