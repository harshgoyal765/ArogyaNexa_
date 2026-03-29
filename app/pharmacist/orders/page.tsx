'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import PharmacistSidebar from '@/components/layout/PharmacistSidebar';
import { ordersService } from '@/lib/services/orders.service';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { OrderResponse } from '@/types/order';

const STATUS_STYLES: Record<string, string> = {
  CREATED: 'bg-surface-container text-outline',
  CONFIRMED: 'bg-primary-fixed text-primary',
  APPROVED: 'bg-secondary-container/30 text-secondary',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-tertiary-fixed/50 text-tertiary',
  CANCELLED: 'bg-error-container text-error',
  PENDING_PRESCRIPTION: 'bg-amber-100 text-amber-800',
};

export default function PharmacistOrdersPage() {
  return (
    <ProtectedRoute requiredRole={['PHARMACIST', 'ADMIN', 'SUPER_ADMIN']}>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'RX' | 'OTC'>('ALL');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    ordersService.list({ page: 0, size: 20 })
      .then(({ data }) => setOrders(data.data.content))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    filter === 'ALL' ? true :
    filter === 'RX' ? o.requiresPrescription :
    !o.requiresPrescription
  );

  const handleVerifyPrescription = async (uuid: string) => {
    setProcessing(uuid);
    try {
      // Replace with: PUT /api/v1/orders/{uuid}/verify-prescription
      await new Promise((r) => setTimeout(r, 600));
      showToast('Prescription verified — order approved', 'success');
      setOrders((prev) => prev.map((o) =>
        o.uuid === uuid ? { ...o, prescriptionVerified: true, status: 'CONFIRMED' } : o
      ));
    } catch {
      showToast('Failed to verify prescription', 'error');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex">
      <PharmacistSidebar />
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Orders</h1>
            <p className="text-xs text-on-surface-variant">Dispensing queue &amp; prescription verification</p>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: orders.length, icon: 'receipt_long', color: 'text-primary', bg: 'bg-primary-fixed/30' },
              { label: 'Needs Rx Verify', value: orders.filter(o => o.requiresPrescription && !o.prescriptionVerified).length, icon: 'pending_actions', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Verified Rx', value: orders.filter(o => o.prescriptionVerified).length, icon: 'verified', color: 'text-tertiary', bg: 'bg-tertiary-fixed/30' },
              { label: 'OTC Orders', value: orders.filter(o => !o.requiresPrescription).length, icon: 'local_pharmacy', color: 'text-secondary', bg: 'bg-secondary-container/20' },
            ].map((s) => (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
                <div>
                  <p className="section-label text-[10px]">{s.label}</p>
                  <p className="font-headline text-2xl text-on-surface">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
            {(['ALL', 'RX', 'OTC'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all',
                  filter === f ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary')}>
                {f === 'RX' ? 'Prescription' : f === 'OTC' ? 'OTC Only' : 'All Orders'}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Order', 'Customer', 'Items', 'Rx Required', 'Rx Verified', 'Total', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {filtered.map((order) => (
                      <tr key={order.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-mono text-xs text-primary">{order.orderNumber}</p>
                          <p className="text-[10px] text-outline">{formatDate(order.createdAt)}</p>
                        </td>
                        <td className="px-5 py-4 font-medium text-on-surface">{order.shippingAddress.name}</td>
                        <td className="px-5 py-4 text-on-surface-variant text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                        <td className="px-5 py-4">
                          {order.requiresPrescription
                            ? <span className="badge bg-amber-100 text-amber-800 text-[10px]">Required</span>
                            : <span className="badge bg-surface-container text-outline text-[10px]">OTC</span>}
                        </td>
                        <td className="px-5 py-4">
                          {order.prescriptionVerified
                            ? <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            : order.requiresPrescription
                              ? <span className="material-symbols-outlined text-amber-500 text-xl">pending</span>
                              : <span className="text-outline text-xs">—</span>}
                        </td>
                        <td className="px-5 py-4 font-semibold text-on-surface">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-5 py-4">
                          <span className={cn('badge text-[10px]', STATUS_STYLES[order.status] || 'bg-surface-container text-outline')}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {order.requiresPrescription && !order.prescriptionVerified ? (
                            <button
                              onClick={() => handleVerifyPrescription(order.uuid)}
                              disabled={processing === order.uuid}
                              className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
                            >
                              {processing === order.uuid ? 'Verifying...' : 'Verify Rx'}
                            </button>
                          ) : (
                            <Link href={`/orders/${order.uuid}`} className="text-xs text-on-surface-variant hover:text-primary transition-colors">
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-on-surface-variant text-sm">No orders found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
