import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, customers }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Customers</h2>}
        >
            <Head title="Customers" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium">Customer List</h3>
                            <Link href={route('customer.create')} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
                                Add Customer
                            </Link>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Contact</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customers.map(c => (
                                    <tr key={c.id}>
                                        <td className="py-4 font-medium">{c.name}</td>
                                        <td className="py-4 text-sm">
                                            {c.phone} <br />
                                            <span className="text-gray-400 text-xs">{c.email}</span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Link href={route('customer.edit', c.id)} className="text-indigo-600 mr-4">Edit</Link>
                                            <button
                                                onClick={() => confirm('Delete?') && router.delete(route('customer.destroy', c.id))}
                                                className="text-red-600"
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
