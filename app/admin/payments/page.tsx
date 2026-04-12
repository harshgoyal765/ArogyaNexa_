'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { paymentsService } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { PagedResponse } from '@/types/api';
import type { PaymentResponse } from '@/lib/api/payments';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-tertiary-fixed/50 text-tertiary',
  INITIATED: 'bg-amber-100 text-amber-800',
  FAILED: 'bg-error-container text-error',
  REFUNDED: 'bg-surface-container text-outline',
};

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPaymentsContent />
    </ProtectedRoute>
  );
}

function AdminPaymentsContent() {
  const [data, setData] = useState<PagedResponse<PaymentResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    paymentsService.list({ page: 0, size: 20 })
      .then(({ data: res }) => setData(res.data))
      .catch(async () => {
        // Fallback to static data
        try {
          const response = await fetch('/data/payments.json');
          const payments = await response.json();
          setData({
            content: payments,
            page: 0,
            size: 20,
            totalElements: payments.length,
            totalPages: Math.ceil(payments.length / 20),
            last: true,
          });
        } catch {
          setData({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, last: true });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRefund = async (uuid: string) => {
    if (!confirm('Initiate full refund for this payment?')) return;
    setRefunding(uuid);
    try {
      await paymentsService.refund(uuid, 'Admin initiated refund');
      showToast('Refund initiated successfully', 'success');
    } catch {
      showToast('Failed to initiate refund', 'error');
    } finally {
      setRefunding(null);
    }
  };

  // Demo data
  const payments = data?.content ?? [];

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <h1 className="font-headline text-2xl text-primary">Payment Management</h1>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Collected', value: formatCurrency(payments.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amount, 0)), icon: 'payments', color: 'text-primary' },
              { label: 'Pending', value: String(payments.filter(p => p.status === 'INITIATED').length), icon: 'pending', color: 'text-amber-600' },
              { label: 'Failed', value: String(payments.filter(p => p.status === 'FAILED').length), icon: 'cancel', color: 'text-error' },
            ].map(card => (
              <div key={card.label} className="card p-6 flex items-center gap-4">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className={`material-symbols-outlined text-2xl ${card.color}`}>{card.icon}</span>
                </div>
                <div>
                  <p className="section-label text-[10px]">{card.label}</p>
                  <p className="font-headline text-2xl font-bold text-on-surface">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Payment ID', 'Order', 'Method', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {payments.map((payment) => (
                      <tr key={payment.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-on-surface-variant">{payment.uuid.slice(0, 8)}...</td>
                        <td className="px-5 py-4 font-mono text-xs text-primary">{payment.gatewayOrderId}</td>
                        <td className="px-5 py-4 text-on-surface-variant">{payment.paymentMethod}</td>
                        <td className="px-5 py-4 font-semibold text-on-surface">{formatCurrency(payment.amount)}</td>
                        <td className="px-5 py-4">
                          <span className={`badge text-xs ${STATUS_COLORS[payment.status] || 'bg-surface-container text-outline'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-on-surface-variant text-xs">{formatDate(payment.createdAt)}</td>
                        <td className="px-5 py-4">
                          {payment.status === 'SUCCESS' && (
                            <button
                              onClick={() => handleRefund(payment.uuid)}
                              disabled={refunding === payment.uuid}
                              className="text-xs text-error hover:bg-error-container/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {refunding === payment.uuid ? 'Processing...' : 'Refund'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
