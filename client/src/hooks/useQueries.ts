import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saleApi, expenseApi, creditApi } from '../lib/api';
import { toast } from 'sonner';

// ============ SALES HOOKS ============

export function useSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data } = await saleApi.getAll();
      return data;
    },
  });
}

export function useSalesStats() {
  return useQuery({
    queryKey: ['salesStats'],
    queryFn: async () => {
      const { data } = await saleApi.getStats();
      return data;
    },
  });
}

export function useTodayBreakdown() {
  return useQuery({
    queryKey: ['todayBreakdown'],
    queryFn: async () => {
      const { data } = await saleApi.getTodayBreakdown();
      return data;
    },
  });
}

export function useSalesChart() {
  return useQuery({
    queryKey: ['salesChart'],
    queryFn: async () => {
      const { data } = await saleApi.getChart();
      return data;
    },
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { type: 'cash' | 'mobile_banking'; amount: number }) =>
      saleApi.create(data),
    onSuccess: () => {
      toast.success('Sale added successfully');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesStats'] });
      queryClient.invalidateQueries({ queryKey: ['todayBreakdown'] });
      queryClient.invalidateQueries({ queryKey: ['salesChart'] });
    },
    onError: () => {
      toast.error('Failed to add sale');
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saleApi.delete(id),
    onSuccess: () => {
      toast.success('Sale deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesStats'] });
      queryClient.invalidateQueries({ queryKey: ['todayBreakdown'] });
      queryClient.invalidateQueries({ queryKey: ['salesChart'] });
    },
    onError: () => {
      toast.error('Failed to delete sale');
    },
  });
}

// ============ EXPENSE HOOKS ============

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data } = await expenseApi.getAll();
      return data;
    },
  });
}

export function useExpensesStats() {
  return useQuery({
    queryKey: ['expensesStats'],
    queryFn: async () => {
      const { data } = await expenseApi.getStats();
      return data;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason: string; amount: number }) =>
      expenseApi.create(data),
    onSuccess: () => {
      toast.success('Expense added successfully');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesStats'] });
    },
    onError: () => {
      toast.error('Failed to add expense');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      toast.success('Expense deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesStats'] });
    },
    onError: () => {
      toast.error('Failed to delete expense');
    },
  });
}

// ============ CREDIT HOOKS ============

export function useCredits() {
  return useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const { data } = await creditApi.getAll();
      return data;
    },
  });
}

export function useCreditsStats() {
  return useQuery({
    queryKey: ['creditsStats'],
    queryFn: async () => {
      const { data } = await creditApi.getStats();
      return data;
    },
  });
}

export function useCreateCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ownerName: string; amount: number }) =>
      creditApi.create(data),
    onSuccess: () => {
      toast.success('Credit added successfully');
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['creditsStats'] });
    },
    onError: () => {
      toast.error('Failed to add credit');
    },
  });
}

export function useUpdateCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: boolean }) =>
      creditApi.update(id, { isPaid }),
    onSuccess: () => {
      toast.success('Credit updated successfully');
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['creditsStats'] });
    },
    onError: () => {
      toast.error('Failed to update credit');
    },
  });
}

export function useDeleteCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => creditApi.delete(id),
    onSuccess: () => {
      toast.success('Credit deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['creditsStats'] });
    },
    onError: () => {
      toast.error('Failed to delete credit');
    },
  });
}
