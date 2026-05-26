<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 10 random users using factory
        // \App\Models\User::factory(10)->create();

        // Create specific users - use updateOrCreate to avoid duplicates on re-seeding
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@growdigitec.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
            ]
        );

        \App\Models\User::updateOrCreate(
            ['email' => 'user@growdigitec.com'],
            [
                'name' => 'User User',
                'password' => bcrypt('user123'),
                'role' => 'cashier',
            ]
        );

        $this->call([
            CategorySeeder::class,
            UnitSeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            SaleSeeder::class,
        ]);
    }
}