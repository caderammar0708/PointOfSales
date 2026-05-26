import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Products({ auth, productStats, lowStock }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl">Product Analytics</h2>}>
            <Head title="Product Reports" />
            <div className="py-12 max-w-7xl mx-auto px-4 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-red-600 font-bold mb-4">⚠️ Low Stock Alert</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {lowStock.map(p => (
                            <div key={p.id} className="border p-2 rounded text-center">
                                <p className="text-sm font-bold">{p.name}</p>
                                <p className="text-xs text-red-500">Only {p.stock} left</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Product Name</th>
                                <th className="p-4 text-center">Qty Sold</th>
                                <th className="p-4 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productStats.map(s => (
                                <tr key={s.product_id} className="border-t">
                                    <td className="p-4">{s.product?.name}</td>
                                    <td className="p-4 text-center font-bold">{s.total_qty}</td>
                                    <td className="p-4 text-right">Rs. {s.total_revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
