import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '', phone: '', email: '', address: ''
    });

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Add Customer</h2>}>
            <Head title="Add Customer" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 bg-white p-6 shadow rounded-lg">
                    <form onSubmit={(e) => { e.preventDefault(); post(route('customer.store')); }} className="space-y-4">
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
                        <PrimaryButton disabled={processing}>Save Customer</PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
