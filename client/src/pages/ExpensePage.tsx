import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  useExpenses,
  useExpensesStats,
  useCreateExpense,
  useDeleteExpense,
} from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';

export function ExpensePage() {
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: stats } = useExpensesStats();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();

  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ reason: '', amount: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const validateForm = (): boolean => {
    const newErrors = { reason: '', amount: '' };

    if (!reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return !newErrors.reason && !newErrors.amount;
  };

  const handleAddExpense = async () => {
    if (!validateForm()) return;

    await createExpense.mutateAsync({
      reason: reason.trim(),
      amount: parseFloat(amount),
    });

    setReason('');
    setAmount('');
    setErrors({ reason: '', amount: '' });
  };

  const filteredExpenses = expenses.filter((expense: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      expense.reason.toLowerCase().includes(searchLower) ||
      formatDate(expense.createdAt).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 space-y-8">
      {/* Total Expense Summary */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Expense (This Week)
          </p>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(stats?.thisWeek || 0)}
          </p>
        </CardContent>
      </Card>

      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Reason"
                placeholder="e.g., Rent, Utilities, Supplies"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors({ ...errors, reason: '' });
                }}
                error={errors.reason}
              />
            </div>

            <div>
              <Input
                label="Amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors({ ...errors, amount: '' });
                }}
                error={errors.amount}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <Button
            onClick={handleAddExpense}
            className="w-full mt-6"
            disabled={createExpense.isPending}
          >
            {createExpense.isPending ? 'Adding...' : 'Add Expense'}
          </Button>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Reason</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Date/Time</th>
                    <th className="text-right py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense: any) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{expense.reason}</td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(expense.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ConfirmDialog
                          title="Delete Expense?"
                          description={`Are you sure you want to delete "${expense.reason}" (${formatCurrency(expense.amount)})?`}
                          confirmText="Delete"
                          isDangerous
                          onConfirm={async () => {
                            await deleteExpense.mutateAsync(expense.id);
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
