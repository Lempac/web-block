<?php

namespace App\Livewire;
use App\Models\Settings;
use App\Models\User;
use Auth;
use CzProject\GitPhp\Git;

enum Menu : int {
    case None = 0;
    case Projects = 1;
    case Settings = 2;
}

class DashboardBlock extends Block
{
    public Menu $menu = Menu::None;

    public Settings $settings;

    public function mount(int $idb = null): void
    {
        parent::mount($idb);
        $this->settings = Auth::user()->settings;
    }

    private function getProjects()
    {
        $git = new Git;

    }

    public function logout(): void
    {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();
        redirect('/');
    }
}
