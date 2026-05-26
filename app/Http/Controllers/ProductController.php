<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Products/index', [
            'products' => Product::with(['category', 'unit'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/create', [
            'parentCategories' => Category::whereNull('parent_id')->where('is_active', true)->get(),
            'units' => Unit::all()
        ]);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'unit_id' => 'required|exists:units,id',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'product_code' => 'nullable|string|max:255|unique:products,product_code',
        ]);

        if ($request->hasFile('image')) {
            $fields['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($fields);

        return redirect()->route('product.index')->with('message', 'Product created!');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/edit', [
            'product' => $product->load('category'),
            'parentCategories' => Category::whereNull('parent_id')->where('is_active', true)->get(),
            'allCategories' => Category::where('is_active', true)->get(),
            'units' => Unit::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $fields = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'unit_id' => 'required|exists:units,id',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'product_code' => 'nullable|string|max:255|unique:products,product_code,' . $product->id,
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) Storage::disk('public')->delete($product->image);
            $fields['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($fields);

        return redirect()->route('product.index')->with('message', 'Product updated!');
    }

    public function getChildCategories($parentId)
    {
        $childCategories = Category::where('parent_id', $parentId)->where('is_active', true)->get();
        return response()->json($childCategories);
    }

    public function destroy(Product $product)
    {
        if ($product->image) Storage::disk('public')->delete($product->image);
        $product->delete();
        return redirect()->back()->with('message', 'Product deleted!');
    }
}
