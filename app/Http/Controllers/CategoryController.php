<?php

namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Categories/index', [
            'categories' => Category::with('parent')->get(),
            'parentOptions' => Category::whereNull('parent_id')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories|max:255',
            'parent_id' => 'nullable|exists:categories,id'
        ]);
        Category::create($request->only('name', 'parent_id'));
        return redirect()->back()->with('message', 'Category added!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
public function update(Request $request, string $id)
{
    $category = Category::findOrFail($id);

    $request->validate([
        'name'      => 'required|string|max:255|unique:categories,name,' . $category->id,
        'is_active' => 'sometimes|boolean',
        'parent_id' => 'nullable|exists:categories,id'
    ]);

    $category->update($request->only(['name', 'is_active', 'parent_id']));

    return redirect()->back()->with('message', 'Category updated!');
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    $category = Category::findOrFail($id);

    $category->delete();

    return redirect()->back()->with('message', 'Category deleted!');
}
}
