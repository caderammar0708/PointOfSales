import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { EyeIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function History({ auth, sales }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-indigo-800">Sales History</h2>}
        >
            <Head title="Sales History" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                                <p className="text-sm text-gray-500">A list of all sales recorded in the system.</p>
                            </div>
                            <div className="flex gap-2">
                                {/* Optional: Add search/filter here later */}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Cashier</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Method</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {sales.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-gray-400 italic">
                                                No sales history found.
                                            </td>
                                        </tr>
                                    ) : (
                                        sales.data.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                                    #{sale.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(sale.created_at).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">{sale.customer?.name || 'Walk-in Customer'}</div>
                                                    <div className="text-[10px] text-gray-400">{sale.customer?.phone || 'No phone'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-700">{sale.user?.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${
                                                        sale.payment_method === 'cash' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {sale.payment_method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">
                                                    ${parseFloat(sale.total).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('sales.show', sale.id)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="Print Receipt"
                                                        >
                                                            <PrinterIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {sales.links && sales.links.length > 3 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-sm text-gray-500 font-medium">
                                    Showing <span className="font-bold text-gray-900">{sales.from}</span> to <span className="font-bold text-gray-900">{sales.to}</span> of <span className="font-bold text-gray-900">{sales.total}</span> results
                                </div>
                                <div className="flex gap-1">
                                    {sales.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                                link.active 
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                                : link.url 
                                                    ? 'bg-white text-gray-600 hover:bg-gray-100' 
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
