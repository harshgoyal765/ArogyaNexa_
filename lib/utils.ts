import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function handleApiError(error: unknown): string {
  const err = error as { response?: { data?: { message?: string; errors?: { field: string; message: string }[] } } };
  const data = err.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
  }
  return data?.message || 'Something went wrong. Please try again.';
}

export function getScheduleBadgeColor(schedule: string): string {
  switch (schedule) {
    case 'H': return 'bg-amber-100 text-amber-800';
    case 'H1': return 'bg-orange-100 text-orange-800';
    case 'X': return 'bg-red-100 text-red-800';
    case 'G': return 'bg-blue-100 text-blue-800';
    default: return 'bg-green-100 text-green-800';
  }
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    CREATED: 'bg-slate-100 text-slate-700',
    PENDING_PRESCRIPTION: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    PAYMENT_PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-indigo-100 text-indigo-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
}
