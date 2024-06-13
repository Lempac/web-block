<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class UpdateUser extends Form
{
    #[Validate('required|email')]
    public string $email;

    #[Validate('required|string')]
    public string $password;
    #[Validate('boolean|default:false')]
    public bool $is_admin;



}
