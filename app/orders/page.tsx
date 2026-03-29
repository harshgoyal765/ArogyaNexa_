'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer } from '@/components/ui/Toast';
import { ordersService } from '@/lib/services/orders.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderResponse } from '@/types/order';
import type { PagedResponse } from '@/types/api';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [data, setData] = useState<PagedResponse<OrderResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    ordersService.list({ page, size: 10 })
      .then(({ data: res }) => setData(res.data))
      .catch(() => setData({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true }))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-headline text-5xl md:text-6xl text-primary font-medium tracking-tight mb-4">Your Order History</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
            Review your past medical requisitions, track active shipments, and manage routine prescription refills with clinical precision.
          </p>

          {/* Filter tabs */}
          {!loading && data && data.content.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              {['All Orders', 'Pending', 'Delivered'].map((filter, i) => (
                <button
                  key={filter}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-colors ${
                    i === 0
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : !data || data.content.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <Package size={64} className="mx-auto text-outline-variant" />
              <h3 className="font-headline text-2xl text-primary">No orders yet</h3>
              <p className="text-on-surface-variant text-sm">Start shopping to see your orders here.</p>
              <Link href="/products" className="btn-primary inline-flex mt-4">Browse Medicines</Link>
            </div>
          ) : (
            <div className="space-y-8 mt-12">
              {data.content.map((order) => (
                <div key={order.uuid} className="bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-white transition-all duration-500 shadow-[0_4px_24px_-12px_rgba(0,65,130,0.06)] border border-transparent hover:border-outline-variant/15">
                  <div className="flex flex-col gap-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <OrderStatusBadge status={order.status} />
                      <span className="text-primary font-headline text-2xl">{order.orderNumber}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8 gap-2 text-on-surface-variant text-sm">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="flex items-center gap-2 font-medium text-primary">
                        <span className="material-symbols-outlined text-lg">payments</span>
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
                      {order.items.map((i) => i.productName).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link
                      href={`/orders/${order.uuid}`}
                      className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-md font-medium text-sm transition-transform active:scale-95 shadow-lg shadow-primary/10 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
              <div className="mt-16 flex justify-center">
                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} className="mt-8" />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
