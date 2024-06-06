<?php

namespace App\Livewire\Blocks;

use App\Livewire\Forms\AuthForm;
use App\Livewire\Forms\CurrentScreen;
use App\Models\User;
use Auth;
use Livewire\Component;

class AuthBlock extends Component
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

    public function render()
    {
        return view('livewire.blocks.auth-block');
    }
}
