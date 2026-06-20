import { TrendingUp, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import {
  useSalesStats,
  useExpensesStats,
  useCreditsStats,
} from '../hooks/useQueries';

export function DashboardPage() {
  const { data: salesStats, isLoading: salesLoading } = useSalesStats();
  const { data: expensesStats, isLoading: expensesLoading } = useExpensesStats();
  const { data: creditsStats, isLoading: creditsLoading } = useCreditsStats();

  const stats = [
    {
      label: 'Total Sales (This Month)',
      value: salesStats?.thisMonth || 0,
      icon: <TrendingUp className="w-8 h-8" />,
      isLoading: salesLoading,
    },
    {
      label: 'Total Sales (This Week)',
      value: salesStats?.thisWeek || 0,
      icon: <TrendingUp className="w-8 h-8" />,
      isLoading: salesLoading,
    },
    {
      label: 'Total Expense (This Week)',
      value: expensesStats?.thisWeek || 0,
      icon: <DollarSign className="w-8 h-8" />,
      isLoading: expensesLoading,
    },
    {
      label: 'Total Credit Outstanding',
      value: creditsStats?.outstanding || 0,
      icon: <CreditCard className="w-8 h-8" />,
      isLoading: creditsLoading,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            isLoading={stat.isLoading}
          />
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Welcome to ShopManager
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Use the sidebar to navigate to Sales, Expense, or Credit sections to manage your shop.
            All data is stored locally in SQLite and updates in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
