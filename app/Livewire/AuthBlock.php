<?php

namespace App\Livewire;

use App\Livewire\Forms\AuthForm;
use App\Models\User;
use App\Livewire\Forms\CurrentScreen;
use Auth;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

class AuthBlock extends Block
{
    public AuthForm $form;

    public function save(): RedirectResponse|Application|Redirector|\Illuminate\Foundation\Application
    {
        $user = User::create($this->validate());
        Auth::login($user);
        return redirect('/');
    }

    public function login()
    {
        return Auth::attempt($this->validate()) ? redirect('/') : $this->addError('fail', 'Invalid info!');
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
