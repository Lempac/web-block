<?php

namespace App\Models;

//use Illuminate\Contracts\Auth\MustVerifyEmail;
use Github\AuthMethod;
use Github\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use function PHPUnit\Framework\isEmpty;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'github_id',
        'github_name',
        'github_token',
        'github_refresh_token',
        'default_branch',
        'is_admin'
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getGithubProjects(): bool
    {
        if (!$this->hasGithub()) return false;
        $client = new Client();
        $client->authenticate($this->github_id, $this->github_token, AuthMethod::CLIENT_ID);
        $repos = $client->currentUser()->repositories();
        foreach ($repos as $repo){
            Project::updateOrCreate(['name' => $repo['name']], [
                'name' => $repo['name'],
                'description' => $repo['description'],
                'visibility' => $repo['visibility'],
                'default_branch' => $repo['default_branch'],
                'user_id' => $this->id
            ]);
        }
        return !isEmpty($repos);
    }

    public function getGithubProject(string $repoName) : ?Project
    {
        if (!$this->hasGithub()) return null;
        $client = new Client();
        $client->authenticate($this->github_id, $this->github_token, AuthMethod::CLIENT_ID);
        $repo = $client->repo()->show($this->github_name, $repoName);
        return Project::create([
            'id' => $repo['id'],
            'name' => $repo['name'],
            'description' => $repo['description'],
            'visibility' => $repo['visibility'],
            'user_id' => $this->id
        ]);
    }

    public function hasGithub(): bool
    {
        return Auth::user()->github_token != null;
    }

    public function projects() : HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function settings() : HasOne
    {
        return $this->hasOne(Settings::class);
    }

    protected static function booted(): void
    {
        static::created(function (User $user) {
            $user->settings()->create();
        });
    }
}
