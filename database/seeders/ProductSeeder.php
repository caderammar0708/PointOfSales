<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing products
        Product::query()->delete();

        // Get category IDs for easier reference
        $categories = Category::all()->keyBy('name');
        
        // Get unit for reference (default to pieces)
        $pcsUnit = \App\Models\Unit::where('short_name', 'pcs')->first();
        $unitId = $pcsUnit ? $pcsUnit->id : 1;

        // Electronics Products
        Product::create([
            'name' => 'iPhone 15 Pro',
            'category_id' => $categories['Smartphones']->id,
            'price' => 999.99,
            'cost_price' => 799.99,
            'unit_id' => $unitId,
            'stock' => 50,
            'product_code' => 'IPHONE15PRO',
            'image' => null
        ]);

        Product::create([
            'name' => 'Samsung Galaxy S24',
            'category_id' => $categories['Smartphones']->id,
            'price' => 899.99,
            'cost_price' => 699.99,
            'unit_id' => $unitId,
            'stock' => 35,
            'product_code' => 'GALAXYS24',
            'image' => null
        ]);

        Product::create([
            'name' => 'MacBook Pro 16"',
            'category_id' => $categories['Laptops']->id,
            'price' => 2499.99,
            'cost_price' => 1999.99,
            'unit_id' => $unitId,
            'stock' => 2,
            'product_code' => 'MACBOOKPRO16',
            'image' => null
        ]);

        Product::create([
            'name' => 'Dell XPS 15',
            'category_id' => $categories['Laptops']->id,
            'price' => 1799.99,
            'cost_price' => 1499.99,
            'unit_id' => $unitId,
            'stock' => 25,
            'product_code' => 'DELLXPS15',
            'image' => null
        ]);

        Product::create([
            'name' => 'iPad Air',
            'category_id' => $categories['Tablets']->id,
            'price' => 599.99,
            'cost_price' => 449.99,
            'unit_id' => $unitId,
            'stock' => 40,
            'product_code' => 'IPADAIR',
            'image' => null
        ]);

        Product::create([
            'name' => 'Sony WH-1000XM5',
            'category_id' => $categories['Headphones']->id,
            'price' => 399.99,
            'cost_price' => 299.99,
            'unit_id' => $unitId,
            'stock' => 60,
            'product_code' => 'SONYXM5',
            'image' => null
        ]);

        Product::create([
            'name' => 'Canon EOS R6',
            'category_id' => $categories['Cameras']->id,
            'price' => 2499.99,
            'cost_price' => 1999.99,
            'unit_id' => $unitId,
            'stock' => 4,
            'product_code' => 'CANONR6',
            'image' => null
        ]);

        // Clothing Products
        Product::create([
            'name' => 'Men\'s Cotton T-Shirt',
            'category_id' => $categories['Men\'s Clothing']->id,
            'price' => 19.99,
            'cost_price' => 9.99,
            'unit_id' => $unitId,
            'stock' => 100,
            'product_code' => 'MENS_TSHIRT',
            'image' => null
        ]);

        Product::create([
            'name' => 'Women\'s Summer Dress',
            'category_id' => $categories['Women\'s Clothing']->id,
            'price' => 49.99,
            'cost_price' => 29.99,
            'unit_id' => $unitId,
            'stock' => 75,
            'product_code' => 'WOMENS_DRESS',
            'image' => null
        ]);

        Product::create([
            'name' => 'Kids\' Sneakers',
            'category_id' => $categories['Kids\' Clothing']->id,
            'price' => 34.99,
            'cost_price' => 19.99,
            'unit_id' => $unitId,
            'stock' => 80,
            'product_code' => 'KIDS_SNEAKERS',
            'image' => null
        ]);

        Product::create([
            'name' => 'Running Shoes',
            'category_id' => $categories['Shoes']->id,
            'price' => 89.99,
            'cost_price' => 49.99,
            'unit_id' => $unitId,
            'stock' => 60,
            'product_code' => 'RUNNING_SHOES',
            'image' => null
        ]);

        Product::create([
            'name' => 'Leather Wallet',
            'category_id' => $categories['Accessories']->id,
            'price' => 29.99,
            'cost_price' => 14.99,
            'unit_id' => $unitId,
            'stock' => 120,
            'product_code' => 'LEATHER_WALLET',
            'image' => null
        ]);

        // Food & Beverages Products
        Product::create([
            'name' => 'Potato Chips',
            'category_id' => $categories['Snacks']->id,
            'price' => 3.99,
            'cost_price' => 2.49,
            'unit_id' => $unitId,
            'stock' => 200,
            'product_code' => 'CHIPS',
            'image' => null
        ]);

        Product::create([
            'name' => 'Orange Juice',
            'category_id' => $categories['Beverages']->id,
            'price' => 4.99,
            'cost_price' => 3.49,
            'unit_id' => $unitId,
            'stock' => 150,
            'product_code' => 'ORANGE_JUICE',
            'image' => null
        ]);

        Product::create([
            'name' => 'Fresh Milk',
            'category_id' => $categories['Dairy Products']->id,
            'price' => 2.99,
            'cost_price' => 1.99,
            'unit_id' => $unitId,
            'stock' => 100,
            'product_code' => 'FRESH_MILK',
            'image' => null
        ]);

        Product::create([
            'name' => 'Whole Wheat Bread',
            'category_id' => $categories['Bakery Items']->id,
            'price' => 3.49,
            'cost_price' => 2.29,
            'unit_id' => $unitId,
            'stock' => 80,
            'product_code' => 'WHEAT_BREAD',
            'image' => null
        ]);

        Product::create([
            'name' => 'Frozen Pizza',
            'category_id' => $categories['Frozen Foods']->id,
            'price' => 8.99,
            'cost_price' => 5.99,
            'unit_id' => $unitId,
            'stock' => 60,
            'product_code' => 'FROZEN_PIZZA',
            'image' => null
        ]);

        // Books & Media Products
        Product::create([
            'name' => 'The Great Gatsby',
            'category_id' => $categories['Fiction Books']->id,
            'price' => 12.99,
            'cost_price' => 7.99,
            'unit_id' => $unitId,
            'stock' => 90,
            'product_code' => 'GATSBY',
            'image' => null
        ]);

        Product::create([
            'name' => 'Sapiens: A Brief History',
            'category_id' => $categories['Non-Fiction Books']->id,
            'price' => 18.99,
            'cost_price' => 12.99,
            'unit_id' => $unitId,
            'stock' => 70,
            'product_code' => 'SAPIENS',
            'image' => null
        ]);

        Product::create([
            'name' => 'Mathematics Textbook',
            'category_id' => $categories['Educational Books']->id,
            'price' => 45.99,
            'cost_price' => 32.99,
            'unit_id' => $unitId,
            'stock' => 40,
            'product_code' => 'MATH_TEXTBOOK',
            'image' => null
        ]);

        Product::create([
            'name' => 'The Matrix Blu-ray',
            'category_id' => $categories['Movies & TV']->id,
            'price' => 14.99,
            'cost_price' => 9.99,
            'unit_id' => $unitId,
            'stock' => 50,
            'product_code' => 'MATRIX_BD',
            'image' => null
        ]);

        Product::create([
            'name' => 'Greatest Hits Album',
            'category_id' => $categories['Music']->id,
            'price' => 9.99,
            'cost_price' => 5.99,
            'unit_id' => $unitId,
            'stock' => 80,
            'product_code' => 'GREATEST_HITS',
            'image' => null
        ]);

        // Sports & Outdoors Products
        Product::create([
            'name' => 'Dumbbell Set',
            'category_id' => $categories['Fitness Equipment']->id,
            'price' => 149.99,
            'cost_price' => 89.99,
            'unit_id' => $unitId,
            'stock' => 30,
            'product_code' => 'DUMBBELL_SET',
            'image' => null
        ]);

        Product::create([
            'name' => 'Camping Tent 4-Person',
            'category_id' => $categories['Camping']->id,
            'price' => 199.99,
            'cost_price' => 129.99,
            'unit_id' => $unitId,
            'stock' => 25,
            'product_code' => 'CAMPING_TENT',
            'image' => null
        ]);

        Product::create([
            'name' => 'Basketball',
            'category_id' => $categories['Team Sports']->id,
            'price' => 24.99,
            'cost_price' => 14.99,
            'unit_id' => $unitId,
            'stock' => 100,
            'product_code' => 'BASKETBALL',
            'image' => null
        ]);

        Product::create([
            'name' => 'Hiking Backpack',
            'category_id' => $categories['Outdoor Gear']->id,
            'price' => 89.99,
            'cost_price' => 54.99,
            'unit_id' => $unitId,
            'stock' => 45,
            'product_code' => 'HIKING_BACKPACK',
            'image' => null
        ]);

        Product::create([
            'name' => 'Swimming Goggles',
            'category_id' => $categories['Water Sports']->id,
            'price' => 19.99,
            'cost_price' => 11.99,
            'unit_id' => $unitId,
            'stock' => 120,
            'product_code' => 'SWIM_GOGGLES',
            'image' => null
        ]);

        $this->command->info('Products seeded successfully!');
    }
}
