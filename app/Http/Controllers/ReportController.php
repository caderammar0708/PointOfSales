<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function daily()
    {
        $today = Carbon::today();

        $stats = [
            'total_sales' => Sale::whereDate('created_at', $today)->sum('total'),
            'sales_count' => Sale::whereDate('created_at', $today)->count(),
            'payment_methods' => Sale::whereDate('created_at', $today)
                ->select('payment_method', DB::raw('sum(total) as total'))
                ->groupBy('payment_method')
                ->get(),
            'recent_sales' => Sale::with('user')->whereDate('created_at', $today)->latest()->take(10)->get()
        ];

        return Inertia::render('Admin/Reports/daily', ['stats' => $stats]);
    }

    public function products()
    {
        $productStats = SaleItem::select('product_id',
                DB::raw('sum(quantity) as total_qty'),
                DB::raw('sum(subtotal) as total_revenue'))
            ->groupBy('product_id')
            ->with('product')
            ->orderBy('total_qty', 'desc')
            ->get();

        $lowStock = Product::where('stock', '<', 10)->get();

        return Inertia::render('Admin/Reports/products', [
            'productStats' => $productStats,
            'lowStock' => $lowStock
        ]);
    }

    public function profit()
    {
        $stats = [
            'today' => $this->getProfitStats(Carbon::today()),
            'week' => $this->getProfitStats(Carbon::now()->startOfWeek()),
            'month' => $this->getProfitStats(Carbon::now()->startOfMonth()),
            'year' => $this->getProfitStats(Carbon::now()->startOfYear()),
            'all_time' => $this->getProfitStats(),
        ];

        return Inertia::render('Admin/Reports/profit', ['stats' => $stats]);
    }

    private function getProfitStats($startDate = null)
    {
        $query = SaleItem::join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(
                DB::raw('COALESCE(SUM(sale_items.subtotal), 0) as revenue'),
                DB::raw('COALESCE(SUM(products.cost_price * sale_items.quantity), 0) as cost'),
                DB::raw('COALESCE(SUM(sale_items.subtotal - (products.cost_price * sale_items.quantity)), 0) as profit')
            );

        if ($startDate) {
            $query->where('sale_items.created_at', '>=', $startDate);
        }

        return $query->first();
    }
}
