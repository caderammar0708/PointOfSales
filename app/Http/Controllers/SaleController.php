<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $products = Product::where('stock', '>', 0)
            ->with(['individualOffers', 'unit'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'product_code' => $product->product_code,
                    'stock' => $product->stock,
                    'unit' => $product->unit?->short_name ?? 'pcs',
                    'discount' => $product->best_discount,
                    'discounted_price' => $product->discounted_price,
                    'has_offer' => $product->individualOffers->isNotEmpty(),
                    'offer_name' => $product->individualOffers->first()?->name ?? null,
                    'offer_type' => $product->individualOffers->first()?->type ?? null,
                    'buy_qty' => $product->individualOffers->first()?->buy_quantity ?? 0,
                    'get_qty' => $product->individualOffers->first()?->get_quantity ?? 0,
                ];
            });

        // Fetch active combo offers
        $comboOffers = \App\Models\Offer::where('type', 'combo')
            ->where('is_active', true)
            ->with('products')
            ->get();

        // Fetch active coupon offers
        $couponOffers = \App\Models\Offer::where('type', 'coupon')
            ->where('is_active', true)
            ->get();

        return Inertia::render('Admin/Sales/index', [
            'products' => $products,
            'comboOffers' => $comboOffers,
            'couponOffers' => $couponOffers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'payment_method' => 'required|string',
            'total' => 'required|numeric',
        ]);

        $sale = DB::transaction(function () use ($request) {
            // 1. Create the Sale record
            $sale = Sale::create([
                'user_id' => auth()->id(),
                'customer_id' => $request->customer_id, // Ensure customer_id is also saved if provided
                'coupon_id' => $request->coupon_id,
                'total' => $request->total,
                'payment_method' => $request->payment_method,
                'discount' => $request->discount ?? 0,
                'tax' => $request->tax ?? 0,
            ]);

            foreach ($request->items as $item) {
                $originalPrice = $item['unit_price'] ?? $item['price'];
                $discountPercent = $item['discount'] ?? 0;
                $discountAmount = ($originalPrice - $item['price']) * $item['qty'];

                // 2. Attach items to sale
                $sale->items()->create([
                    'product_id' => $item['id'],
                    'quantity'   => $item['qty'],
                    'price'      => $item['price'], // Discounted price
                    'original_price' => $originalPrice,
                    'discount_percent' => $discountPercent,
                    'discount_amount' => $discountAmount,
                    'subtotal'   => $item['qty'] * $item['price'],
                ]);

                // 3. Update the Product Inventory Level
                $product = Product::find($item['id']);
                $product->decrement('stock', $item['qty']);

                // 4. Record the Stock Movement
                StockMovement::create([
                    'product_id' => $item['id'],
                    'user_id' => auth()->id(),
                    'type' => 'out',
                    'quantity' => $item['qty'],
                    'reason' => 'Sale ID: #' . $sale->id,
                ]);
            }

            return $sale;
        });

        return redirect()->route('sales.show', $sale->id);
    }

    public function show(string $id)
    {
        $sale = Sale::with('items.product')->findOrFail($id);
        return Inertia::render('Admin/Sales/show', ['sale' => $sale]);
    }

    public function history()
    {
        $sales = Sale::with(['user', 'customer'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Sales/History', [
            'sales' => $sales
        ]);
    }
}
