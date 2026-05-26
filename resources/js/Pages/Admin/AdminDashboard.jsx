// resources/js/Pages/Admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UsersIcon,
    CubeIcon,
    ArrowTrendingUpIcon,    // Corrected for v2
    ArrowTrendingDownIcon,  // Corrected for v2
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
                {trend && (
                    <div className="flex items-center mt-2">
                        {trend > 0 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(trend)}% from last week
                        </span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-full bg-${color}-100`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
        </div>
    </div>
);

const SalesChart = ({ salesData = [] }) => {
    // Prevent errors if salesData is empty
    const maxValue = salesData.length > 0 ? Math.max(...salesData.map(d => d.total)) : 1;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview (Last 7 Days)</h3>
            <div className="flex items-end space-x-2 h-64 border-b border-gray-100">
                {salesData.length > 0 ? salesData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                        <div
                            className="w-full bg-indigo-500 rounded-t transition-all duration-300 group-hover:bg-indigo-600 relative"
                            style={{ height: `${(day.total / maxValue) * 200}px`, minHeight: '4px' }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity">
                                Rs. {day.total.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">{day.date}</div>
                    </div>
                )) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No sales data available</div>
                )}
            </div>
        </div>
    );
};

const RecentSales = ({ sales = [] }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">#{sale.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sale.customer?.name || 'Walk-in Customer'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(sale.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs. {parseFloat(sale.total).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 uppercase">
                                    Completed
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const LowStockAlert = ({ products = [] }) => {
    if (products.length === 0) return null;

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-tight">Low Stock Alert</h3>
                    <div className="mt-1 text-sm text-yellow-700">
                        <ul className="list-disc list-inside">
                            {products.map(product => (
                                <li key={product.id}>{product.name} - <span className="font-bold text-red-600">Only {product.stock} left</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminDashboard({ auth, stats, salesData, recentSales, lowStockProducts }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Control Center</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto">
                {/* Low Stock Alert */}
                <LowStockAlert products={lowStockProducts} />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Today's Sales"
                        value={`Rs. ${stats.todaySales.toLocaleString()}`}
                        icon={CurrencyDollarIcon}
                        trend={stats.salesTrend}
                        color="indigo"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={ShoppingCartIcon}
                        trend={stats.ordersTrend}
                        color="blue"
                    />
                    <StatCard
                        title="Total Customers"
                        value={stats.totalCustomers}
                        icon={UsersIcon}
                        trend={stats.customersTrend}
                        color="green"
                    />
                    <StatCard
                        title="Products in Stock"
                        value={stats.totalProducts}
                        icon={CubeIcon}
                        color="purple"
                    />
                </div>

                {/* Charts and Tables */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SalesChart salesData={salesData} />

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
                        <div className="space-y-4">
                            {stats.topProducts?.length > 0 ? stats.topProducts.map((product, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-indigo-600 font-bold">{product.total_quantity} units</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full"
                                            style={{ width: `${(product.total_quantity / stats.topProducts[0]?.total_quantity) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-400 italic text-center py-10">No sales data recorded yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Sales Table */}
                <div className="mt-8">
                    <RecentSales sales={recentSales} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
