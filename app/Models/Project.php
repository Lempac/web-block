<?php

namespace App\Models;

use Auth;
use Github\Api\GitData\Blobs;
use Github\AuthMethod;
use Github\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

enum licenseType: string{

}

enum BlockType: string{
    case BLOB = "blob";
    case TREE = "tree";
    case COMMIT = "commit";
}

enum BlockMode: int{
    case FILE = 100644;
    case EXECUTABLE = 100755;
    case SUBDIRECTORY = 040000;
    case SUBMODULE = 160000;
    case SYMLINK = 120000;

    public function isBlob(): bool
    {
        return match ($this)
        {
            BlockMode::FILE, BlockMode::EXECUTABLE, BlockMode::SYMLINK  => true,
            default => false,
        };
    }
    public function isTree(): bool
    {
        return match ($this)
        {
            BlockMode::SUBDIRECTORY => true,
            default => false,
        };
    }

    public function isCommit(): bool
    {
        return match ($this)
        {
            BlockMode::SUBMODULE => true,
            default => false,
        };
    }
}

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'description',
        'full_description',
        'stash_path',
        'visibility',
        'default_branch',
        'sha',
        'user_id',
        'bar_id'
    ];

    public function blocks() : HasMany
    {
        return $this->hasMany(Block::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bar() : HasOne
    {
        return $this->hasOne(Block::class, "bar_id");
    }

    public function treeToProject(): void
    {
        $this->sha = $this->treeToBlocks($this->default_branch);
        $this->save();
    }

    public function treeToBlocks(string $sha): string
    {
        $client = new Client();
        $user = Auth::user();
        $client->authenticate($user->github_id, $user->github_token, AuthMethod::CLIENT_ID);
        $mainTree = $client->git()->trees()->show($user->github_name, $this->name, $sha);
        $isBlock = Block::where('sha', '=', $mainTree['sha'])->first();
        foreach ($mainTree['tree'] as $block){
            switch(BlockType::from($block['type'])){
                case BlockType::BLOB;
                        TextBlock::WhereRelation('block', 'sha', '=', $block['sha'])->updateOrCreate(['block_id' => '*'], [
                        'content' => '',
                        'title' => '',
                        'block_id' => Block::updateOrCreate(['sha' => $block['sha']], [
                            'path' => basename($block['path']),
                            'block_id' => $isBlock?->id,
                            'project_id' => $this->id,
                        ])->id
                    ]);
                    break;
                case BlockType::COMMIT;
//                    dd($client->git()->trees()->show("FrederoxDev", $block['path'], $block['sha']));
                    break;

                case BlockType::TREE;
                    Block::updateOrCreate(['sha' => $block['sha']],[
                        'path' => basename($block['path']),
                        'block_id' => $isBlock?->id,
                        'project_id' => $this->id,
                    ]);
                    $this->treeToBlocks($block['sha']);
                    break;
            }
        }
        return $mainTree['sha'];
    }

    public function isUploaded() : bool
    {
        if (!$this->user->hasGithub()) return false;
        $client = new Client();
        $client->authenticate($this->user->github_id, $this->user->github_token, AuthMethod::CLIENT_ID);
        return in_array($this->name, array_map(function ($array) {return $array['name'];},$client->user()->repositories($this->user->github_name)));
    }
}
