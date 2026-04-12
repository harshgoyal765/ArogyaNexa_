'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { ordersService } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderResponse } from '@/types/order';
import type { PagedResponse } from '@/types/api';


const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

const ORDER_STATUSES = ['', 'CREATED', 'PENDING_PRESCRIPTION', 'APPROVED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN" blockSuperAdmin={true}>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}

function AdminOrdersContent() {
  const [data, setData] = useState<PagedResponse<OrderResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    ordersService.list({ page, size: 15, status: statusFilter || undefined })
      .then(({ data: res }) => setData(res.data))
      .catch(() => {
        setData({ content: [], page: 0, size: 15, totalElements: 0, totalPages: 0, last: true });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusUpdate = async (uuid: string, status: string) => {
    setUpdating(uuid);
    try {
      await ordersService.updateStatus(uuid, status);
      showToast('Order status updated', 'success');
      fetchOrders();
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <h1 className="font-headline text-2xl text-primary">Order Management</h1>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="input-field py-2 text-sm w-auto"
            >
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
            <Link 
              href="/admin/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/admin/profile"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : (
            <>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface-container-low">
                      <tr>
                        {['Order', 'Customer', 'Date', 'Status', 'Payment', 'Total', 'Actions'].map(h => (
                          <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                      {data?.content.map((order) => (
                        <tr key={order.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-5 py-4">
                            <Link href={`/orders/${order.uuid}`} className="font-mono text-xs text-primary hover:underline">{order.orderNumber}</Link>
                          </td>
                          <td className="px-5 py-4 font-medium text-on-surface">{order.shippingAddress.name}</td>
                          <td className="px-5 py-4 text-on-surface-variant text-xs">{formatDate(order.createdAt)}</td>
                          <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
                          <td className="px-5 py-4 text-on-surface-variant">{order.paymentStatus}</td>
                          <td className="px-5 py-4 font-semibold text-on-surface">{formatCurrency(order.totalAmount)}</td>
                          <td className="px-5 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.uuid, e.target.value)}
                              disabled={updating === order.uuid}
                              className="text-xs bg-surface-container-low border-none rounded-lg px-2 py-1 text-on-surface-variant focus:ring-1 focus:ring-primary/20"
                            >
                              {ORDER_STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {data && (
                <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{data.totalElements} total orders</span>
                  <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
