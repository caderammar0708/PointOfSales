<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\User\UserController; // Import your controller
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleItemController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OfferController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect the base dashboard route to our controller
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

Route::prefix('Admin')->middleware('auth')->group(function () {
    Route::resource('user', UserController::class);
});
Route::middleware('auth')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index'])->name('category.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('category.store');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('category.destroy');
});


Route::middleware('auth')->group(function () {
    Route::resource('product', ProductController::class);
    Route::get('product/child-categories/{parentId}', [ProductController::class, 'getChildCategories'])->name('product.child-categories');
});


Route::middleware('auth')->group(function () {
    Route::resource('customer', CustomerController::class);
});

Route::middleware('auth')->group(function () {
    Route::resource('offers', OfferController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('sales/history', [SaleController::class, 'history'])->name('sales.history');
    Route::resource('sales', SaleController::class);
});

Route::middleware('auth')->group(function () {
    Route::resource('Stock', StockMovementController::class);
});

Route::prefix('admin/reports')->group(function () {
    Route::get('/daily', [ReportController::class, 'daily'])->name('reports.daily');
    Route::get('/products', [ReportController::class, 'products'])->name('reports.products');
    Route::get('/profit', [ReportController::class, 'profit'])->name('reports.profit');
});
Route::middleware('auth')->group(function () {
    Route::resource('Unit', UnitController::class);
});



require __DIR__.'/auth.php';

