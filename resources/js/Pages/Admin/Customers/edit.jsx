import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, customer }) {
    const { data, setData, patch, errors, processing } = useForm({
        name: customer.name,
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
    });

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Edit Customer</h2>}>
            <Head title="Edit Customer" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 bg-white p-6 shadow rounded-lg">
                    <form onSubmit={(e) => { e.preventDefault(); patch(route('customer.update', customer.id)); }} className="space-y-4">
                        <div>
                            <InputLabel value="Name" />
                            <TextInput className="w-full" value={data.name} onChange={e => setData('name', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel value="Phone" />
                            <TextInput className="w-full" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel value="Email" />
                            <TextInput type="email" className="w-full" value={data.email} onChange={e => setData('email', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel value="Address" />
                            <TextInput className="w-full" value={data.address} onChange={e => setData('address', e.target.value)} />
                        </div>
                        <PrimaryButton disabled={processing}>Update Customer</PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
