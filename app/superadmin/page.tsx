'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { staticService } from '@/lib/services/static.service';
import type { PlatformEvent } from '@/types/mockData';

// Source: stitch/stitch/superadmin_dashboard/code.html
// Replace MOCK_PLATFORM_EVENTS with: GET /api/v1/admin/platform-events when audit log API is ready

const NAV_ITEMS = [
  { href: '/superadmin', icon: 'dashboard', label: 'Dashboard' },
  { href: '/pharmacist/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/pharmacist/prescriptions', icon: 'medical_services', label: 'Clinical Review' },
  { href: '/admin/orders', icon: 'local_shipping', label: 'Logistics' },
  { href: '/admin/crm', icon: 'groups', label: 'CRM' },
  { href: '/admin/content', icon: 'edit_note', label: 'Content' },
  { href: '/admin/users', icon: 'settings', label: 'Settings' },
];

export default function SuperAdminPage() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <SuperAdminContent />
    </ProtectedRoute>
  );
}

function SuperAdminContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [platformEvents, setPlatformEvents] = useState<PlatformEvent[]>([]);

  useEffect(() => {
    staticService
      .getPlatformEvents()
      .then(({ data }) => setPlatformEvents(data.data))
      .catch(() => setPlatformEvents([]));
  }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm shadow-primary/5 flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-8">
          <span className="font-headline italic text-2xl text-primary">ArogyaNexa</span>
          <nav className="hidden md:flex gap-6">
            {['Global Overview', 'Marketplaces', 'Financials'].map((item, i) => (
              <span key={item} className={cn('font-body text-sm tracking-tight', i === 0 ? 'text-primary font-semibold' : 'text-on-surface-variant')}>{item}</span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-surface-container-low rounded-full px-4 py-1.5">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-40 ml-2 outline-none" placeholder="Global search..." />
          </div>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex flex-col pt-20 pb-4 h-screen w-64 border-r border-slate-100 bg-slate-50 z-40">
        <div className="px-6 mb-8">
          <p className="section-label text-[10px] text-primary/60 mb-1">Operational Excellence</p>
          <h2 className="font-headline text-lg text-primary leading-tight">ArogyaNexa</h2>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-xs font-label uppercase tracking-wide transition-all hover:translate-x-1 duration-200',
                  active ? 'bg-white text-primary font-bold border-r-4 border-primary' : 'text-on-surface-variant hover:bg-slate-100'
                )}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-auto pt-4 border-t border-slate-100">
          <div className="bg-tertiary/10 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-xs font-bold text-tertiary">System Status: Active</span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-tight">All global API endpoints performing within expected latency bounds.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-sm">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 pt-24 px-10 pb-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">Platform Pulse</h1>
            <p className="text-on-surface-variant max-w-lg leading-relaxed text-sm">
              Global oversight for ArogyaNexa infrastructure. Review real-time revenue distributions, server-side health metrics, and strategic growth trajectory.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary text-sm">Export Report</button>
            <button className="btn-primary text-sm">System Refresh</button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Revenue Map */}
          <section className="col-span-8 row-span-2 card p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="section-label text-[10px] text-secondary">Revenue Density</span>
                <h3 className="font-headline text-2xl text-primary">Multi-Region Transactions</h3>
              </div>
              <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
                {['24H', '7D', '30D'].map((t, i) => (
                  <button key={t} className={cn('px-4 py-1.5 text-xs font-bold rounded-md transition-colors', i === 0 ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-primary')}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl relative overflow-hidden min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <span className="material-symbols-outlined text-8xl text-primary/20">public</span>
                <p className="text-on-surface-variant text-sm">Global Revenue Map</p>
              </div>
              <div className="absolute bottom-6 left-6 flex flex-col gap-3">
                {[
                  { region: 'India', value: '₹4.2Cr', growth: '↑ 12%' },
                  { region: 'APAC', value: '₹2.8Cr', growth: '↑ 8%' },
                ].map(r => (
                  <div key={r.region} className="glass-card p-4 rounded-xl border border-outline-variant/10 shadow-primary-sm">
                    <p className="section-label text-[10px]">{r.region}</p>
                    <p className="font-headline text-xl text-primary">{r.value} <span className="text-xs text-tertiary font-bold">{r.growth}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* System Health */}
          <section className="col-span-4 card p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary/10 rounded-full">query_stats</span>
              <h3 className="font-headline text-2xl text-primary">System Health</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'API Gateway', value: '99.98%', width: '99%', color: 'bg-tertiary' },
                { label: 'Server Load', value: '42% Avg', width: '42%', color: 'bg-primary' },
                { label: 'DB Response', value: '12ms', width: '85%', color: 'bg-secondary' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-surface-container-low">
                  <div className="flex justify-between items-center mb-2">
                    <span className="section-label text-[10px]">{item.label}</span>
                    <span className="text-xs font-bold text-primary">{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* User Growth */}
          <section className="col-span-4 card p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-full">person_add</span>
              <h3 className="font-headline text-2xl text-primary">User Growth</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center">
              <p className="font-headline text-4xl text-primary mb-1">12,84,592</p>
              <p className="section-label text-[10px] mb-8">Active Global Users</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container rounded-xl">
                  <p className="section-label text-[10px]">Monthly</p>
                  <p className="font-headline text-xl text-primary">+12.4k</p>
                </div>
                <div className="p-4 bg-surface-container rounded-xl">
                  <p className="section-label text-[10px]">Retention</p>
                  <p className="font-headline text-xl text-secondary">84%</p>
                </div>
              </div>
            </div>
          </section>

          {/* Governance */}
          <section className="col-span-12 card p-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-md">
                <span className="section-label text-[10px] text-primary-container mb-2 block">Administrative Control</span>
                <h3 className="font-headline text-3xl text-primary mb-4">Governance &amp; Roles</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">Modify permission clusters, audit access logs, and manage high-level administrator hierarchies.</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                {[
                  { icon: 'verified_user', title: 'Admin Matrix', sub: 'Manage Permissions', href: '/admin/users' },
                  { icon: 'policy', title: 'Security Audit', sub: 'Review Access Logs', href: '/admin/users' },
                  { icon: 'add_moderator', title: 'New Role', sub: 'Configure Policy', href: '/admin/users' },
                ].map(item => (
                  <Link key={item.title} href={item.href} className="group flex flex-col p-6 rounded-xl bg-surface-container-low hover:bg-white hover:shadow-primary-md transition-all border border-transparent hover:border-outline-variant/15 text-left">
                    <span className="material-symbols-outlined mb-4 text-primary group-hover:scale-110 transition-transform text-3xl">{item.icon}</span>
                    <span className="font-headline text-lg text-primary">{item.title}</span>
                    <span className="section-label text-[10px] mt-1">{item.sub}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Platform Events */}
        <footer className="mt-12">
          <h4 className="section-label text-[10px] mb-6">Recent Platform Events</h4>
          <div className="space-y-3">
            {platformEvents.map(event => (
              <div key={event.title} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${event.color}`} />
                  <div>
                    <p className="text-sm font-bold text-on-surface">{event.title}</p>
                    <p className="text-xs text-on-surface-variant">{event.desc}</p>
                  </div>
                </div>
                <span className="section-label text-[10px]">{event.time}</span>
              </div>
            ))}
          </div>
        </footer>
      </main>
      <ToastContainer />
    </div>
  );
}
