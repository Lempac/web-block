<?php

namespace App\Livewire\Blocks;
use App\Livewire\Forms\NewProject;
use Auth;
use Exception;
use Livewire\Attributes\Validate;
use Livewire\Component;

enum Menu : int {
    case None = 0;
    case Projects = 1;
    case Settings = 2;
}

enum typeToInputType : string
{
    case string = "text";
    case int = "number";
    case bool = "checkbox";
}

class DashboardBlock extends Component
{
    public Menu $menu = Menu::None;

    #[Validate('regex:(^[\w\.-]+$)', message: 'Invalid project name!')]
    public string $search = "";
    public NewProject $newProject;

    public function mount(): void
    {
        if(Auth::user()->hasGithub()){
            Auth::user()->getGithubProjects();
        }
    }

    public function settingUpdate(string $name, string $type, string $value): void
    {
        settype( $value, $type);
        \Log::info($value);
    }

    public function add()
    {
        throw new Exception(ucfirst(__FUNCTION__).' not implemented!');
    }

    public function logout(): void
    {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();
        redirect('/');
    }
}
