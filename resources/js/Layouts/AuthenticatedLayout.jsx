// resources/js/Layouts/AuthenticatedLayout.jsx
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  HomeIcon,
  CreditCardIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  TruckIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon, // Used for 'Shop' parent
  UserCircleIcon, // Used for 'People' parent
  ScaleIcon, // Icon for Units
  TicketIcon,
} from '@heroicons/react/24/outline';

const navigation = {
  admin: [
    { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
    { name: 'POS / New Sale', href: route('sales.index'), icon: CreditCardIcon },

    // Group: Shop
    {
      name: 'Shop',
      icon: Squares2X2Icon,
      children: [
        { name: 'Categories', href: route('category.index'), icon: ClipboardDocumentListIcon },
        { name: 'Products', href: route('product.index'), icon: CubeIcon },
        { name: 'Units', href: route('Unit.index'), icon: ScaleIcon }, // New Page
      ],
    },

    // Group: People
    {
      name: 'People',
      icon: UserCircleIcon,
      children: [
        { name: 'Customers', href: route('customer.index'), icon: UserGroupIcon },
        { name: 'Users', href: route('user.index'), icon: UsersIcon },
      ],
    },

    // Offers & Promo Menu
    {
      name: 'Offers & Promo',
      icon: TicketIcon,
      children: [
        { name: 'Combo Offers', href: route('offers.index', {type: 'combo'}), createHref: route('offers.create', {type: 'combo'}) },
        { name: '1 to 1 Offers', href: route('offers.index', {type: '1to1'}), createHref: route('offers.create', {type: '1to1'}) },
        { name: 'Discounts', href: route('offers.index', {type: 'discount'}), createHref: route('offers.create', {type: 'discount'}) },
        { name: 'Coupons', href: route('offers.index', {type: 'coupon'}), createHref: route('offers.create', {type: 'coupon'}) },
      ],
    },

    { name: 'Sales History', href: route('sales.history'), icon: ShoppingBagIcon },
    { name: 'Stock Movements', href: route('Stock.index'), icon: TruckIcon },

    // Group: Reports
    {
      name: 'Reports',
      icon: DocumentChartBarIcon,
      children: [
        { name: 'Daily Report', href: route('reports.daily'), icon: DocumentChartBarIcon },
        { name: 'Product Report', href: route('reports.products'), icon: ChartBarIcon },
        { name: 'Profit Report', href: route('reports.profit'), icon: CurrencyDollarIcon },
      ],
    },

    { name: 'Settings', href: route('profile.edit'), icon: Cog6ToothIcon },
  ],
  cashier: [
    { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
    { name: 'POS / New Sale', href: route('sales.index'), icon: CreditCardIcon },
    { name: 'Products', href: route('product.index'), icon: CubeIcon },
    { name: 'Customers', href: route('customer.index'), icon: UserGroupIcon },
    { name: 'Sales History', href: route('sales.history'), icon: ShoppingBagIcon },
  ],
};

const NavItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.children;

  // Get current URL for comparison
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;

  // Checks if the current URL matches a child's route to keep the menu expanded
  const isChildActive = hasChildren
    ? item.children.some(child => {
        // Get the child's path from href
        const childPath = child.href.split('?')[0]; // Remove query params
        
        // Check if current path starts with the child's base path
        // This handles routes like /offers, /product, /category, etc.
        const basePath = childPath.replace(window.location.origin, '');
        
        // Check for exact route match using Inertia's router
        const routeName = child.href.split('/').pop().split('?')[0];
        const matchesRoute = route().current(routeName);
        
        // Check if current URL contains the base path (for nested routes)
        const matchesPath = currentUrl.includes(basePath) || currentPath.includes(basePath.replace(/https?:\/\/[^/]+/, ''));
        
        // For query parameter specific pages (like offers with type)
        if (child.href.includes('?')) {
          const urlParams = new URLSearchParams(child.href.split('?')[1]);
          for (const [key, value] of urlParams) {
            if (currentUrl.includes(`${key}=${value}`)) {
              return true;
            }
          }
        }
        
        return matchesRoute || matchesPath;
      })
    : route().current(item.href.split('/').pop());

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
          isChildActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isChildActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
        {item.name}
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
          isChildActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isChildActive ? 'text-indigo-600' : 'text-gray-400'}`} />
        <span className="flex-1 text-left font-semibold">{item.name}</span>
        <ChevronDownIcon className={`ml-3 h-4 w-4 transform transition-transform duration-200 ${isOpen || isChildActive ? 'rotate-180' : ''}`} />
      </button>

      {(isOpen || isChildActive) && (
        <div className="pl-10 space-y-1">
          {item.children.map((child) => {
            const childUrl = window.location.href;
            
            // Check exact route match
            const routeName = child.href.split('/').pop().split('?')[0];
            let isActive = route().current(routeName);
            
            // Check path match for nested routes
            const childPath = child.href.split('?')[0];
            if (!isActive && childUrl.includes(childPath)) {
              isActive = true;
            }
            
            // For pages with query parameters (offers with type, etc.)
            if (child.href.includes('?')) {
              const childParams = new URLSearchParams(child.href.split('?')[1]);
              const currentParams = new URLSearchParams(window.location.search);
              
              // Check if all params in child href match current URL
              let allParamsMatch = true;
              for (const [key, value] of childParams) {
                if (!childUrl.includes(`${key}=${value}`)) {
                  allParamsMatch = false;
                  break;
                }
              }
              if (allParamsMatch) isActive = true;
            }
            
            return (
              <Link
                key={child.name}
                href={child.href}
                className={`block py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {child.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function AuthenticatedLayout({ user, header, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const userRole = user?.role || 'cashier';
  const navItems = navigation[userRole] || navigation.cashier;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <span className="text-2xl font-black text-indigo-600 tracking-tighter">GD POS</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
             <Link
                href={route('logout')}
                method="post"
                as="button"
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5" />
                Sign Out
              </Link>
          </div>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-gray-200 pt-6 overflow-hidden">
          <div className="px-6 mb-8">
            <Link href={route('dashboard')} className="text-2xl font-black text-indigo-600 tracking-tighter">
              GROW<span className="text-gray-900">DIGITEC</span>
            </Link>
          </div>
          <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* User Section */}
          <div className="relative p-4 border-t border-gray-100 bg-gray-50/50">
            {/* Logout Popover - appears above the profile */}
            {showLogout && (
              <div className="absolute bottom-full left-0 right-0 mb-1 mx-3 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5" />
                  Log out
                </Link>
              </div>
            )}
            <div
              className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setShowLogout(!showLogout)}
            >
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
              </div>
              <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showLogout ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden px-4 h-16 flex items-center justify-between">
           <span className="text-lg font-black text-indigo-600">GD POS</span>
           <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-500">
              <Bars3Icon className="h-6 w-6" />
           </button>
        </div>

        {header && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              {header}
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
