import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, unit }) {
    const { data, setData, patch, errors, processing } = useForm({
        name: unit.name,
        short_name: unit.short_name,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('Unit.update', unit.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Edit Unit</h2>}>
            <Head title="Edit Unit" />
            <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded-lg">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit Name</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Name</label>
                        <input type="text" value={data.short_name} onChange={e => setData('short_name', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.short_name && <div className="text-red-500 text-xs mt-1">{errors.short_name}</div>}
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                        <Link href={route('Unit.index')} className="text-gray-600 hover:underline">Cancel</Link>
                        <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold hover:bg-indigo-700 disabled:opacity-50">
                            Update Unit
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
