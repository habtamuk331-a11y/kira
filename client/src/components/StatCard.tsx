import React from 'react';
import { Card, CardContent } from './Card';
import { formatCurrency } from '../lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  isLoading?: boolean;
}

export function StatCard({ icon, label, value, isLoading = false }: StatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-indigo-200 dark:border-indigo-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {label}
            </p>
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(value)}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
