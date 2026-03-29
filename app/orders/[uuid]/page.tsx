'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Package, MapPin, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer } from '@/components/ui/Toast';
import { ordersService } from '@/lib/services/orders.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderResponse } from '@/types/order';

const STATUS_STEPS = ['CREATED', 'APPROVED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <ProtectedRoute>
        <OrderDetailContent />
      </ProtectedRoute>
    </Suspense>
  );
}

function OrderDetailContent() {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid) return;
    ordersService.getById(uuid)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [uuid, router]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back */}
          <button onClick={() => router.push('/orders')} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6">
            <ChevronLeft size={16} /> Back to Orders
          </button>

          {/* Payment banner */}
          {paymentStatus === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-tertiary-fixed/20 rounded-xl border border-tertiary/20 mb-6">
              <CheckCircle size={20} className="text-tertiary" />
              <p className="text-sm font-medium text-on-surface">Payment successful! Your order is confirmed.</p>
            </div>
          )}
          {paymentStatus === 'failed' && (
            <div className="flex items-center gap-3 p-4 bg-error-container/20 rounded-xl border border-error/20 mb-6">
              <XCircle size={20} className="text-error" />
              <p className="text-sm font-medium text-on-surface">Payment failed. Please try again or contact support.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h1 className="font-headline text-2xl text-primary">{order.orderNumber}</h1>
                    <p className="text-xs text-on-surface-variant mt-1">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} className="text-sm px-3 py-1.5" />
                </div>

                {/* Progress tracker - vertical timeline matching HTML reference */}
                {order.status !== 'CANCELLED' && (
                  <div className="mt-8">
                    <h3 className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-6">Order Journey</h3>
                    <div className="relative">
                      <div className="absolute left-6 top-0 h-full w-px bg-outline-variant/30 z-0" />
                      <div className="space-y-8">
                        {STATUS_STEPS.map((step, i) => {
                          const done = i < currentStep;
                          const active = i === currentStep;
                          return (
                            <div key={step} className="relative flex items-start gap-6 z-10">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                done ? 'bg-tertiary text-white' : active ? 'bg-primary-container text-white shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant/40'
                              }`}>
                                {done ? <CheckCircle size={20} /> : <span className="text-xs font-bold">{i + 1}</span>}
                              </div>
                              <div className="pt-2">
                                <h4 className={`font-bold text-sm ${active ? 'text-primary' : done ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                                  {step.replace(/_/g, ' ')}
                                </h4>
                                {active && (
                                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-secondary-container rounded-full text-xs font-bold text-secondary">
                                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                    LIVE TRACKING ACTIVE
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="card p-6">
                <h2 className="font-headline text-lg text-primary mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.uuid} className="flex items-center gap-4 py-3 border-b border-surface-container-high last:border-0">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-outline-variant" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-on-surface-variant">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <span className="font-semibold text-on-surface text-sm flex-shrink-0">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-2 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-tertiary">
                      <span>Discount</span><span>-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span><span>{order.shippingAmount > 0 ? formatCurrency(order.shippingAmount) : 'Free'}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-on-surface text-base pt-2 border-t border-outline-variant/20">
                    <span>Total</span>
                    <span className="text-primary font-headline text-xl">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-headline text-base text-primary mb-3 flex items-center gap-2"><MapPin size={16} /> Shipping Address</h3>
                <div className="text-sm text-on-surface-variant space-y-1">
                  <p className="font-medium text-on-surface">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-headline text-base text-primary mb-3">Status History</h3>
                <div className="space-y-3">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                        {i < order.statusHistory.length - 1 && <div className="w-px flex-1 bg-outline-variant/30 mt-1" />}
                      </div>
                      <div className="pb-3">
                        <p className="font-medium text-on-surface">{h.toStatus.replace(/_/g, ' ')}</p>
                        <p className="text-on-surface-variant">{formatDate(h.createdAt)}</p>
                        {h.reason && <p className="text-outline italic">{h.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
