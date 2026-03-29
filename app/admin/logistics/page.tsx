'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { staticService } from '@/lib/services';
import type { ShipmentException } from '@/types/mockData';

// Source: stitch/stitch/logistics_shipping_dashboard/code.html
// Replace MOCK_SHIPMENT_EXCEPTIONS with: GET /api/v1/shipments?status=EXCEPTION&page=0&size=10

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/pharmacist/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/admin/logistics', icon: 'local_shipping', label: 'Logistics' },
  { href: '/admin/crm', icon: 'groups', label: 'CRM' },
];

// Replace with: GET /api/v1/shipments?status=EXCEPTION&page=0&size=10

const CARRIERS = [
  { code: 'FD', name: 'FedEx Health', reliability: '98.2%', ok: true },
  { code: 'DH', name: 'DHL Express', reliability: '94.1%', ok: true },
  { code: 'UP', name: 'UPS Clinical', reliability: '91.5%', ok: false },
];

export default function LogisticsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <LogisticsContent />
    </ProtectedRoute>
  );
}

function LogisticsContent() {
  const [activeShipments, setActiveShipments] = useState(1428);
  const [exceptions, setExceptions] = useState<ShipmentException[]>([]);

  useEffect(() => {
    staticService.getShipmentStats()
      .then(({ data }) => {
        if (data.data?.totalShipments) setActiveShipments(data.data.totalShipments);
      })
      .catch(() => {});

    staticService.getShipmentExceptions()
      .then(({ data }) => setExceptions(data.data))
      .catch(() => setExceptions([]));
  }, []);

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Operational Excellence" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <span className="font-headline italic text-2xl text-primary">ArogyaNexa</span>
          <div className="hidden md:flex gap-8 items-center text-on-surface-variant text-sm">
            <span className="text-primary font-semibold cursor-pointer">Logistics</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Inventory</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Analytics</span>
          </div>
        </header>

        <main className="px-8 py-10 pb-12">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="section-label text-[10px] text-primary mb-2 block font-semibold">Fulfillment Overview</span>
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">Global Logistics Command</h1>
              <p className="mt-4 text-on-surface-variant text-lg leading-relaxed max-w-xl">
                Precision monitoring of domestic and international transit. Managing the delicate flow of medical-grade goods with clinical exactness.
              </p>
            </div>
            <button className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">add</span> Dispatch New Parcel
            </button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="md:col-span-2 card p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <p className="section-label text-[10px] mb-1">Global Delivery Success</p>
                <h3 className="font-headline text-4xl text-primary">99.4%</h3>
                <div className="mt-4 flex items-center gap-2 bg-tertiary-fixed/30 text-tertiary w-fit px-2 py-1 rounded-full text-xs font-semibold">
                  <span className="material-symbols-outlined text-xs">trending_up</span> +0.2% from last month
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'wght' 100" }}>verified</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
              <p className="section-label text-[10px] mb-1">Active Shipments</p>
              <h3 className="font-headline text-3xl text-on-surface">{activeShipments.toLocaleString()}</h3>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">In Transit</span>
                  <span className="font-bold">1,204</span>
                </div>
                <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
              <p className="section-label text-[10px] mb-1">Avg. Delivery Time</p>
              <h3 className="font-headline text-3xl text-on-surface">1.8 Days</h3>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Last Mile Speed</span>
                  <span className="font-bold text-secondary">Optimal</span>
                </div>
                <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[92%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Map + Carriers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 card overflow-hidden relative h-[380px]">
              <div className="absolute top-6 left-6 z-10 glass-card p-4 rounded-lg shadow-primary-sm border border-outline-variant/10">
                <h4 className="font-headline text-lg leading-tight text-on-surface">Live Transit Network</h4>
                <p className="text-xs text-on-surface-variant">Real-time carrier distribution</p>
              </div>
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-[120px] text-primary/10">public</span>
              </div>
              <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,65,130,0.5)]" />
              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,105,112,0.5)]" />
            </div>

            <div className="card p-8">
              <h4 className="font-headline text-xl mb-6 text-on-surface">Carrier Scorecard</h4>
              <div className="space-y-6">
                {CARRIERS.map((c) => (
                  <div key={c.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center font-bold text-on-surface-variant text-sm">{c.code}</div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{c.name}</p>
                        <p className="section-label text-[10px]">{c.reliability} Reliable</p>
                      </div>
                    </div>
                    {c.ok ? (
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <span className="badge bg-error-container/20 text-error text-[10px]">MONITOR</span>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 border border-outline-variant/30 text-xs font-semibold uppercase tracking-widest hover:bg-surface-container-low transition-colors rounded-lg">
                Compare All Carriers
              </button>
            </div>
          </div>

          {/* Action Required */}
          <section className="card overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/5 flex justify-between items-center bg-surface-container-low/50">
              <h3 className="font-headline text-2xl text-on-surface">Action Required</h3>
              <span className="badge bg-error text-white text-[10px]">4 CRITICAL DELAYS</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="section-label text-[10px] border-b border-outline-variant/5">
                    {['Tracking ID', 'Destination', 'Status', 'Issue', 'Actions'].map(h => (
                      <th key={h} className="px-8 py-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {exceptions.map((ex) => (
                    <tr key={ex.trackingId} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-8 py-5 font-mono text-xs text-primary">{ex.trackingId}</td>
                      <td className="px-8 py-5">
                        <p className="font-medium text-on-surface">{ex.destination}</p>
                        <p className="text-[10px] text-outline">{ex.facility}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-1 text-xs font-semibold ${ex.status === 'STALLED' ? 'text-error' : ex.status === 'TEMP BREACH' ? 'text-amber-600' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-xs">warning</span> {ex.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-on-surface-variant text-xs">{ex.issue}</td>
                      <td className="px-8 py-5">
                        <button className="text-primary font-semibold text-xs underline underline-offset-4 hover:text-primary-container">{ex.action}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-surface-container-low/30 text-center">
              <button className="section-label text-[10px] text-primary hover:underline">View all 12 exceptions</button>
            </div>
          </section>
        </main>
      </div>
      <ToastContainer />
    </>
  );
}
