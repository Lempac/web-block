<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Auth;
use Database\Factories\UserFactory;
use Github\AuthMethod;
use Github\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

// TODO: fix settings enum to have a default value
#[Schema(schema: 'Style', description: 'User style', properties: [
    new Property(property: 'controlPosition', allOf: [new Schema(ref: '#/components/schemas/PanelPosition'), new Schema(type: 'string', default: 'bottom-left')]),
    new Property(property: 'minimapPosition', ref: '#/components/schemas/PanelPosition'),
    new Property(property: 'pathPosition', ref: '#/components/schemas/PanelPosition'),
    new Property(property: 'baseLightTheme', ref: '#/components/schemas/Themes'),
    new Property(property: 'baseDarkTheme', ref: '#/components/schemas/Themes'),
], required: ['controlPosition', 'minimapPosition', 'pathPosition', 'baseLightTheme', 'baseDarkTheme'])]

#[Schema(schema: 'Settings', description: 'User settings.', properties: [
    new Property(property: 'hideExtensions', type: 'boolean', default: true),
    new Property(property: 'defaultBranch', type: 'string', default: 'master'),
    new Property(property: 'lang', type: 'string', default: 'en'),
    new Property(property: 'style', ref: '#/components/schemas/Style'),
], required: ['hideExtensions', 'defaultBranch', 'lang', 'style'])]

#[Schema(properties: [
    new Property(property: 'name', type: 'string'),
    new Property(property: 'email', type: 'string'),
    new Property(property: 'is_admin', type: 'boolean'),
    new Property(property: 'settings', ref: '#/components/schemas/Settings'),
], required: ['name', 'email', 'is_admin', 'settings'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'github_id',
        'github_token',
        'github_refresh_token',
        'is_admin',
        'settings',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'github_token',
        'github_refresh_token',
        'github_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'settings' => 'array',
        ];
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function hasGithub(): bool
    {
        return Auth::user()->github_token != null;
    }

    public function getGithubProjects()
    {
        if (! $this->hasGithub()) {
            return [];
        }
        $client = new Client;
        // $client->api('')
        $client->authenticate($this->github_token, authMethod: AuthMethod::CLIENT_ID);
        $repos = $client->currentUser()->repositories();

        return array_map(fn ($repo) => $repo['name'], $repos);
    }

    public function getGithubProject(string $repoName)
    {
        if (! $this->hasGithub()) {
            return null;
        }
        $client = new Client;
        // Log::info("Getting github project: $repoName");
        // Log::info("Authenticating with github id: $this->github_id");
        $client->authenticate($this->github_token, authMethod: AuthMethod::CLIENT_ID);
        $repo = $client->repo()->show($this->name, $repoName);

        // return $this->projects()->create([
        //     'name' => $repo['name'],
        //     'description' => $repo['description'],
        //     'url' => $repo['html_url'],
        // ]);
        $prname = $repo['name'];
        $token = Auth::user()->github_token;
        $username = Auth::user()->name;

        return new Project([
            'name' => $repo['name'],
            'description' => $repo['description'],
            'url' => "https://$token@github.com/$username/$prname.git",
        ]);
    }
}
