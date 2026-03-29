'use client';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';

const NAV_ITEMS = [
  { href: '/admin/operations', icon: 'dashboard', label: 'Dashboard' },
  { href: '/pharmacist/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/pharmacist/prescriptions', icon: 'medical_services', label: 'Clinical Review' },
  { href: '/admin/logistics', icon: 'local_shipping', label: 'Logistics' },
  { href: '/admin/crm', icon: 'groups', label: 'CRM' },
  { href: '/admin/content', icon: 'edit_note', label: 'Content' },
  { href: '/admin/users', icon: 'settings', label: 'Settings' },
];

const METRICS = [
  { icon: 'schedule', label: 'Avg. Fulfillment', value: '14.2 Hours', badge: '+4.2%', badgeColor: 'bg-secondary-container/30 text-secondary', barColor: 'bg-primary', barWidth: '75%' },
  { icon: 'verified', label: 'Order Accuracy', value: '99.8%', badge: 'Optimal', badgeColor: 'bg-tertiary-fixed/40 text-tertiary', barColor: 'bg-tertiary', barWidth: '99%' },
  { icon: 'confirmation_number', label: 'Support Backlog', value: '28 Tickets', badge: 'Action Required', badgeColor: 'bg-error-container/40 text-error', barColor: 'bg-error', barWidth: '25%' },
];

const QUEUE = [
  { id: '#WS-90821', name: 'Adrian Sterling', status: 'Compounding', statusColor: 'bg-primary-fixed text-on-primary-fixed', timer: '02:45:12', timerColor: 'text-outline' },
  { id: '#WS-90818', name: 'Elena Vance', status: 'Clinical Review', statusColor: 'bg-secondary-container text-on-secondary-container', timer: '00:12:05', timerColor: 'text-error' },
  { id: '#WS-90815', name: 'Marcus Thorne', status: 'Ready for Dispatch', statusColor: 'bg-surface-container-high text-on-surface-variant', timer: '04:22:45', timerColor: 'text-outline' },
];

const INVENTORY_ALERTS = [
  { name: 'Sermorelin 9mg', stock: '12 Units', level: 'Low', barWidth: '15%', barColor: 'bg-error', note: 'Reorder point exceeded 3 days ago' },
  { name: 'Vitamin B12 Complex', stock: '45 Units', level: 'Low', barWidth: '25%', barColor: 'bg-error', note: 'High volume forecast for next week' },
  { name: 'Sterile Syringes (G22)', stock: '82 Units', level: 'OK', barWidth: '45%', barColor: 'bg-secondary', note: 'Restock arriving Tuesday' },
];

const SUPPORT_TICKETS = [
  { priority: 'Urgent', priorityColor: 'text-error', time: '12m ago', title: 'Delayed Prescription Delivery - Order #WS-89', excerpt: '"My order was supposed to arrive today but tracking shows it hasn\'t left..."' },
  { priority: 'Shipping', priorityColor: 'text-primary', time: '45m ago', title: 'Address Correction Request', excerpt: '"I accidentally put my old office address for my monthly refill..."' },
];

const REGIONAL_FLOW = [
  { city: 'MUMBAI', pct: 88, color: 'bg-primary/40' },
  { city: 'DELHI', pct: 94, color: 'bg-primary/40' },
  { city: 'BENGALURU', pct: 62, color: 'bg-error/40' },
];

export default function OperationsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <OperationsContent />
    </ProtectedRoute>
  );
}

