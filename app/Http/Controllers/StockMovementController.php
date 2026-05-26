<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Stock/index', [
            'movements' => StockMovement::with(['product', 'user'])
                ->latest()
                ->paginate(15),
            'products' => Product::all(['id', 'name', 'stock'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:in,out',
            'reason' => 'nullable|string'
        ]);

        DB::transaction(function () use ($request) {
            // 1. Create the manual record
            StockMovement::create([
                'product_id' => $request->product_id,
                'user_id' => auth()->id(),
                'quantity' => $request->quantity,
                'type' => $request->type,
                'reason' => $request->reason ?? 'Manual Adjustment',
            ]);

            // 2. Sync the Product table stock
            $product = Product::find($request->product_id);
            if ($request->type === 'in') {
                $product->increment('stock', $request->quantity);
            } else {
                $product->decrement('stock', $request->quantity);
            }
        });

        return redirect()->back();
    }
}
