<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $today = Carbon::today();
        $lastWeek = Carbon::today()->subDays(7);

        // --- Stats for Admin & Cashier ---
        $todaySales = Sale::whereDate('created_at', $today)->sum('total');
        $todayTransactions = Sale::whereDate('created_at', $today)->count();
        $itemsSold = DB::table('sale_items')->whereDate('created_at', $today)->sum('quantity') ?? 0;

        if ($user->role === 'admin') {
            // Admin Specific Data
            $totalCustomers = Customer::count();
            $totalProducts = Product::count();

            // 7-Day Sales Chart Data
            $salesData = Sale::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total')
            )
            ->where('created_at', '>=', $lastWeek)
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

            // Top Selling Products
            $topProducts = DB::table('sale_items')
                ->join('products', 'sale_items.product_id', '=', 'products.id')
                ->select('products.name', DB::raw('SUM(sale_items.quantity) as total_quantity'))
                ->groupBy('products.id', 'products.name')
                ->orderBy('total_quantity', 'desc')
                ->take(5)
                ->get();

            $lowStockProducts = Product::whereRaw('stock <= 10')->get();
            $recentSales = Sale::with('user')->latest()->take(5)->get();

            return Inertia::render('Admin/AdminDashboard', [
                'stats' => [
                    'todaySales' => $todaySales,
                    'salesTrend' => 12, // For demo; calculate real % by comparing to yesterday if needed
                    'totalOrders' => $todayTransactions,
                    'ordersTrend' => 5,
                    'totalCustomers' => $totalCustomers,
                    'customersTrend' => 2,
                    'totalProducts' => $totalProducts,
                    'topProducts' => $topProducts
                ],
                'salesData' => $salesData,
                'recentSales' => $recentSales,
                'lowStockProducts' => $lowStockProducts
            ]);
        }

        // Cashier Specific Data
        $todaySalesList = Sale::whereDate('created_at', $today)
            ->where('user_id', $user->id)
            ->withCount('items')
            ->latest()
            ->get();

        return Inertia::render('Cashier/CashierDashboard', [
            'stats' => [
                'todaySales' => $todaySales,
                'todayTransactions' => $todayTransactions,
                'itemsSold' => $itemsSold
            ],
            'todaySales' => $todaySalesList
        ]);
    }
}
