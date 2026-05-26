import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Create({ auth, products, defaultType }) {
    // Get type from URL query params or props
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type') || defaultType || 'discount';
    
    // 1. Setup the Form State
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: typeFromUrl, // Auto-set from URL or props
        discount_type: 'percentage', 
        discount_value: 0, // Single discount for combo
        code: '',
        buy_quantity: 1,
        get_quantity: 1,
        min_bill_amount: 0,
        start_date: '',
        end_date: '',
        selected_products: [], 
    });
    
    // Check if type is locked (from URL or props)
    const isTypeLocked = !!(urlParams.get('type') || defaultType);

    // 2. Helper to add a product to the list
    const addProductRow = (productId) => {
        if (!productId) return;
        const product = products.find(p => p.id === parseInt(productId));
        
        if (data.selected_products.find(p => p.product_id === product.id)) return;

        setData('selected_products', [
            ...data.selected_products,
            { product_id: product.id, name: product.name, price: product.price, discount: 0 }
        ]);
    };

    // 3. Helper to update specific discount for a product row
    const updateProductDiscount = (index, value) => {
        const updated = [...data.selected_products];
        updated[index].discount = value;
        setData('selected_products', updated);
    };

    // 4. Remove a product row
    const removeProductRow = (index) => {
        setData('selected_products', data.selected_products.filter((_, i) => i !== index));
    };

    // 5. THE FIX: Send the form data
    const submit = (e) => {
        e.preventDefault();
        
        // We post the entire data object. 
        // Ensure your Controller is looking for 'selected_products' 
        // as we discussed in the previous step.
        post(route('offers.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-2xl text-indigo-800">Create New Offer</h2>}>
            <Head title="Create Offer" />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <form onSubmit={submit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 space-y-8">
                        
                        {/* Section 1: Basic Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Offer Name / Campaign</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-gray-200 rounded-lg focus:ring-indigo-500" placeholder="e.g., Year End Clearance" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Offer Category</label>
                                {isTypeLocked ? (
                                    // Show locked type as read-only
                                    <div className="w-full border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-gray-700 font-medium">
                                        {data.type === 'combo' && 'Combo Package'}
                                        {data.type === '1to1' && 'Buy X Get Y (1-to-1)'}
                                        {data.type === 'discount' && 'Custom Product Discounts'}
                                        {data.type === 'coupon' && 'Coupon Code'}
                                        <input type="hidden" value={data.type} />
                                    </div>
                                ) : (
                                    <select 
                                        value={data.type} 
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full border-gray-200 rounded-lg focus:ring-indigo-500 font-medium"
                                    >
                                        <option value="discount">Custom Product Discounts</option>
                                        <option value="1to1">Buy X Get Y (1-to-1)</option>
                                        <option value="combo">Combo Package</option>
                                        <option value="coupon">Coupon Code</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Type-Specific Logic */}
                        <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                            
                            {/* IF DISCOUNT: Product Picker with per-product discounts */}
                            {data.type === 'discount' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Configure Products & Discounts</h3>
                                    
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 border-gray-200 rounded-lg"
                                            onChange={(e) => addProductRow(e.target.value)}
                                            value=""
                                        >
                                            <option value="">Search & Add Product...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Rs. {p.price})</option>)}
                                        </select>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Price</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Discount %</th>
                                                    <th className="px-4 py-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {data.selected_products.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">Rs. {item.price}</td>
                                                        <td className="px-4 py-3">
                                                            <input 
                                                                type="number" 
                                                                value={item.discount} 
                                                                onChange={(e) => updateProductDiscount(index, e.target.value)}
                                                                className="w-20 border-gray-200 rounded-md text-sm p-1"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button type="button" onClick={() => removeProductRow(index)} className="text-red-400 hover:text-red-600">
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {data.selected_products.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No products added yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {errors.selected_products && <p className="text-red-500 text-xs mt-1">{errors.selected_products}</p>}
                                </div>
                            )}
                            
                            {/* IF COMBO: Product Picker with SINGLE discount for all */}
                            {data.type === 'combo' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Configure Combo Package</h3>
                                    <p className="text-xs text-gray-500">Select products for this combo. One discount applies to all products.</p>
                                    
                                    {/* Single Discount Field for Combo */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Combo Discount (%)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="number" 
                                                value={data.discount_value} 
                                                onChange={e => setData('discount_value', e.target.value)}
                                                className="w-32 border-gray-200 rounded-lg text-lg font-bold p-2"
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                            />
                                            <span className="text-gray-500">% OFF for entire combo</span>
                                        </div>
                                        {parseFloat(data.discount_value) > 0 && data.selected_products.length > 0 && (
                                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                                <p className="text-sm text-green-700">
                                                    <span className="font-bold">Combo Price:</span> Rs. {data.selected_products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0).toFixed(2)} → 
                                                    <span className="font-bold text-green-800"> Rs. {(data.selected_products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) * (1 - parseFloat(data.discount_value || 0)/100)).toFixed(2)}</span>
                                                </p>
                                                <p className="text-xs text-green-600 mt-1">
                                                    Customer saves: Rs. {(data.selected_products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) * (parseFloat(data.discount_value || 0)/100)).toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 border-gray-200 rounded-lg"
                                            onChange={(e) => addProductRow(e.target.value)}
                                            value=""
                                        >
                                            <option value="">Add Product to Combo...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Rs. {p.price})</option>)}
                                        </select>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Original Price</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">After Discount</th>
                                                    <th className="px-4 py-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {data.selected_products.map((item, index) => {
                                                    const originalPrice = parseFloat(item.price || 0);
                                                    const discountValue = parseFloat(data.discount_value || 0);
                                                    const discountedPrice = originalPrice * (1 - discountValue/100);
                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-500 line-through">Rs. {originalPrice.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-sm font-bold text-green-600">Rs. {discountedPrice.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button type="button" onClick={() => removeProductRow(index)} className="text-red-400 hover:text-red-600">
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {data.selected_products.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No products added yet. Add at least 2 products for a combo.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {errors.selected_products && <p className="text-red-500 text-xs mt-1">{errors.selected_products}</p>}
                                </div>
                            )}

                            {/* IF 1to1 Logic */}
                            {data.type === '1to1' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Buy X Get Y Configuration</h3>
                                    
                                    {/* Product Picker for 1to1 */}
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 border-gray-200 rounded-lg"
                                            onChange={(e) => addProductRow(e.target.value)}
                                            value=""
                                        >
                                            <option value="">Select Product for this Offer...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Rs. {p.price})</option>)}
                                        </select>
                                    </div>
                                    
                                    {/* Show selected product */}
                                    {data.selected_products.length > 0 && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                                            <p className="text-sm font-medium text-gray-900">Selected: {data.selected_products[0].name}</p>
                                            <p className="text-xs text-gray-500">Rs. {data.selected_products[0].price}</p>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase">Buy Quantity</label>
                                            <input type="number" value={data.buy_quantity} onChange={e => setData('buy_quantity', e.target.value)} className="mt-1 w-full border-gray-200 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase">Get Quantity (Free)</label>
                                            <input type="number" value={data.get_quantity} onChange={e => setData('get_quantity', e.target.value)} className="mt-1 w-full border-gray-200 rounded-lg" />
                                        </div>
                                    </div>
                                    {errors.selected_products && <p className="text-red-500 text-xs mt-1">{errors.selected_products}</p>}
                                </div>
                            )}

                            {/* IF COUPON Logic */}
                            {data.type === 'coupon' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase">Promo Code</label>
                                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="mt-1 w-full border-gray-200 rounded-lg font-mono text-lg" placeholder="SUMMER2024" />
                                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase">Discount Percentage (%)</label>
                                        <input type="number" value={data.discount_value} onChange={e => setData('discount_value', e.target.value)} className="mt-1 w-full border-gray-200 rounded-lg text-lg" placeholder="10" min="0" max="100" />
                                        {errors.discount_value && <p className="text-red-500 text-xs mt-1">{errors.discount_value}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Timeline & Limits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Min. Bill Amount</label>
                                <input type="number" value={data.min_bill_amount} onChange={e => setData('min_bill_amount', e.target.value)} className="w-full border-gray-200 rounded-lg" />
                            </div>
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

                    <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t border-gray-100">
                        <Link href={route('offers.index')} className="text-sm font-bold text-gray-500 hover:text-gray-700 uppercase">Go Back</Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center"
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Activate Offer
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}