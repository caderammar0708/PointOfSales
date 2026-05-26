<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Admin/Units/index', [
            'units' => Unit::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia::render('Admin/Units/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
    $request->validate(['name' => 'required', 'short_name' => 'required']);
    Unit::create($request->all());
    return redirect()->route('Unit.index');
}

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        return inertia::render('Admin/Units/edit', [
            'unit' => $unit
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit) {
    $request->validate(['name' => 'required', 'short_name' => 'required']);
    $unit->update($request->all());
    return redirect()->route('Unit.index');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit) {
    $unit->delete();
    return back();
}
}
