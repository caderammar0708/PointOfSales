<?php

namespace Database\Seeders;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Customer;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();
        $users = User::all();
        $customers = Customer::where('name', '!=', 'Walk-in Customer')->get();
        $walkIn = Customer::where('name', 'Walk-in Customer')->first();

        if ($products->isEmpty() || $users->isEmpty()) {
            return;
        }

        // Create 30 random sales over the last 30 days
        for ($i = 0; $i < 30; $i++) {
            DB::transaction(function () use ($products, $users, $customers, $walkIn) {
                $user = $users->random();
                // 60% walk-in, 40% registered customers
                $customer = (rand(0, 10) > 6 && $customers->isNotEmpty()) ? $customers->random() : $walkIn;
                
                $createdAt = now()->subDays(rand(0, 30))->subHours(rand(0, 24))->subMinutes(rand(0, 60));

                $sale = Sale::create([
                    'user_id' => $user->id,
                    'customer_id' => $customer ? $customer->id : null,
                    'total' => 0,
                    'payment_method' => (rand(0, 1) == 0) ? 'cash' : 'card',
                    'discount' => 0,
                    'tax' => 0,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                $total = 0;
                $itemCount = rand(1, 4);
                $selectedProducts = $products->random($itemCount);

                foreach ($selectedProducts as $product) {
                    $qty = rand(1, 3);
                    $originalPrice = $product->price;
                    
                    // Logic for discounts
                    $hasDiscount = rand(0, 10) > 8; 
                    $discountPercent = $hasDiscount ? rand(5, 15) : 0;
                    $discountAmountPerUnit = ($originalPrice * $discountPercent / 100);
                    $sellingPrice = $originalPrice - $discountAmountPerUnit;
                    $subtotal = $sellingPrice * $qty;

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'price' => $sellingPrice,
                        'original_price' => $originalPrice,
                        'discount_percent' => $discountPercent,
                        'discount_amount' => $discountAmountPerUnit * $qty,
                        'subtotal' => $subtotal,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    // Update stock and record movement
                    $product->decrement('stock', $qty);
                    StockMovement::create([
                        'product_id' => $product->id,
                        'user_id' => $user->id,
                        'type' => 'out',
                        'quantity' => $qty,
                        'reason' => 'Sale ID: #' . $sale->id,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    $total += $subtotal;
                }

                $sale->update(['total' => $total]);
            });
        }
    }
}