function OperationsContent() {
  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Operational Excellence" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <span className="font-headline italic text-2xl text-primary">ArogyaNexa</span>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="pl-10 pr-4 py-1.5 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Search orders..." />
          </div>
        </header>

        <main className="px-8 pt-10 pb-12 min-h-screen">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="font-headline text-4xl text-primary mb-2">Operational Command</h1>
              <p className="text-on-surface-variant max-w-lg text-sm">Monitoring real-time logistics, inventory health, and fulfillment precision across all regional hubs.</p>
            </div>
            <button className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">bolt</span> Generate Report
            </button>
          </header>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {METRICS.map((m) => (
              <div key={m.label} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <span className="material-symbols-outlined text-primary">{m.icon}</span>
                  </div>
                  <span className={`badge text-xs ${m.badgeColor}`}>{m.badge}</span>
                </div>
                <p className="section-label text-[10px] mb-1">{m.label}</p>
                <p className="font-headline text-3xl text-primary">{m.value}</p>
                <div className="mt-4 h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${m.barColor}`} style={{ width: m.barWidth }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left: Queue + Trends */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Fulfillment Queue */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-2xl text-on-surface">Fulfillment Queue</h2>
                  <Link href="/admin/orders" className="section-label text-[10px] text-primary border-b-2 border-primary/20 pb-0.5 hover:border-primary transition-all">View All Orders</Link>
                </div>
                <div className="card overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container-low">
                      <tr>
                        {['Order ID', 'Customer', 'Status', 'Timer'].map(h => (
                          <th key={h} className="px-6 py-4 section-label text-[10px] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low">
                      {QUEUE.map((q) => (
                        <tr key={q.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-6 py-5 font-medium text-primary">{q.id}</td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {q.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm text-on-surface">{q.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`badge text-[10px] ${q.statusColor}`}>{q.status}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className={`text-xs font-mono ${q.timerColor}`}>{q.timer}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Performance Trends */}
              <section>
                <h2 className="font-headline text-2xl text-on-surface mb-6">Operational Health Trends</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden h-56 flex flex-col justify-end border border-outline-variant/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="material-symbols-outlined text-[120px]">trending_up</span>
                    </div>
                    <h4 className="section-label text-[10px] mb-2">Efficiency Rating</h4>
                    <div className="font-headline text-5xl text-primary">A+</div>
                    <p className="text-sm mt-3 text-on-surface-variant">The fulfillment center in <span className="font-bold text-primary">Mumbai</span> has exceeded efficiency benchmarks by 12% this week.</p>
                  </div>
                  <div className="clinical-gradient p-8 rounded-xl text-white h-56 flex flex-col justify-between shadow-primary-lg">
                    <div className="flex justify-between items-start">
                      <span className="material-symbols-outlined">inventory</span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">north_east</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="section-label text-[10px] text-white/60 mb-1">Global Stock Liquidity</h4>
                      <div className="font-headline text-3xl">82.4%</div>
                      <div className="mt-3 flex gap-1">
                        {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded ${i === 4 ? 'bg-white' : 'bg-white/20'}`} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Inventory + Support + Regional */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Inventory Alerts */}
              <section className="card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <h2 className="font-headline text-xl text-on-surface">Inventory Alerts</h2>
                </div>
                <div className="space-y-5">
                  {INVENTORY_ALERTS.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-on-surface">{item.name}</span>
                        <span className={`text-xs font-bold uppercase ${item.level === 'Low' ? 'text-error' : 'text-secondary'}`}>{item.level}: {item.stock}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${item.barColor}`} style={{ width: item.barWidth }} />
                      </div>
                      <p className="section-label text-[10px] mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
                <Link href="/admin/products" className="block w-full mt-6 border border-outline-variant text-on-surface-variant py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors text-center">
                  Manage Full Inventory
                </Link>
              </section>

              {/* Support Tickets */}
              <section className="bg-surface-container-low p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-xl text-on-surface">Priority Support</h2>
                  <span className="badge bg-error text-white text-[10px]">3 NEW</span>
                </div>
                <div className="space-y-4">
                  {SUPPORT_TICKETS.map((t) => (
                    <div key={t.title} className="card p-4 hover:shadow-primary-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold uppercase ${t.priorityColor}`}>{t.priority}</span>
                        <span className="text-[10px] text-outline">• {t.time}</span>
                      </div>
                      <p className="text-xs font-bold text-on-surface mb-1 truncate">{t.title}</p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed italic">{t.excerpt}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 text-primary text-xs font-bold uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                  Open Support CRM <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </section>

              {/* Regional Flow */}
              <section className="card p-6">
                <h4 className="font-headline text-lg mb-4 text-on-surface">Regional Logistical Flow</h4>
                <div className="space-y-4">
                  {REGIONAL_FLOW.map((r) => (
                    <div key={r.city} className="flex items-center gap-4">
                      <span className="section-label text-[10px] w-16">{r.city}</span>
                      <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-on-surface">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  );
}
