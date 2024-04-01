<?php

namespace App\Livewire;

use App\Livewire\Forms\AuthForm;
use App\Models\Settings;
use App\Models\User;
use App\Livewire\Forms\CurrentScreen;
use Auth;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
class AuthBlock extends Block
{
    public AuthForm $form;

    public function register(): void
    {
        $user = User::create($this->validate());
        $user->settings()->create();
        Auth::login($user);
        redirect('/');
    }

    public function login(): void
    {
        if(Auth::attempt($this->validate())) {
            session()->regenerate();
            redirect('/');
        }
        else $this->addError("form.fail", "Invalid info!");
    }

    public function rendering(): void
    {
        if ($this->form->currentScreen == CurrentScreen::Auth) {
            $this->form->reset('email', 'password');
            $this->resetErrorBag();
            $this->resetValidation();
        }
    }
}
