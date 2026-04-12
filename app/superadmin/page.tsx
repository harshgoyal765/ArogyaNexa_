'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import CreateAdminModal from '@/components/superadmin/CreateAdminModal';
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
  { href: '/superadmin', icon: 'dashboard', label: 'System Monitor' },
  { href: '/superadmin/api-health', icon: 'api', label: 'API Health' },
  { href: '/superadmin/logs', icon: 'description', label: 'System Logs' },
  { href: '/superadmin/admins', icon: 'admin_panel_settings', label: 'Admin Management' },
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
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          <Link 
            href="/superadmin/notifications"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <Link 
            href="/superadmin/profile"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Profile"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex flex-col pt-20 pb-4 h-screen w-64 border-r border-slate-100 bg-slate-50 z-40">
        <div className="px-6 mb-8">
          <p className="section-label text-[10px] text-primary/60 mb-1">System Administration</p>
          <h2 className="font-headline text-lg text-primary leading-tight">Developer Portal</h2>
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
            <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">System Health Monitor</h1>
            <p className="text-on-surface-variant max-w-lg leading-relaxed text-sm">
              Developer-level system monitoring dashboard. Monitor API health, server metrics, and system logs. No business data access.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary text-sm">Export Report</button>
            <button className="btn-primary text-sm">System Refresh</button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* API Health Status */}
          <section className="col-span-8 row-span-2 card p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="section-label text-[10px] text-secondary">API Monitoring</span>
                <h3 className="font-headline text-2xl text-primary">Endpoint Health Status</h3>
              </div>
              <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
                {['1H', '24H', '7D'].map((t, i) => (
                  <button key={t} className={cn('px-4 py-1.5 text-xs font-bold rounded-md transition-colors', i === 0 ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-primary')}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { endpoint: '/api/v1/auth/*', status: 'Healthy', uptime: '99.98%', avgResponse: '45ms', color: 'bg-tertiary' },
                { endpoint: '/api/v1/products/*', status: 'Healthy', uptime: '99.95%', avgResponse: '120ms', color: 'bg-tertiary' },
                { endpoint: '/api/v1/orders/*', status: 'Healthy', uptime: '99.92%', avgResponse: '180ms', color: 'bg-tertiary' },
                { endpoint: '/api/v1/prescriptions/*', status: 'Degraded', uptime: '98.50%', avgResponse: '450ms', color: 'bg-amber-400' },
                { endpoint: '/api/v1/payments/*', status: 'Healthy', uptime: '99.99%', avgResponse: '90ms', color: 'bg-tertiary' },
              ].map(api => (
                <div key={api.endpoint} className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${api.color}`} />
                      <code className="text-sm font-mono text-on-surface">{api.endpoint}</code>
                    </div>
                    <span className={`badge text-[10px] ${api.status === 'Healthy' ? 'bg-tertiary-fixed text-tertiary' : 'bg-amber-100 text-amber-800'}`}>
                      {api.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-outline">Uptime</p>
                      <p className="font-bold text-on-surface">{api.uptime}</p>
                    </div>
                    <div>
                      <p className="text-outline">Avg Response</p>
                      <p className="font-bold text-on-surface">{api.avgResponse}</p>
                    </div>
                    <div>
                      <p className="text-outline">Last Check</p>
                      <p className="font-bold text-on-surface">2m ago</p>
                    </div>
                  </div>
                </div>
              ))}
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

          {/* Database Metrics */}
          <section className="col-span-4 card p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-full">storage</span>
              <h3 className="font-headline text-2xl text-primary">Database</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-6">
              {[
                { label: 'Connections', value: '42/100', icon: 'link' },
                { label: 'Query Time', value: '12ms', icon: 'speed' },
                { label: 'Cache Hit', value: '94.2%', icon: 'memory' },
              ].map(metric => (
                <div key={metric.label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{metric.icon}</span>
                    <span className="text-sm text-on-surface-variant">{metric.label}</span>
                  </div>
                  <span className="font-headline text-xl text-primary">{metric.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Admin Management */}
          <section className="col-span-12 card p-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-md">
                <span className="section-label text-[10px] text-primary-container mb-2 block">Admin User Management</span>
                <h3 className="font-headline text-3xl text-primary mb-4">Create & Manage Admins</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">As SuperAdmin, you can create Admin users who will manage the ArogyaNexa platform. You cannot access business data.</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="group flex flex-col p-6 rounded-xl bg-surface-container-low hover:bg-white hover:shadow-primary-md transition-all border border-transparent hover:border-outline-variant/15 text-left"
                >
                  <span className="material-symbols-outlined mb-4 text-primary group-hover:scale-110 transition-transform text-3xl">person_add</span>
                  <span className="font-headline text-lg text-primary">Create Admin</span>
                  <span className="section-label text-[10px] mt-1">Add new platform admin</span>
                  <span className="mt-4 text-xs font-bold text-secondary">Create →</span>
                </button>
                <Link 
                  href="/superadmin/admins"
                  className="group flex flex-col p-6 rounded-xl bg-surface-container-low hover:bg-white hover:shadow-primary-md transition-all border border-transparent hover:border-outline-variant/15 text-left"
                >
                  <span className="material-symbols-outlined mb-4 text-primary group-hover:scale-110 transition-transform text-3xl">manage_accounts</span>
                  <span className="font-headline text-lg text-primary">View Admins</span>
                  <span className="section-label text-[10px] mt-1">List of all admin users</span>
                  <span className="mt-4 text-xs font-bold text-secondary">View →</span>
                </Link>
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

      <CreateAdminModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ToastContainer />
    </div>
  );
}
