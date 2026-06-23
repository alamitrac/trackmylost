<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        if (User::count() === 0) {
            User::factory()->count(5)->create();
        }

        $defaultCategories = [
            'Electronics',
            'Documents',
            'Keys',
            'Clothing',
            'Pets',
            'Jewelry',
            'Bags',
            'Other',
        ];

        foreach ($defaultCategories as $name) {
            Category::firstOrCreate(['name' => $name]);
        }

        Post::factory()->count(30)->create();
    }
}
