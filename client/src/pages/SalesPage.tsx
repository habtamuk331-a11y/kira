import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  useSales,
  useSalesChart,
  useTodayBreakdown,
  useCreateSale,
  useDeleteSale,
} from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function SalesPage() {
  const { data: sales = [], isLoading: salesLoading } = useSales();
  const { data: chartData = [], isLoading: chartLoading } = useSalesChart();
  const { data: breakdown = { cash: 0, mobileBanking: 0 } } = useTodayBreakdown();
  const createSale = useCreateSale();
  const deleteSale = useDeleteSale();

  const [cashAmount, setCashAmount] = useState('');
  const [mobileAmount, setMobileAmount] = useState('');
  const [errors, setErrors] = useState({ cash: '', mobile: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const validateAmount = (amount: string): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      return false;
    }
    return true;
  };

  const handleAddCash = async () => {
    if (!validateAmount(cashAmount)) {
      setErrors({ ...errors, cash: 'Please enter a valid amount' });
      return;
    }
    await createSale.mutateAsync({
      type: 'cash',
      amount: parseFloat(cashAmount),
    });
    setCashAmount('');
    setErrors({ ...errors, cash: '' });
  };

  const handleAddMobile = async () => {
    if (!validateAmount(mobileAmount)) {
      setErrors({ ...errors, mobile: 'Please enter a valid amount' });
      return;
    }
    await createSale.mutateAsync({
      type: 'mobile_banking',
      amount: parseFloat(mobileAmount),
    });
    setMobileAmount('');
    setErrors({ ...errors, mobile: '' });
  };

  const filteredSales = sales.filter((sale: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sale.type.toLowerCase().includes(searchLower) ||
      formatDate(sale.createdAt).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 space-y-8">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value as number)}
                />
                <Bar dataKey="total" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Today's Cash Sales
            </p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(breakdown.cash)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Today's Mobile Banking Sales
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(breakdown.mobileBanking)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Sale Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Cash Amount"
                type="number"
                placeholder="Enter amount"
                value={cashAmount}
                onChange={(e) => {
                  setCashAmount(e.target.value);
                  setErrors({ ...errors, cash: '' });
                }}
                error={errors.cash}
                min="0"
                step="0.01"
              />
              <Button
                onClick={handleAddCash}
                className="w-full mt-4"
                disabled={createSale.isPending}
              >
                {createSale.isPending ? 'Adding...' : 'Add Cash'}
              </Button>
            </div>

            <div>
              <Input
                label="Mobile Banking Amount"
                type="number"
                placeholder="Enter amount"
                value={mobileAmount}
                onChange={(e) => {
                  setMobileAmount(e.target.value);
                  setErrors({ ...errors, mobile: '' });
                }}
                error={errors.mobile}
                min="0"
                step="0.01"
              />
              <Button
                onClick={handleAddMobile}
                className="w-full mt-4"
                disabled={createSale.isPending}
              >
                {createSale.isPending ? 'Adding...' : 'Add Mobile Banking'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sales</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No sales found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Date/Time</th>
                    <th className="text-right py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale: any) => (
                    <tr
                      key={sale.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 capitalize">
                          {sale.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(sale.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(sale.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ConfirmDialog
                          title="Delete Sale?"
                          description={`Are you sure you want to delete this ${sale.type} sale of ${formatCurrency(sale.amount)}?`}
                          confirmText="Delete"
                          isDangerous
                          onConfirm={async () => {
                            await deleteSale.mutateAsync(sale.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                        </ConfirmDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
