import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Added auth to the props here
export default function Show({ auth, sale }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sale Receipt</h2>}
        >
            <Head title={`Receipt #${sale.id}`} />

            <div className="max-w-md mx-auto my-10 bg-white p-8 shadow-lg border-t-8 border-indigo-600 rounded-b-lg">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-gray-800">SALE COMPLETED</h1>
                    <p className="text-gray-500 text-sm">Receipt #{sale.id}</p>
                    <p className="text-gray-400 text-xs">
                        {new Date(sale.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="border-y border-dashed py-4 my-4">
                    {sale.items.map((item, index) => (
                        <div key={index} className="mb-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {item.quantity} x {item.product?.name || 'Unknown Product'}
                                </span>
                                <span className="font-mono font-bold">
                                    ${(item.quantity * item.price).toFixed(2)}
                                </span>
                            </div>
                            {/* Show discount info if applicable */}
                            {item.discount_percent > 0 && (
                                <div className="flex justify-between text-xs mt-1">
                                    <span className="text-green-600">
                                        -{item.discount_percent}% OFF (was ${item.original_price})
                                    </span>
                                    <span className="text-green-600">
                                        Save ${item.discount_amount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Show total savings if any */}
                {sale.items.some(item => item.discount_percent > 0) && (
                    <div className="flex justify-between text-sm mb-2 text-green-600">
                        <span>TOTAL SAVINGS</span>
                        <span className="font-bold">
                            -${sale.items.reduce((sum, item) => sum + item.discount_amount, 0).toFixed(2)}
                        </span>
                    </div>
                )}

                <div className="flex justify-between font-bold text-xl mb-8 border-t pt-2">
                    <span className="text-gray-700">TOTAL PAID</span>
                    <span className="text-indigo-600">${sale.total}</span>
                </div>

                <div className="space-y-3 no-print">
                    <button
                        onClick={() => window.print()}
                        className="w-full py-2 bg-gray-800 text-white rounded font-bold hover:bg-gray-700 transition"
                    >
                        PRINT RECEIPT
                    </button>
                    <Link
                        href={route('sales.history')}
                        className="block text-center w-full py-2 bg-indigo-50 text-indigo-700 rounded font-bold hover:bg-indigo-100 transition"
                    >
                        BACK TO HISTORY
                    </Link>
                    <Link
                        href={route('sales.index')}
                        className="block text-center w-full py-2 border border-gray-300 rounded font-bold text-gray-600 hover:bg-gray-50 transition"
                    >
                        + NEW SALE
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
