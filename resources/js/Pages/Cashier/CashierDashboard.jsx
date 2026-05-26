// resources/js/Pages/Cashier/CashierDashboard.jsx
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const QuickStatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-b-4" style={{ borderColor: `var(--tw-color-${color}-500)` }}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
            <div className={`p-4 rounded-xl bg-${color}-50`}>
                <Icon className={`h-8 w-8 text-${color}-600`} />
            </div>
        </div>
    </div>
);

const TodaySalesList = ({ sales = [] }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 text-indigo-600">My Sales Today</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {sales.length} Transactions
            </span>
        </div>
        <div className="divide-y divide-gray-100">
            {sales.length > 0 ? sales.map((sale) => (
                <div key={sale.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Invoice #{sale.id}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-gray-900">Rs. {parseFloat(sale.total).toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{sale.items_count || 0} items</p>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="px-6 py-12 text-center text-gray-500 italic">
                    No sales recorded in your shift yet.
                </div>
            )}
        </div>
    </div>
);

export default function CashierDashboard({ auth, stats, todaySales }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cashier Dashboard</h2>}
        >
            <Head title="Cashier Dashboard" />

            <div className="max-w-7xl mx-auto">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <QuickStatCard
                        title="Your Sales Today"
                        value={`Rs. ${stats.todaySales.toLocaleString()}`}
                        icon={CurrencyDollarIcon}
                        color="indigo"
                    />
                    <QuickStatCard
                        title="Transactions"
                        value={stats.todayTransactions}
                        icon={ShoppingCartIcon}
                        color="blue"
                    />
                    <QuickStatCard
                        title="Items Handled"
                        value={stats.itemsSold}
                        icon={CheckCircleIcon}
                        color="green"
                    />
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Sales List - Spans 2 columns */}
                    <div className="lg:col-span-2">
                        <TodaySalesList sales={todaySales} />
                    </div>

                    {/* Quick Actions - Spans 1 column */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">Register Operations</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('sales.index')}
                                    className="flex items-center justify-between w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition font-medium"
                                >
                                    <span className="flex items-center">
                                        <ShoppingCartIcon className="h-5 w-5 mr-3" />
                                        New Transaction
                                    </span>
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Link>

                                <Link
                                    href={route('customer.index')}
                                    className="flex items-center justify-between w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition font-medium"
                                >
                                    <span className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 mr-3" />
                                        Customer List
                                    </span>
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Support</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Need help with a refund or stock issue? Contact your administrator for authorization.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
