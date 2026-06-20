import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  useCredits,
  useCreditsStats,
  useCreateCredit,
  useUpdateCredit,
  useDeleteCredit,
} from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';

export function CreditPage() {
  const { data: credits = [], isLoading: creditsLoading } = useCredits();
  const { data: stats } = useCreditsStats();
  const createCredit = useCreateCredit();
  const updateCredit = useUpdateCredit();
  const deleteCredit = useDeleteCredit();

  const [ownerName, setOwnerName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ ownerName: '', amount: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const validateForm = (): boolean => {
    const newErrors = { ownerName: '', amount: '' };

    if (!ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return !newErrors.ownerName && !newErrors.amount;
  };

  const handleAddCredit = async () => {
    if (!validateForm()) return;

    await createCredit.mutateAsync({
      ownerName: ownerName.trim(),
      amount: parseFloat(amount),
    });

    setOwnerName('');
    setAmount('');
    setErrors({ ownerName: '', amount: '' });
  };

  const handleTogglePaid = (creditId: string, currentStatus: boolean) => {
    updateCredit.mutate({ id: creditId, isPaid: !currentStatus });
  };

  const filteredCredits = credits.filter((credit: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      credit.ownerName.toLowerCase().includes(searchLower) ||
      formatDate(credit.createdAt).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 space-y-8">
      {/* Outstanding Credit Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Outstanding Credit
          </p>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(stats?.outstanding || 0)}
          </p>
        </CardContent>
      </Card>

      {/* Add Credit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Credit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Credit Owner"
                placeholder="Enter owner name"
                value={ownerName}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  setErrors({ ...errors, ownerName: '' });
                }}
                error={errors.ownerName}
              />
            </div>

            <div>
              <Input
                label="Credit Amount"
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
            onClick={handleAddCredit}
            className="w-full mt-6"
            disabled={createCredit.isPending}
          >
            {createCredit.isPending ? 'Adding...' : 'Add Credit'}
          </Button>
        </CardContent>
      </Card>

      {/* Credits Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Credits</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Search credits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {creditsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filteredCredits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No credits found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Owner</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCredits.map((credit: any) => (
                    <tr
                      key={credit.id}
                      className={`border-b border-gray-200 dark:border-gray-700 transition-all ${
                        credit.isPaid
                          ? 'opacity-75 bg-gray-50 dark:bg-gray-700/50'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <td className={`py-3 px-4 font-medium ${credit.isPaid ? 'line-through' : ''}`}>
                        {credit.ownerName}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${credit.isPaid ? 'line-through' : ''}`}>
                        {formatCurrency(credit.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(credit.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={credit.isPaid}
                              onChange={() =>
                                handleTogglePaid(credit.id, credit.isPaid)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className={`text-xs font-medium ${credit.isPaid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                              {credit.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ConfirmDialog
                          title="Delete Credit?"
                          description={`Are you sure you want to delete the credit for ${credit.ownerName} (${formatCurrency(credit.amount)})?`}
                          confirmText="Delete"
                          isDangerous
                          onConfirm={async () => {
                            await deleteCredit.mutateAsync(credit.id);
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
