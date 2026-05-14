<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User A
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'is_verified' => 1,
        ]);

        // User B
        User::factory()->create([
            'name' => 'Collaborator',
            'email' => 'collaborator@example.com',
            'password' => bcrypt('password123'),
            'is_verified' => 1,
        ]);
    }
}
