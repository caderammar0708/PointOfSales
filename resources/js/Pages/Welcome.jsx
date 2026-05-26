import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Head title="Welcome to Our Store" />

            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-100">
                <div className="text-3xl font-bold tracking-tighter text-indigo-600">
                    Grow<span className="text-gray-900">DIGITEC</span>
                </div>
                <div className="space-x-6 flex items-center">
                    <Link href="#" className="text-sm font-medium hover:text-indigo-600">Shop</Link>
                    <Link href="#" className="text-sm font-medium hover:text-indigo-600">Categories</Link>
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="px-8 py-20 bg-gray-50 flex flex-col items-center text-center">
                <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4">New Collection 2026</span>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                    Quality Essentials <br /> for Modern Living.
                </h1>
                <p className="text-gray-500 max-w-2xl text-lg mb-10">
                    Experience the best in retail. Seamlessly browse our collection,
                    manage your orders, and get fast delivery right to your doorstep.
                </p>
                <div className="flex space-x-4">
                    <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-indigo-200">
                        Shop Now
                    </button>
                    <button className="bg-white border border-gray-200 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50">
                        View Catalog
                    </button>
                </div>
            </header>

            {/* Feature Section */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Fast Delivery</h3>
                        <p className="text-gray-500">Get your items delivered within 24 hours in major city areas.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Secure Payments</h3>
                        <p className="text-gray-500">Every transaction is encrypted and secured by top-tier providers.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Best Inventory</h3>
                        <p className="text-gray-500">We stock only the highest quality products from trusted brands.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-8 mb-8">
                    <div className="text-white font-bold text-xl mb-4 md:mb-0">GROW<span className="text-gray-900">DIGITEC</span></div>
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-white">Contact Us</a> 
                    </div>
                </div>
                <div className="text-center text-xs">
                    &copy; 2026 GROWDIGITEC. All rights reserved. Powered by POS Core.
                </div>
            </footer>
        </div>
    );
}
