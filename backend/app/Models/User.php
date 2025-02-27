<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Auth;
use Github\AuthMethod;
use Github\Client;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'settings'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
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

    public function settings(): HasOne
    {
        return $this->hasOne(Settings::class);
    }

    public function hasGithub(): bool
    {
        return Auth::user()->github_token != null;
    }

    public function getGithubProjects()
    {
        if (! $this->hasGithub())
            return [];
        $client = new Client();
        $client->authenticate($this->github_id, $this->github_token, AuthMethod::CLIENT_ID);
        $repos = $client->currentUser()->repositories();
        // dd($repos);
        return array_map(fn ($repo) => $repo["name"], $repos);
    }

    public function getGithubProject(string $repoName)
    {
        if (!$this->hasGithub()) return null;
        $client = new Client();
        $client->authenticate($this->github_id, $this->github_token, AuthMethod::CLIENT_ID);
        $repo = $client->repo()->show($this->name, $repoName);
        return $this->projects()->create([
            'name' => $repo['name'],
            'description' => $repo['description'],
            'url' => $repo['html_url']
        ]);
    }
}
