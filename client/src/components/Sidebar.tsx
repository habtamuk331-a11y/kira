import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, TrendingUp, CreditCard, DollarSign, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ isDarkMode, onToggleDarkMode }: SidebarProps) {
  const location = useLocation();

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

      {/* Dark Mode */}
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
      </div>
    </div>
  );
}
