import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BanknotesIcon, 
    ArrowTrendingUpIcon, 
    CalendarIcon, 
    ClockIcon, 
    ChartBarIcon 
} from '@heroicons/react/24/outline';

const StatCard = ({ title, data, icon: Icon, colorClass = "indigo" }) => {
    // 1. Safety: Provide default values in case data is undefined
    const profit = parseFloat(data?.profit || 0);
    const revenue = parseFloat(data?.revenue || 0);
    const cost = parseFloat(data?.cost || 0);

    // 2. Class Maps (Keep these as full strings so Tailwind's JIT compiler sees them)
    const styles = {
        blue: { bg: 'bg-blue-50/50', border: 'border-blue-100/50', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
        indigo: { bg: 'bg-indigo-50/50', border: 'border-indigo-100/50', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-100/50', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
        emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-100/50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
        amber: { bg: 'bg-amber-50/50', border: 'border-amber-100/50', iconBg: 'bg-amber-100', iconText: 'text-amber-600' }
    }[colorClass] || styles.indigo; // Fallback to indigo

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`p-4 ${styles.bg} flex items-center gap-3 border-b ${styles.border}`}>
                <div className={`p-2 ${styles.iconBg} rounded-lg ${styles.iconText}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{title}</h3>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Net Profit</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">
                        ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Revenue</p>
                        <p className="text-sm font-bold text-gray-700">${revenue.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Cost</p>
                        <p className="text-sm font-bold text-red-500">${cost.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Profit({ auth, stats }) {
    // 3. Prevent "Cannot read property of undefined" if stats is missing
    const safeStats = stats || {
        today: {}, week: {}, month: {}, year: {}, all_time: {}
    };

    const formatCurrency = (val) => parseFloat(val || 0).toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-indigo-800">Financial Reports</h2>}
        >
            <Head title="Profit Report" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Profit & Loss Overview</h1>
                            <p className="text-gray-500">Track your business performance across different time periods.</p>
                        </div>
                        <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 w-fit">
                            <BanknotesIcon className="h-5 w-5" />
                            Live Statistics
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title="Today" data={safeStats.today} icon={ClockIcon} colorClass="blue" />
                        <StatCard title="This Week" data={safeStats.week} icon={CalendarIcon} colorClass="indigo" />
                        <StatCard title="This Month" data={safeStats.month} icon={ChartBarIcon} colorClass="purple" />
                        <StatCard title="This Year" data={safeStats.year} icon={ArrowTrendingUpIcon} colorClass="emerald" />
                        <StatCard title="All Time" data={safeStats.all_time} icon={BanknotesIcon} colorClass="amber" />
                    </div>

                    {/* All Time Summary Banner */}
                    <div className="mt-10 bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-white/5">
                         {/* Decorative Gradients */}
                         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                         
                         <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
                            <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Grand Total Net Profit</p>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                                ${formatCurrency(safeStats.all_time.profit)}
                            </h2>
                         </div>
                         
                         <div className="mt-8 md:mt-0 flex gap-8 md:gap-16 relative z-10">
                            <div className="text-center md:text-right">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</p>
                                <p className="text-3xl md:text-4xl font-black tracking-tight">${parseFloat(safeStats.all_time.revenue || 0).toLocaleString()}</p>
                            </div>
                            <div className="text-center md:text-right border-l border-white/10 pl-8 md:pl-16">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total Cost</p>
                                <p className="text-3xl md:text-4xl font-black tracking-tight text-red-400">${parseFloat(safeStats.all_time.cost || 0).toLocaleString()}</p>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}