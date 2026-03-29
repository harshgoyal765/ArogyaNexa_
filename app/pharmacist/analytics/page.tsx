'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import PharmacistSidebar from '@/components/layout/PharmacistSidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { ordersService, prescriptionsService, staticService } from '@/lib/services';
import type { LowStockItem } from '@/types/mockData';
import type { PrescriptionItem } from '@/lib/services/articles.service';
import type { OrderResponse } from '@/types/order';

// Replace all MOCK_* with real API calls when backend is running:
// GET /api/v1/prescriptions/stats, GET /api/v1/orders/stats, GET /api/v1/products/stock-summary

export default function PharmacistAnalyticsPage() {
  return (
    <ProtectedRoute requiredRole={['PHARMACIST', 'ADMIN', 'SUPER_ADMIN']}>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}

function AnalyticsContent() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  useEffect(() => {
    Promise.allSettled([
      prescriptionsService.list(),
      ordersService.list({ page: 0, size: 100 }),
      staticService.getLowStock(),
    ]).then(([presRes, ordersRes, stockRes]) => {
      if (presRes.status === 'fulfilled') {
        setPrescriptions(presRes.value.data.data);
      } else {
        setPrescriptions([]);
      }
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data.data.content);
      } else {
        setOrders([]);
      }
      if (stockRes.status === 'fulfilled') {
        setLowStock(stockRes.value.data.data);
      } else {
        setLowStock([]);
      }
    });

  }, []);

  const totalRx = prescriptions.length;
  const approvedRx = prescriptions.filter(p => p.status === 'APPROVED').length;
  const rejectedRx = prescriptions.filter(p => p.status === 'REJECTED').length;
  const pendingRx = prescriptions.filter(p => p.status === 'PENDING').length;
  const approvalRate = totalRx > 0 ? Math.round((approvedRx / totalRx) * 100) : 0;

  const totalOrders = orders.length;
  const rxOrders = orders.filter(o => o.requiresPrescription).length;
  const verifiedOrders = orders.filter(o => o.prescriptionVerified).length;

  const criticalStock = lowStock.filter(s => s.level === 'critical').length;
  const warningStock = lowStock.filter(s => s.level === 'warning').length;

  const weeklyData = [
    { day: 'Mon', approved: 8, rejected: 1 },
    { day: 'Tue', approved: 12, rejected: 2 },
    { day: 'Wed', approved: 6, rejected: 0 },
    { day: 'Thu', approved: 15, rejected: 3 },
    { day: 'Fri', approved: 10, rejected: 1 },
    { day: 'Sat', approved: 4, rejected: 0 },
    { day: 'Sun', approved: 2, rejected: 0 },
  ];
  const maxVal = Math.max(...weeklyData.map(d => d.approved + d.rejected));

  return (
    <div className="bg-surface min-h-screen flex">
      <PharmacistSidebar />
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Analytics</h1>
            <p className="text-xs text-on-surface-variant">Dispensing performance &amp; clinical metrics</p>
          </div>
          <span className="badge bg-surface-container text-on-surface-variant text-xs">Demo Data</span>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Approval Rate', value: `${approvalRate}%`, icon: 'verified', color: 'text-tertiary', bg: 'bg-tertiary-fixed/30', sub: `${approvedRx} of ${totalRx} reviewed` },
              { label: 'Pending Queue', value: pendingRx, icon: 'pending_actions', color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Awaiting review' },
              { label: 'Rx Orders Verified', value: `${verifiedOrders}/${rxOrders}`, icon: 'fact_check', color: 'text-primary', bg: 'bg-primary-fixed/30', sub: 'Prescription orders' },
              { label: 'Critical Stock', value: criticalStock, icon: 'warning', color: 'text-error', bg: 'bg-error-container/30', sub: `${warningStock} at warning level` },
            ].map((kpi) => (
              <div key={kpi.label} className="card p-6">
                <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined ${kpi.color}`}>{kpi.icon}</span>
                </div>
                <p className="section-label text-[10px] mb-1">{kpi.label}</p>
                <p className="font-headline text-3xl text-on-surface">{kpi.value}</p>
                <p className="text-[10px] text-outline mt-1">{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly chart */}
            <div className="lg:col-span-2 card p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-xl text-primary">Weekly Prescription Activity</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Approved vs Rejected — last 7 days</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-tertiary inline-block" />Approved</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-error inline-block" />Rejected</span>
                </div>
              </div>
              <div className="flex items-end gap-3 h-48">
                {weeklyData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-0.5" style={{ height: '100%' }}>
                      <div className="flex-1 flex flex-col justify-end gap-0.5">
                        {d.rejected > 0 && (
                          <div className="w-full bg-error/40 rounded-t-sm" style={{ height: `${(d.rejected / maxVal) * 100}%`, minHeight: '4px' }} />
                        )}
                        <div className="w-full bg-tertiary rounded-t-sm" style={{ height: `${(d.approved / maxVal) * 100}%`, minHeight: '8px' }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-outline uppercase">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription breakdown */}
            <div className="card p-8">
              <h3 className="font-headline text-xl text-primary mb-6">Rx Breakdown</h3>
              <div className="space-y-5">
                {[
                  { label: 'Approved', value: approvedRx, total: totalRx, color: 'bg-tertiary' },
                  { label: 'Pending', value: pendingRx, total: totalRx, color: 'bg-amber-400' },
                  { label: 'Rejected', value: rejectedRx, total: totalRx, color: 'bg-error' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-on-surface">{item.label}</span>
                      <span className="text-sm font-bold text-on-surface">{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${totalRx > 0 ? (item.value / totalRx) * 100 : 0}%` }} />
                    </div>
                    <p className="text-[10px] text-outline mt-1">{totalRx > 0 ? Math.round((item.value / totalRx) * 100) : 0}% of total</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <h4 className="section-label text-[10px] mb-4">Avg. Review Time</h4>
                <div className="flex items-end gap-2">
                  <span className="font-headline text-4xl text-primary">4.2</span>
                  <span className="text-on-surface-variant text-sm mb-1">min / prescription</span>
                </div>
                <p className="text-[10px] text-tertiary mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_down</span>
                  12% faster than last week
                </p>
              </div>
            </div>
          </div>

          {/* Stock health */}
          <div className="card p-8">
            <h3 className="font-headline text-xl text-primary mb-6">Inventory Health Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStock.map((item) => (
                <div key={item.name} className="bg-surface-container-low rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                    <span className={`badge text-[10px] ${
                      item.level === 'critical' ? 'bg-error-container text-error' :
                      item.level === 'warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-tertiary-fixed/50 text-tertiary'
                    }`}>{item.level.toUpperCase()}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${
                      item.level === 'critical' ? 'bg-error' :
                      item.level === 'warning' ? 'bg-amber-400' : 'bg-tertiary'
                    }`} style={{ width: `${Math.min((item.remaining / 100) * 100, 100)}%` }} />
                  </div>
                  <p className="text-xs text-on-surface-variant">{item.remaining} units remaining</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
