import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Daily({ auth, stats }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800">Daily Sales Report</h2>}>
            <Head title="Daily Report" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500 uppercase font-bold">Today's Revenue</p>
                        <h3 className="text-3xl font-black text-green-600">Rs. {stats.total_sales}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500 uppercase font-bold">Total Transactions</p>
                        <h3 className="text-3xl font-black text-blue-600">{stats.sales_count}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold mb-4">Payment Breakdown</h4>
                    {stats.payment_methods.map(pm => (
                        <div key={pm.payment_method} className="flex justify-between border-b py-2">
                            <span className="uppercase">{pm.payment_method}</span>
                            <span className="font-mono font-bold">Rs. {pm.total}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
