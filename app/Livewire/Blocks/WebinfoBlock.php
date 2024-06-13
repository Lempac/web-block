<?php

namespace App\Livewire\Blocks;

use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;
use App\Models\User;

class WebinfoBlock extends Component
{
    /* @var Collection<User> */
    public Collection $users;

    public function mount()
    {
        $this->users = User::all();
    }
    public function toggleAdmin(int $userId){
        $user = User::find($userId);
        $user->is_admin = !$user->is_admin;
        $user->save();
    }
}
