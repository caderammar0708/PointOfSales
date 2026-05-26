import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function CategoryIndex({ auth, categories, parentOptions, flash }) {
    const { data, setData, post, reset, errors } = useForm({ name: '', parent_id: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('category.store'), { onSuccess: () => reset() });
    };

    const toggleStatus = (category) => {
    router.patch(route('category.update', category.id), {
        name: category.name,
        is_active: category.is_active ? 0 : 1,  // ← send 0/1 instead of true/false
    });
};

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Categories</h2>}>
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Quick Add Form */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="New Category Name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
                                    <select
                                        value={data.parent_id}
                                        onChange={e => setData('parent_id', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                                    >
                                        <option value="">Select Parent Category</option>
                                        {parentOptions.map(parent => (
                                            <option key={parent.id} value={parent.id}>{parent.name}</option>
                                        ))}
                                    </select>
                                    {errors.parent_id && <div className="text-red-500 text-xs mt-1">{errors.parent_id}</div>}
                                </div>
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add Category</button>
                        </form>
                    </div>

                    {/* Categories Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{cat.name}</div>
                                            {cat.parent && (
                                                <div className="text-xs text-gray-500 mt-1">Child of: {cat.parent.name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {cat.parent ? cat.parent.name : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(cat)}
                                                className={`px-2 py-1 rounded text-xs ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {cat.is_active ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => { if(confirm('Delete?')) router.delete(route('category.destroy', cat.id)) }}
                                                className="text-red-600 ml-4"
                                            >
                                                Delete
                                            </button>
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
