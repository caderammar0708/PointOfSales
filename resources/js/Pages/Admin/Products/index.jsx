import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, products }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Products</h2>}>
            <Head title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow rounded-lg">
                        <Link href={route('product.create')} className="bg-gray-800 text-white px-4 py-2 rounded-md">Add Product</Link>

                        <table className="min-w-full mt-6 divide-y">
                            <thead>
                                <tr className="text-left text-xs uppercase text-gray-500">
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Unit</th>
                                    <th>Cost Price</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-t">
                                        <td className="py-2">
                                            {p.image ? <img src={`/storage/${p.image}`} className="w-12 h-12 object-cover rounded" /> : 'No image'}
                                        </td>
                                        <td>{p.name}</td>
                                        <td>{p.category.name}</td>
                                        <td>{p.unit.name}</td>
                                        <td>${p.cost_price}</td>
                                        <td>${p.price}</td>
                                        <td>{p.stock}</td>
                                        <td>
                                            <Link href={route('product.edit', p.id)} className="text-blue-600 mr-3">Edit</Link>
                                            <button onClick={() => confirm('Delete?') && router.delete(route('product.destroy', p.id))} className="text-red-600">Delete</button>
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
