import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { TrashIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, offer, products, offerProducts }) {
    // 1. Setup the Form State with existing offer data
    const { data, setData, patch, processing, errors } = useForm({
        name: offer.name || '',
        type: offer.type || 'discount',
        discount_type: offer.discount_type || 'percentage',
        discount_value: offer.discount_value || 0,
        code: offer.code || '',
        buy_quantity: offer.buy_quantity || 1,
        get_quantity: offer.get_quantity || 1,
        min_bill_amount: offer.min_bill_amount || 0,
        start_date: offer.start_date || '',
        end_date: offer.end_date || '',
        selected_products: offerProducts.map(p => ({
            product_id: p.id,
            name: p.name,
            price: p.price,
            discount: p.pivot.specific_discount // Get discount from the pivot table
        })),
    });

    const addProductRow = (productId) => {
        if (!productId) return;
        const product = products.find(p => p.id === parseInt(productId));
        if (data.selected_products.find(p => p.product_id === product.id)) return;

        setData('selected_products', [
            ...data.selected_products,
            { product_id: product.id, name: product.name, price: product.price, discount: 0 }
        ]);
    };

    const updateProductDiscount = (index, value) => {
        const updated = [...data.selected_products];
        updated[index].discount = value;
        setData('selected_products', updated);
    };

    const removeProductRow = (index) => {
        setData('selected_products', data.selected_products.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('offers.update', offer.id), {
            ...data,
            products: data.selected_products
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-2xl text-indigo-800">Update Offer</h2>}>
            <Head title="Edit Offer" />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <form onSubmit={submit} className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-8">
                        
                        {/* Header Info */}
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                Editing {data.type}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Offer Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-gray-200 rounded-lg focus:ring-indigo-500" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Offer Type</label>
                                <input type="text" value={data.type} disabled className="w-full border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                                <p className="text-[10px] text-gray-400 mt-1 italic">*Type cannot be changed once created. Delete and recreate for a different type.</p>
                            </div>
                        </div>

                        {/* Product Management Section */}
                        <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                             {(data.type === 'discount' || data.type === 'combo') && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-indigo-900 uppercase">Linked Products</h3>
                                        <select 
                                            className="border-gray-200 rounded-lg text-sm"
                                            onChange={(e) => addProductRow(e.target.value)}
                                            value=""
                                        >
                                            <option value="">Add more products...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Discount %</th>
                                                    <th className="px-4 py-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {data.selected_products.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3">
                                                            <input 
                                                                type="number" 
                                                                value={item.discount} 
                                                                onChange={(e) => updateProductDiscount(index, e.target.value)}
                                                                className="w-20 border-gray-200 rounded-md text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button type="button" onClick={() => removeProductRow(index)} className="text-red-400 hover:text-red-600">
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                             )}

                             {/* Other Type Fields */}
                             {data.type === '1to1' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Buy" value={data.buy_quantity} onChange={e => setData('buy_quantity', e.target.value)} className="w-full border-gray-200 rounded-lg" />
                                    <input type="number" placeholder="Get" value={data.get_quantity} onChange={e => setData('get_quantity', e.target.value)} className="w-full border-gray-200 rounded-lg" />
                                </div>
                             )}

                             {data.type === 'coupon' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="w-full border-gray-200 rounded-lg font-mono uppercase" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount %</label>
                                        <input type="number" value={data.discount_value} onChange={e => setData('discount_value', e.target.value)} className="w-full border-gray-200 rounded-lg" placeholder="10" />
                                    </div>
                                </div>
                             )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                                <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="w-full border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                                <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className="w-full border-gray-200 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
                        <Link href={route('offers.index', {type: data.type})} className="text-sm font-bold text-gray-500 hover:text-gray-700 flex items-center">
                            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 flex items-center"
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Update Campaign
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}