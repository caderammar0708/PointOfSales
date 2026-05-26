import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, units }) {
    const deleteUnit = (id) => {
        if (confirm('Are you sure you want to delete this unit?')) {
            router.delete(route('Unit.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Unit Management</h2>}>
            <Head title="Units" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-6">
                    <Link href={route('Unit.create')} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700">
                        <PlusIcon className="h-5 w-5 mr-2" /> Add Unit
                    </Link>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {units.map((unit) => (
                                <tr key={unit.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{unit.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{unit.short_name}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={route('Unit.edit', unit.id)} className="text-indigo-600 hover:text-indigo-900 inline-block">
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => deleteUnit(unit.id)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
