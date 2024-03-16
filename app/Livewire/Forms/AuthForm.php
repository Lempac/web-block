<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

enum CurrentScreen : int {
    case Auth = 0;
    case Register = 1;
    case Login = 2;
}

class AuthForm extends Form
{
    public CurrentScreen $currentScreen = CurrentScreen::Auth;
    #[Validate]
    public string $email = '', $password = '';

    public function rules(): array
    {
        return [
            "email" => $this->currentScreen == CurrentScreen::Login ? "required|email" : "required|unique:users|bail|email",
            "password" => "required|string"
        ];
    }
}
