<?php

namespace App\Livewire;
use Auth;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

enum Menu : int {
    case None = 0;
    case Projects = 1;
    case Settings = 2;
}

class DashboardBlock extends Block
{
    public Menu $menu = Menu::None;

    public function logout(): Application|Redirector|RedirectResponse|\Illuminate\Contracts\Foundation\Application
    {
        Auth::logout();
        return redirect('/');
    }
}
