<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'discount'); // Default to discount

        $offers = Offer::where('type', $type)
            ->withCount('products')
            ->latest()
            ->get();

        return Inertia::render('Admin/Offers/index', [
            'offers' => $offers,
            'currentType' => $type
        ]);
    }

    public function create(Request $request)
    {
        $type = $request->query('type', 'discount'); // Default to discount if no type specified
        
        return Inertia::render('Admin/Offers/create', [
            'products' => Product::select('id', 'name', 'price')->get(),
            'defaultType' => $type
        ]);
    }

public function store(Request $request)
{
    // 1. Update validation to match the 'selected_products' key from React
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'type' => 'required|in:combo,1to1,discount,coupon',
        'selected_products' => 'nullable|array', 
        'selected_products.*.product_id' => 'required_with:selected_products|exists:products,id',
        'selected_products.*.discount' => 'nullable|numeric|min:0|max:100',
        'discount_value' => 'nullable|numeric|min:0|max:100', // For combo single discount
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'buy_quantity' => 'nullable|integer|min:1',
        'get_quantity' => 'nullable|integer|min:1',
        'code' => 'nullable|string|unique:offers,code',
    ]);

    // 2. Create the Offer (excluding the products array)
    $offerData = $request->except('selected_products', 'products');
    
    // For combo, store the discount_value as the offer's main discount
    if ($request->type === 'combo' && $request->discount_value) {
        $offerData['discount_value'] = $request->discount_value;
    }
    
    $offer = Offer::create($offerData);

    // 3. Sync logic using 'selected_products'
    if ($request->has('selected_products') && is_array($request->selected_products)) {
        $syncData = [];
        foreach ($request->selected_products as $item) {
            // For combo: apply the single discount_value to all products
            // For discount: use individual product discounts
            $discount = ($request->type === 'combo') 
                ? ($request->discount_value ?? 0) 
                : ($item['discount'] ?? 0);
                
            $syncData[$item['product_id']] = [
                'specific_discount' => $discount
            ];
        }
        $offer->products()->sync($syncData);
    }

    return redirect()->route('offers.index', ['type' => $request->type])
        ->with('success', 'Offer created successfully.');
}

    public function edit(Offer $offer)
    {
        return Inertia::render('Admin/Offers/edit', [
            'offer' => $offer,
            'offerProducts' => $offer->products, // Sent via relationship
            'products' => Product::select('id', 'name', 'price')->get()
        ]);
    }

    public function update(Request $request, Offer $offer)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.discount' => 'nullable|numeric|min:0|max:100',
        ]);

        $offer->update($request->except('products'));

        // Sync products only if provided
        if ($request->has('products') && is_array($request->products)) {
            $syncData = [];
            foreach ($request->products as $item) {
                $syncData[$item['product_id']] = [
                    'specific_discount' => $item['discount'] ?? 0
                ];
            }
            $offer->products()->sync($syncData);
        }

        return redirect()->route('offers.index', ['type' => $offer->type])
            ->with('success', 'Offer updated!');
    }

    public function destroy(Offer $offer)
    {
        $type = $offer->type;
        $offer->delete();
        return redirect()->route('offers.index', ['type' => $type])
            ->with('success', 'Offer deleted successfully.');
    }
}