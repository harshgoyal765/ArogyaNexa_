'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { ordersService, productsService, staticService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';
import type { OrderResponse } from '@/types/order';
import type { AdminMetrics } from '@/types/mockData';
import { 
  ProfileHeaderSkeleton, 
  MetricCardSkeleton, 
  ChartSkeleton, 
  TableSkeleton,
  DashboardCardSkeleton 
} from '@/components/ui/LoadingSpinner';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { href: '/admin/users', icon: 'group', label: 'Users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { href: '/admin/payments', icon: 'payments', label: 'Payments', roles: ['ADMIN', 'SUPER_ADMIN'] },
];

const BAR_HEIGHTS = [40, 60, 55, 85, 70, 45, 95];
const BAR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN" blockSuperAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [metricsData, setMetricsData] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    Promise.all([
      ordersService.list({ page: 0, size: 5 })
        .then(({ data }) => {
          const orders = data.data.content;
          setRecentOrders(orders);
          setPendingOrders(orders.filter(o => o.status === 'PENDING_PRESCRIPTION' || o.status === 'CREATED').length);
        })
        .catch(() => {
          setRecentOrders([]);
          setPendingOrders(0);
        }),
      productsService.list({ page: 0, size: 1 })
        .then(({ data }) => setTotalProducts(data.data.totalElements))
        .catch(() => setTotalProducts(0)),
      staticService.getAdminMetrics()
        .then(({ data }) => setMetricsData(data.data))
        .catch(() => setMetricsData(null))
    ]).finally(() => setLoading(false));
  }, []);

  // Mini sparkline canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const w = canvas.width, h = canvas.height;
    const pts = [20, 35, 28, 50, 42, 38, 60].map((v, i) => ({ x: (i / 6) * w, y: h - (v / 60) * h }));
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#004182';
    ctx.lineWidth = 2;
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0,65,130,0.15)');
    grad.addColorStop(1, 'rgba(0,65,130,0)');
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }, []);

  const metrics = [
    { icon: 'payments', label: 'Total Sales (Daily)', value: `₹${metricsData?.totalSalesDaily.toLocaleString('en-IN') ?? '0'}`, badge: '+12.5%', badgeColor: 'bg-tertiary-fixed text-tertiary' },
    { icon: 'shopping_cart', label: 'Active Orders', value: String(pendingOrders || metricsData?.activeOrders || 0), badge: 'Stable', badgeColor: 'bg-surface-container text-outline' },
    { icon: 'medical_services', label: 'Pending Review', value: String(metricsData?.pendingPrescriptions ?? 0), badge: 'Action Required', badgeColor: 'bg-error-container text-error' },
    { icon: 'warning', label: 'Stock Alerts', value: `${metricsData?.stockAlerts ?? 0} Items`, badge: `${metricsData?.stockAlertsCritical ?? 0} Critical`, badgeColor: 'bg-amber-100 text-amber-700' },
  ];

  if (loading) {
    return (
      <>
        <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
        <div className="ml-64 min-h-screen bg-surface">
          <header className="sticky top-0 z-30 flex justify-between items-center px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
            <div className="relative max-w-md w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="w-full bg-surface-container-low border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 outline-none" placeholder="Search prescriptions, orders, patients..." />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/notifications" className="relative p-2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Notifications">
                <span className="material-symbols-outlined">notifications</span>
              </Link>
              <Link href="/admin/profile" className="p-2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Profile">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            </div>
          </header>
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            <ProfileHeaderSkeleton />
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2"><ChartSkeleton /></div>
              <div className="space-y-6">
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
              </div>
            </section>
            <TableSkeleton rows={5} columns={5} />
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex justify-between items-center px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 outline-none" placeholder="Search prescriptions, orders, patients..." />
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/notifications"
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-white" />
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

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome */}
          <section className="flex justify-between items-end">
            <div>
              <h2 className="font-headline text-4xl text-primary mb-1">Admin Dashboard</h2>
              <p className="text-on-surface-variant italic">Here is what&apos;s happening at ArogyaNexa today.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-medium hover:bg-surface-container transition-colors">Download Report</button>
              <Link href="/admin/products" className="btn-primary text-sm py-2.5 px-5 rounded-xl">+ New Product</Link>
            </div>
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary-fixed/30 rounded-lg text-primary">
                    <span className="material-symbols-outlined">{m.icon}</span>
                  </div>
                  <span className={`text-xs font-label px-2 py-1 rounded-full ${m.badgeColor}`}>{m.badge}</span>
                </div>
                <p className="section-label mb-1">{m.label}</p>
                <h3 className="text-2xl font-headline font-bold text-on-surface">{m.value}</h3>
              </div>
            ))}
          </section>

          {/* Charts + Inventory */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 card p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-headline text-2xl text-on-surface">Revenue Growth</h4>
                  <p className="text-sm text-on-surface-variant">Weekly performance analysis</p>
                </div>
                <select className="text-xs bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-on-surface-variant">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-48 flex items-end gap-3 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0,1,2,3].map(i => <div key={i} className="border-t border-surface-container-high w-full" />)}
                </div>
                {BAR_HEIGHTS.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 ${i === 6 ? 'clinical-gradient' : 'bg-primary/20'}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-label text-outline uppercase tracking-widest">
                {BAR_DAYS.map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            {/* Inventory + Queue */}
            <div className="space-y-6">
              <div className="card p-6">
                <h4 className="font-headline text-xl mb-4">Inventory Health</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Amoxicillin 500mg', stock: '8 units', color: 'text-error' },
                    { name: 'Albuterol Inhaler', stock: '14 units', color: 'text-amber-600' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-outline-variant text-xl">medication</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
                        <p className={`text-xs font-medium ${item.color}`}>{item.stock} remaining</p>
                      </div>
                      <button className="p-1.5 text-primary hover:bg-primary-fixed/30 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                      </button>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-outline-variant/10">
                    <Link href="/admin/products" className="block text-center text-sm text-primary hover:underline py-1">View All Low Stock</Link>
                  </div>
                </div>
              </div>

              <div className="clinical-gradient text-white p-6 rounded-xl shadow-primary-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-lg font-medium mb-1">Prescription Queue</h4>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold">28</span>
                    <span className="text-white/70 text-sm">Waiting for sign-off</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mb-4">
                    <div className="bg-secondary-container h-full w-[65%] rounded-full" />
                  </div>
                  <Link href="/pharmacist/prescriptions" className="block w-full py-2.5 bg-white text-primary rounded-lg font-semibold text-sm text-center hover:bg-primary-fixed transition-colors">
                    Open Clinical Review
                  </Link>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container rounded-full opacity-50 blur-2xl" />
              </div>
            </div>
          </section>

          {/* Recent Orders Table */}
          <section className="card overflow-hidden">
            <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/10">
              <h4 className="font-headline text-2xl text-on-surface">Recent Activity</h4>
              <div className="flex gap-4">
                <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">View All Orders</Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Order ID', 'Customer', 'Status', 'Payment', 'Total'].map(h => (
                      <th key={h} className="px-6 py-3 section-label text-[10px] font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <tr key={order.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{order.orderNumber}</td>
                      <td className="px-6 py-4 font-medium text-on-surface">{order.shippingAddress.name}</td>
                      <td className="px-6 py-4">
                        <span className={`badge text-xs ${order.status === 'DELIVERED' ? 'bg-tertiary-fixed/50 text-tertiary' : order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant italic">{order.paymentMethod || 'Razorpay'}</td>
                      <td className="px-6 py-4 font-semibold text-on-surface">{formatCurrency(order.totalAmount)}</td>
                    </tr>
                  )) : (
                    // Demo rows
                    [
                      { id: '#WA-92834', name: 'Eleanor Fitzroy', status: 'Processing', payment: 'Insurance', total: '₹14,250' },
                      { id: '#WA-92833', name: 'Julian Vane', status: 'Shipped', payment: 'Visa ••4412', total: '₹8,900' },
                      { id: '#WA-92832', name: 'Sarah Miller', status: 'Delivered', payment: 'UPI', total: '₹2,415' },
                    ].map(row => (
                      <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{row.id}</td>
                        <td className="px-6 py-4 font-medium text-on-surface">{row.name}</td>
                        <td className="px-6 py-4">
                          <span className={`badge text-xs ${row.status === 'Delivered' ? 'bg-tertiary-fixed/50 text-tertiary' : row.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-secondary-container/30 text-secondary'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant italic">{row.payment}</td>
                        <td className="px-6 py-4 font-semibold text-on-surface">{row.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
