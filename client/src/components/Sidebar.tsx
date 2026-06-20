import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, TrendingUp, CreditCard, DollarSign, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ isDarkMode, onToggleDarkMode }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: ShoppingCart },
    { label: 'Sales', path: '/sales', icon: TrendingUp },
    { label: 'Expense', path: '/expense', icon: DollarSign },
    { label: 'Credit', path: '/credit', icon: CreditCard },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          ShopManager
        </h1>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-200 dark:border-indigo-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 py-6">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Dark Mode & Logout */}
      <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          title="Toggle dark mode"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5" />
              <span className="text-sm">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span className="text-sm">Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
