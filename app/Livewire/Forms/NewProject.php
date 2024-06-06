<?php

namespace App\Livewire\Forms;

use App\Models\Project;
use Auth;
use Livewire\Attributes\Validate;
use Livewire\Form;


class NewProject extends Form
{
    #[Validate('regex:(^[\w\.-]+$)', message: 'Invalid project name!')]
    #[Validate('required')]
    public string $name = "This";
    #[Validate('string')]
    public string $description = "";
    #[Validate('string')]
    public string $full_description = "";
    public \App\Models\visibilityType $visibility = \App\Models\visibilityType::private;

    public function save()
    {
        $user = Auth::user();
//        if ($user->hasGithub()) {
//            $client = new Client();
//            $client->authenticate($user->github_id, $user->github_token, AuthMethod::CLIENT_ID);
//            $client->repo()->create();
//        }
        Project::create([
            'name' => $this->name,
            'description' => $this->description,
            'visibility' => $this->visibility,
        ]);
    }
}
