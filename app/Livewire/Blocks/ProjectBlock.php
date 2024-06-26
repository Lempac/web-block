<?php

namespace App\Livewire\Blocks;

use App\Models\Block;
use App\Models\Project;
use App\Models\User;
use App\Models\visibilityType;
use Auth;
use Exception;
use Github\AuthMethod;
use Github\Client;
use Livewire\Attributes\Lazy;
use Livewire\Attributes\Validate;
use Livewire\Component;

#[Lazy]
class ProjectBlock extends Component
{
    public Project $project;

    #[Validate("regex:(^[\w\.-]+$)", message: "Invalid project name!")]
    #[Validate("required")]
    public ?string $name;

    public bool $new = false;
    public ?string $description;
    public ?string $fullDescription;
    public visibilityType $visibility;

    public bool $moreInfo;

    public function getFullDescription() : string
    {
        $user = Auth::user();
        //if (!$user->hasGithub()) return "";
        $client = new Client();
        $client->authenticate($user->github_id, $user->github_token, AuthMethod::CLIENT_ID);
        $res = $client->repo()->contents()->exists($user->github_name, $this->project->name, 'README.md') ? base64_decode($client->repo()->contents()->readme($user->github_name, $this->project->name)['content']) : "";
	if(isset($this->project)){
	$this->project->full_description = $res;
	$this->project->save();
	}
	//\Log::info($res);
        return $res;
    }

    public function mount(): void
    {
	//\Log::Info(Auth::user()->github_name);
	if(!isset($this->project)) return;
        $this->name = $this->project->name;
        //$this->description = $this->project->desription;
       	$this->fullDescription = $this->project->full_description ?? $this->getFullDescription();
	$this->visibility = $this->visibility ?? visibilityType::from($this?->project->visibility);
    }

    public function open(): void
    {
        if ($this->project->blocks->count() == isset($this->project->bar_id))
        $this->project->treeToProject();
        if (!isset($this->project->bar_id)){
            $barBlock = Block::create()->project()->associate($this->project);
            $barBlock->save();
            $this->project->bar_id = $barBlock->id;
            $this->project->save();
        }
    }

    public function delete(): void
    {
        if (Auth::user()->hasGithub() && isset($this->project) && $this->project->isUploaded()){
            $user = Auth::user();
            $client = new Client();
            $client->authenticate($user->github_id, $user->github_token, AuthMethod::CLIENT_ID);
            $client->repo()->remove($user->github_name, $this->project->name);
        }
        $this->project->delete();
    }

    public function updateProject(): void
    {
        $user = Auth::user();
        if ($user->hasGithub()){
            $client = new Client();
            $client->authenticate($user->github_id, $user->github_token, AuthMethod::CLIENT_ID);
            $isUploaded = $this->project->isUploaded();
        }
        if($this->project->visibility != $this->visibility) {
            $this->project->visibility = $this->visibility->value;
            if ($user->hasGithub() && $isUploaded) $client->repo()->update($user->github_name, $this->project->name, array('private' => $this->visibility->value == 'private'));
        }
        if($this->project->name != $this->name) {
            $this->project->name = $this->name;
            if ($user->hasGithub() && $isUploaded) $client->repo()->update($user->github_name, $this->project->getOriginal('name'), array('name' => $this->project->name));
        }
        if($this->project->full_description != $this->fullDescription) {
            $this->project->full_description = $this->fullDescription;
            if($user->hasGithub() && $isUploaded){
                $committer = array('name' => $user->github_name, 'email' => $user->email);
                if ($client->repo()->contents()->exists($user->github_name, $this->project->name, 'README.md'))
                {
                    $readme = $client->repo()->contents()->readme($user->github_name, $this->project->name);
                    $oldFile = $client->repo()->contents()->show($user->github_name, $this->project->name, $readme['path']);
                    $client->repo()->contents()->update($user->github_name, $this->project->name, $readme['path'], $this->project->full_description, "User ".$user->github_name." updated readme!", $oldFile['sha'], null, $committer);
                }
                else
                {
                    $client->repo()->contents()->create($user->github_name, $this->project->name, 'README.md', $this->project->full_description, "User ".$user->github_name." created readme!", null, $committer);
                }
            }
        }
        $this->project->save();
    }

    public function newProject(): void
    {
        Project::create([
            'name' => $this->name,
            'full_description' => $this->fullDescription,
            'visibility' => $this->visibility->value,
            'description' => $this->fullDescription,
            'user_id' => Auth::user()->id,
        ]);
    }

    public function resetProject(): void
    {
        if(!isset($this->project)) return;
        $this->name = $this->project->name;
        $this->visibility = visibilityType::from($this->project->visibility);
        $this->description = $this->project->description;
        $this->fullDescription = $this->project->full_description;
        $this->resetValidation();
    }

    public function toggleVisibility(): void
    {
        $this->visibility = $this->visibility == visibilityType::public ? visibilityType::private : visibilityType::public;
    }
}
