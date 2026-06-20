// Date utility functions to reduce duplication
export function getTodayRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getWeekRange() {
  const today = getTodayRange();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return weekStart;
}

export function getMonthRange() {
  const today = getTodayRange();
  const monthStart = new Date(today);
  monthStart.setDate(1);
  return monthStart;
}

// Amount formatting and rounding to avoid floating point errors
export function formatAmount(amount: string | number): number {
  return Math.round(parseFloat(String(amount)) * 100) / 100;
}

// Validate amount is positive
export function isValidAmount(amount: any): boolean {
  const parsed = parseFloat(amount);
  return !isNaN(parsed) && parsed > 0;
}

// Validate string is not empty
export function isValidString(value: any): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
