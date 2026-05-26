import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full"></div>

                <div className="relative z-10 flex flex-col justify-center px-16">
                    <Link href="/" className="mb-12">
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            GROW<span className="text-indigo-200">DIGITEC</span>
                        </h1>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                        Point of Sale<br />System
                    </h2>
                    <p className="text-indigo-200 text-lg max-w-md leading-relaxed">
                        Manage your sales, inventory, and customers all in one powerful platform.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-3 mt-10">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                            📊 Real-time Reports
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                            📦 Inventory
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                            👥 Multi-user
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 bg-gray-50">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/">
                        <h1 className="text-3xl font-black text-indigo-600 tracking-tighter">
                            GROW<span className="text-gray-900">DIGITEC</span>
                        </h1>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
