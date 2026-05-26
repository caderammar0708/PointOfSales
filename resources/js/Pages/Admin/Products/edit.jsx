import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useEffect } from 'react';

export default function Edit({ auth, product, parentCategories, allCategories }) {
    const [childCategories, setChildCategories] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    
    // Find the current category and its parent
    const currentCategory = allCategories.find(cat => cat.id === product.category_id);
    const initialParentId = currentCategory?.parent_id || '';
    
    useEffect(() => {
        if (initialParentId) {
            setSelectedParent(initialParentId);
            loadChildrenCategories(initialParentId);
        }
    }, [initialParentId]);
    
    const loadChildrenCategories = async (parentId) => {
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
    
    const handleParentChange = async (parentId) => {
        setSelectedParent(parentId);
        setData('category_id', ''); // Reset category selection
        await loadChildrenCategories(parentId);
    };
    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        category_id: product.category_id,
        price: product.price,
        stock: product.stock,
        image: null, // We keep this null unless a new file is picked
        _method: 'patch', // CRITICAL: Method spoofing for file uploads
    });

    const submit = (e) => {
        e.preventDefault();
        // We use 'post' here because of the _method: 'patch' inside the data
        post(route('product.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Edit Product: {product.name}</h2>}
        >
            <Head title="Edit Product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="max-w-xl space-y-6">

                            {/* Product Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Product Name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <InputLabel htmlFor="parent_category" value="Parent Category" />
                                <select
                                    id="parent_category"
                                    value={selectedParent}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => handleParentChange(e.target.value)}
                                >
                                    <option value="">Select Parent Category</option>
                                    {parentCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedParent && (
                                <div>
                                    <InputLabel htmlFor="category" value="Sub-Category" />
                                    <select
                                        id="category"
                                        value={data.category_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Sub-Category</option>
                                        {childCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="unit_id" value="Unit" />
                                <select
                                    id="unit_id"
                                    value={data.unit_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('unit_id', e.target.value)}
                                >
                                    <option value="">Select Unit</option>
                                    {units.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Price */}
                                <div>
                                    <InputLabel htmlFor="price" value="Price ($)" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>

                                {/* Stock */}
                                <div>
                                    <InputLabel htmlFor="stock" value="Stock Quantity" />
                                    <TextInput
                                        id="stock"
                                        type="number"
                                        value={data.stock}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('stock', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.stock} className="mt-2" />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <InputLabel htmlFor="image" value="Product Image" />

                                {product.image && !data.image && (
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt="Current"
                                            className="w-20 h-20 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                <input
                                    id="image"
                                    type="file"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                />
                                <p className="mt-1 text-xs text-gray-400">Leave blank to keep existing image.</p>
                                <InputError message={errors.image} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Update Product</PrimaryButton>
                                <Link href={route('product.index')} className="text-sm text-gray-600 underline">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
