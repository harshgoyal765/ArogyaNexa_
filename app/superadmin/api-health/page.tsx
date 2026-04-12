'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/superadmin', icon: 'dashboard', label: 'System Monitor' },
  { href: '/superadmin/api-health', icon: 'api', label: 'API Health' },
  { href: '/superadmin/logs', icon: 'description', label: 'System Logs' },
  { href: '/superadmin/admins', icon: 'admin_panel_settings', label: 'Admin Management' },
];

interface APIEndpoint {
  endpoint: string;
  method: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  uptime: string;
  avgResponse: string;
  requests24h: number;
  errors24h: number;
  lastCheck: string;
}

export default function APIHealthPage() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <APIHealthContent />
    </ProtectedRoute>
  );
}

function APIHealthContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    { endpoint: '/api/v1/auth/login', method: 'POST', status: 'Healthy', uptime: '99.98%', avgResponse: '45ms', requests24h: 12450, errors24h: 2, lastCheck: '30s ago' },
    { endpoint: '/api/v1/auth/register', method: 'POST', status: 'Healthy', uptime: '99.95%', avgResponse: '120ms', requests24h: 3200, errors24h: 5, lastCheck: '30s ago' },
    { endpoint: '/api/v1/products', method: 'GET', status: 'Healthy', uptime: '99.92%', avgResponse: '180ms', requests24h: 45600, errors24h: 12, lastCheck: '30s ago' },
    { endpoint: '/api/v1/products/:id', method: 'GET', status: 'Healthy', uptime: '99.90%', avgResponse: '95ms', requests24h: 28900, errors24h: 8, lastCheck: '30s ago' },
    { endpoint: '/api/v1/orders', method: 'GET', status: 'Healthy', uptime: '99.88%', avgResponse: '220ms', requests24h: 18700, errors24h: 15, lastCheck: '30s ago' },
    { endpoint: '/api/v1/orders', method: 'POST', status: 'Healthy', uptime: '99.85%', avgResponse: '340ms', requests24h: 5600, errors24h: 18, lastCheck: '30s ago' },
    { endpoint: '/api/v1/prescriptions', method: 'GET', status: 'Degraded', uptime: '98.50%', avgResponse: '450ms', requests24h: 8900, errors24h: 125, lastCheck: '30s ago' },
    { endpoint: '/api/v1/prescriptions/verify', method: 'POST', status: 'Degraded', uptime: '98.20%', avgResponse: '520ms', requests24h: 3400, errors24h: 89, lastCheck: '30s ago' },
    { endpoint: '/api/v1/payments/create', method: 'POST', status: 'Healthy', uptime: '99.99%', avgResponse: '90ms', requests24h: 4200, errors24h: 1, lastCheck: '30s ago' },
    { endpoint: '/api/v1/cart', method: 'GET', status: 'Healthy', uptime: '99.94%', avgResponse: '65ms', requests24h: 32100, errors24h: 8, lastCheck: '30s ago' },
  ]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-tertiary';
      case 'Degraded': return 'bg-amber-400';
      case 'Down': return 'bg-error';
      default: return 'bg-outline';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-tertiary-fixed text-tertiary';
      case 'Degraded': return 'bg-amber-100 text-amber-800';
      case 'Down': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-outline';
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm shadow-primary/5 flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-8">
          <span className="font-headline italic text-2xl text-primary">ArogyaNexa</span>
        </div>
        <div className="flex items-center gap-3">
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
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-sm">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 pt-24 px-10 pb-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">API Health Monitor</h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed text-sm">
            Real-time monitoring of all API endpoints. Track uptime, response times, error rates, and request volumes.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Endpoints', value: endpoints.length, icon: 'api', color: 'text-primary' },
            { label: 'Healthy', value: endpoints.filter(e => e.status === 'Healthy').length, icon: 'check_circle', color: 'text-tertiary' },
            { label: 'Degraded', value: endpoints.filter(e => e.status === 'Degraded').length, icon: 'warning', color: 'text-amber-600' },
            { label: 'Down', value: endpoints.filter(e => e.status === 'Down').length, icon: 'error', color: 'text-error' },
          ].map(metric => (
            <div key={metric.label} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`material-symbols-outlined ${metric.color}`}>{metric.icon}</span>
                <span className="section-label text-[10px]">{metric.label}</span>
              </div>
              <div className="font-headline text-4xl text-primary">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Endpoints Table */}
        <div className="card overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10">
            <h2 className="font-headline text-2xl text-primary">All API Endpoints</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Endpoint', 'Method', 'Status', 'Uptime', 'Avg Response', 'Requests (24h)', 'Errors (24h)', 'Last Check'].map(h => (
                    <th key={h} className="px-6 py-4 section-label text-[10px] font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {endpoints.map((endpoint, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-on-surface">{endpoint.endpoint}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge bg-surface-container text-on-surface-variant text-xs">{endpoint.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(endpoint.status)}`} />
                        <span className={`badge text-xs ${getStatusBadge(endpoint.status)}`}>{endpoint.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-on-surface">{endpoint.uptime}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{endpoint.avgResponse}</td>
                    <td className="px-6 py-4 text-on-surface">{endpoint.requests24h.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={endpoint.errors24h > 50 ? 'text-error font-semibold' : 'text-on-surface-variant'}>
                        {endpoint.errors24h}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-outline">{endpoint.lastCheck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
