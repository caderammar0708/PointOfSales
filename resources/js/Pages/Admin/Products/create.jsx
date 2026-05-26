import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Create({ auth, parentCategories }) {
    const [childCategories, setChildCategories] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    
    const { data, setData, post, errors } = useForm({
        name: '', category_id: '', price: '', stock: '', image: null, product_code: ''
    });

    const handleParentChange = async (parentId) => {
        setSelectedParent(parentId);
        setData('category_id', ''); // Reset category selection
        
        if (parentId) {
            try {
                const response = await fetch(`/product/child-categories/${parentId}`);
                const categories = await response.json();
                setChildCategories(categories);
            } catch (error) {
                console.error('Error fetching child categories:', error);
                setChildCategories([]);
            }
        } else {
            setChildCategories([]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('product.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Product" />
            <div className="max-w-2xl mx-auto p-8 bg-white mt-10 shadow rounded">
                <form onSubmit={submit} className="space-y-4">
                    <input type="text" placeholder="Product Name" onChange={e => setData('name', e.target.value)} className="w-full rounded border-gray-300" />
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                        <select 
                            onChange={e => handleParentChange(e.target.value)} 
                            className="w-full rounded border-gray-300"
                            value={selectedParent}
                        >
                            <option value="">Select Parent Category</option>
                            {parentCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    
                    {selectedParent && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Sub-Category</label>
                            <select 
                                onChange={e => setData('category_id', e.target.value)} 
                                className="w-full rounded border-gray-300"
                                value={data.category_id}
                            >
                                <option value="">Select Sub-Category</option>
                                {childCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.category_id && <div className="text-red-500 text-xs">{errors.category_id}</div>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select 
                            onChange={e => setData('unit_id', e.target.value)} 
                            className="w-full rounded border-gray-300"
                            value={data.unit_id}
                        >
                            <option value="">Select Unit</option>
                            {units.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.unit_id && <div className="text-red-500 text-xs">{errors.unit_id}</div>}
                    </div>
                    
                    <input type="text" placeholder="Product Code" onChange={e => setData('product_code', e.target.value)} className="w-full rounded border-gray-300" />
                    <input type="number" step="0.01" placeholder="Price" onChange={e => setData('price', e.target.value)} className="w-full rounded border-gray-300" />
                    <input type="number" placeholder="Stock" onChange={e => setData('stock', e.target.value)} className="w-full rounded border-gray-300" />

                    <input type="file" onChange={e => setData('image', e.target.files[0])} className="w-full" />

                    <button className="bg-indigo-600 text-white px-6 py-2 rounded">Save Product</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
