<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Orchid\Support\Facades\Dashboard;
use Orchid\Platform\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.test',
        ]);

        // Role::factory()->create([
        //     'name' => 'Admin',
        //     'slug' => 'admin',
        //     'permissions' => Dashboard::getAllowAllPermission()
        // ]);

        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'email_verified_at' => Carbon::now(),
        ]);
    }
}
