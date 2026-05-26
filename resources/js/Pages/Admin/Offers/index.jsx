import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    TicketIcon, 
    TagIcon, 
    GiftIcon, 
    ShoppingBagIcon 
} from '@heroicons/react/24/outline';

export default function Index({ auth, offers, currentType }) {
    
    // Helper to get the title based on type
    const getTitle = () => {
        const titles = {
            discount: 'Product Discounts',
            '1to1': 'Buy 1 Get 1 Offers',
            combo: 'Combo Packages',
            coupon: 'Promo Coupons'
        };
        return titles[currentType] || 'Offers';
    };

    // Helper to get the icon based on type
    const TypeIcon = ({ type, className }) => {
        if (type === 'discount') return <TagIcon className={className} />;
        if (type === '1to1') return <GiftIcon className={className} />;
        if (type === 'combo') return <ShoppingBagIcon className={className} />;
        return <TicketIcon className={className} />;
    };

    const deleteOffer = (id) => {
        if (confirm('Are you sure you want to delete this offer?')) {
            router.delete(route('offers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <div className="flex items-center gap-3">
                    <TypeIcon type={currentType} className="h-8 w-8 text-indigo-600" />
                    <h2 className="font-bold text-2xl text-gray-800">{getTitle()}</h2>
                </div>
            }
        >
            <Head title={getTitle()} />

            <div className="max-w-7xl mx-auto py-6">
                {/* Top Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-500 text-sm">
                        Showing all active and scheduled <span className="font-bold text-indigo-600">{currentType}</span> rules.
                    </p>
                    <Link 
                        href={route('offers.create', {type: currentType})} 
                        className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create {currentType}
                    </Link>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Offer Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Validity</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {offers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{offer.name}</div>
                                        {offer.code && (
                                            <div className="text-xs font-mono text-indigo-600 mt-1 bg-indigo-50 px-2 py-0.5 rounded w-fit border border-indigo-100">
                                                Code: {offer.code}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-bold text-gray-900">{offer.products_count}</span> items linked
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-500">
                                            {offer.start_date ? offer.start_date : 'No Start'} 
                                            <span className="mx-1">→</span>
                                            {offer.end_date ? offer.end_date : 'Permanent'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {offer.is_active ? (
                                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 rounded-full border border-green-200">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 rounded-full">
                                                Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link 
                                            href={route('offers.edit', offer.id)} 
                                            className="text-indigo-400 hover:text-indigo-600 inline-block transition"
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </Link>
                                        <button 
                                            onClick={() => deleteOffer(offer.id)}
                                            className="text-gray-300 hover:text-red-600 transition"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {offers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                        No {currentType} offers found. Click "Create" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}