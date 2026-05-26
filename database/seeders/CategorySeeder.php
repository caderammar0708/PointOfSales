<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing categories
        Category::query()->delete();

        // Create parent categories
        $electronics = Category::create(['name' => 'Electronics', 'is_active' => true]);
        $clothing = Category::create(['name' => 'Clothing', 'is_active' => true]);
        $food = Category::create(['name' => 'Food & Beverages', 'is_active' => true]);
        $books = Category::create(['name' => 'Books & Media', 'is_active' => true]);
        $sports = Category::create(['name' => 'Sports & Outdoors', 'is_active' => true]);

        // Create child categories for Electronics
        Category::create(['name' => 'Smartphones', 'parent_id' => $electronics->id, 'is_active' => true]);
        Category::create(['name' => 'Laptops', 'parent_id' => $electronics->id, 'is_active' => true]);
        Category::create(['name' => 'Tablets', 'parent_id' => $electronics->id, 'is_active' => true]);
        Category::create(['name' => 'Headphones', 'parent_id' => $electronics->id, 'is_active' => true]);
        Category::create(['name' => 'Cameras', 'parent_id' => $electronics->id, 'is_active' => true]);

        // Create child categories for Clothing
        Category::create(['name' => 'Men\'s Clothing', 'parent_id' => $clothing->id, 'is_active' => true]);
        Category::create(['name' => 'Women\'s Clothing', 'parent_id' => $clothing->id, 'is_active' => true]);
        Category::create(['name' => 'Kids\' Clothing', 'parent_id' => $clothing->id, 'is_active' => true]);
        Category::create(['name' => 'Shoes', 'parent_id' => $clothing->id, 'is_active' => true]);
        Category::create(['name' => 'Accessories', 'parent_id' => $clothing->id, 'is_active' => true]);

        // Create child categories for Food & Beverages
        Category::create(['name' => 'Snacks', 'parent_id' => $food->id, 'is_active' => true]);
        Category::create(['name' => 'Beverages', 'parent_id' => $food->id, 'is_active' => true]);
        Category::create(['name' => 'Dairy Products', 'parent_id' => $food->id, 'is_active' => true]);
        Category::create(['name' => 'Bakery Items', 'parent_id' => $food->id, 'is_active' => true]);
        Category::create(['name' => 'Frozen Foods', 'parent_id' => $food->id, 'is_active' => true]);

        // Create child categories for Books & Media
        Category::create(['name' => 'Fiction Books', 'parent_id' => $books->id, 'is_active' => true]);
        Category::create(['name' => 'Non-Fiction Books', 'parent_id' => $books->id, 'is_active' => true]);
        Category::create(['name' => 'Educational Books', 'parent_id' => $books->id, 'is_active' => true]);
        Category::create(['name' => 'Movies & TV', 'parent_id' => $books->id, 'is_active' => true]);
        Category::create(['name' => 'Music', 'parent_id' => $books->id, 'is_active' => true]);

        // Create child categories for Sports & Outdoors
        Category::create(['name' => 'Fitness Equipment', 'parent_id' => $sports->id, 'is_active' => true]);
        Category::create(['name' => 'Outdoor Gear', 'parent_id' => $sports->id, 'is_active' => true]);
        Category::create(['name' => 'Team Sports', 'parent_id' => $sports->id, 'is_active' => true]);
        Category::create(['name' => 'Camping', 'parent_id' => $sports->id, 'is_active' => true]);
        Category::create(['name' => 'Water Sports', 'parent_id' => $sports->id, 'is_active' => true]);

        $this->command->info('Categories seeded successfully!');
    }
}
