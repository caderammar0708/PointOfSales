<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

public function edit(User $user): Response
{
    return Inertia::render('Admin/User/Edit', [
        'user' => $user,
    ]);
}

public function update(Request $request, User $user): RedirectResponse
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => [
            'required',
            'string',
            'lowercase',
            'email',
            'max:255',
            Rule::unique(User::class)->ignore($user->id)
        ],
        // password_confirmation is required if password is provided
        'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        'role' => 'nullable|in:admin,manager,cashier',
        'is_active' => 'nullable|boolean'

    ]);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'role' => $request->role,
        'is_active' => $request->is_active,
    ]);

    if ($request->filled('password')) {
        $user->update(['password' => Hash::make($request->password)]);
    }

    return redirect()->route('user.index')->with('message', 'User updated successfully.');
}

public function destroy(User $user): RedirectResponse
{
    // Prevent admin from deleting themselves
    if (auth()->id() === $user->id) {
        return redirect()->back()->with('error', 'You cannot delete yourself!');
    }

    $user->delete();

    return redirect()->route('user.index')->with('message', 'User deleted successfully.');
}
public function index(): Response
    {
        // Fetch all users from the database
        $users = User::all();

        return Inertia::render('Admin/User/index', [
    'users' => $users
]);
    }
    public function create(): Response
    {
        return Inertia::render('Admin/User/create');
    }


    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|in:admin,manager,cashier',
            'is_active' => 'nullable|boolean'

        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->is_active,
        ]);


        return redirect()->route('user.index')->with('message', 'User created successfully.');
    }
}
