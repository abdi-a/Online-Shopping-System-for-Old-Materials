'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
  role: 'admin' | 'buyer' | 'seller';
}

export default function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('User');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'User');
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: '📊', path: '/dashboard/admin' },
      { name: 'Users', icon: '👥', path: '/dashboard/admin/users' },
      { name: 'Products', icon: '📦', path: '/dashboard/admin/products' },
      { name: 'Orders', icon: '📋', path: '/dashboard/admin/orders' },
      { name: 'Transactions', icon: '💳', path: '/dashboard/admin/transactions' },
      { name: 'Reports', icon: '📈', path: '/dashboard/admin/reports' },
    ],
    buyer: [
      { name: 'Dashboard', icon: '🏠', path: '/dashboard/buyer' },
      { name: 'Browse Products', icon: '🛍️', path: '/products' },
      { name: 'My Cart', icon: '🛒', path: '/cart' },
      { name: 'My Orders', icon: '📋', path: '/dashboard/buyer/orders' },
      { name: 'Order History', icon: '📜', path: '/dashboard/buyer/history' },
    ],
    seller: [
      { name: 'Dashboard', icon: '🏪', path: '/dashboard/seller' },
      { name: 'My Products', icon: '📦', path: '/dashboard/seller/products' },
      { name: 'Add Product', icon: '➕', path: '/dashboard/seller/add-product' },
      { name: 'Orders', icon: '📋', path: '/dashboard/seller/orders' },
      { name: 'Analytics', icon: '📊', path: '/dashboard/seller/analytics' },
    ],
  };

  const currentMenuItems = menuItems[role];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-slate-200 transition-all duration-300 z-40 ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Old Materials</p>
                <p className="text-xs text-slate-500 uppercase">{role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-slate-100 rounded"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {currentMenuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={() => router.push('/settings')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Settings' : ''}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title={isCollapsed ? 'Logout' : ''}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
