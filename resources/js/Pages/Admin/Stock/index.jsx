import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, movements, products }) {
    const { data, setData, post, processing, reset } = useForm({
        product_id: '',
        quantity: '',
        type: 'in',
        reason: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('Stock.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Inventory Ledger</h2>}
        >
            <Head title="Stock Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Manual Adjustment Form */}
                    <div className="bg-white p-6 shadow rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-bold mb-4 text-gray-700">Add / Remove Stock Manually</h3>
                        <form onSubmit={submit} className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Product</label>
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.product_id}
                                    onChange={e => setData('product_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Available: {p.stock})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-32">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Action</label>
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                >
                                    <option value="in">Restock (+)</option>
                                    <option value="out">Remove (-)</option>
                                </select>
                            </div>

                            <div className="w-24">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Qty</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Reason (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Damage, New Supply"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.reason}
                                    onChange={e => setData('reason', e.target.value)}
                                />
                            </div>

                            <button
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-bold"
                            >
                                {processing ? 'Processing...' : 'Apply Adjustment'}
                            </button>
                        </form>
                    </div>

                    {/* Movement History Table */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <h3 className="font-bold mb-4 text-gray-700 text-lg border-b pb-2">Movement History Log</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs uppercase text-gray-500 font-bold">
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Product</th>
                                    <th className="p-3 text-center">Type</th>
                                    <th className="p-3 text-center">Qty</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">By User</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {movements.data.map(m => (
                                    <tr key={m.id} className="text-sm hover:bg-gray-50">
                                        <td className="p-3 text-gray-400">
                                            {new Date(m.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-3 font-semibold text-gray-800">
                                            {m.product?.name || 'Deleted Item'}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                                                m.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {m.type}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center font-mono font-bold">
                                            {m.type === 'in' ? '+' : '-'}{m.quantity}
                                        </td>
                                        <td className="p-3 text-gray-600 italic">
                                            {m.reason || 'No reason'}
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {m.user?.name || 'System'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
