'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import CreateAdminModal from '@/components/superadmin/CreateAdminModal';
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

interface AdminUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin: string;
}

export default function AdminManagementPage() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <AdminManagementContent />
    </ProtectedRoute>
  );
}

function AdminManagementContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([
    { uuid: 'usr-004', firstName: 'Aris', lastName: 'Thorne', email: 'aris.thorne@arogyanexa.com', role: 'ADMIN', status: 'Active', createdAt: '2024-01-02', lastLogin: '2024-10-24 08:30' },
    { uuid: 'usr-005', firstName: 'Maya', lastName: 'Patel', email: 'maya.patel@arogyanexa.com', role: 'ADMIN', status: 'Active', createdAt: '2024-02-15', lastLogin: '2024-10-23 16:45' },
    { uuid: 'usr-006', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@arogyanexa.com', role: 'ADMIN', status: 'Inactive', createdAt: '2024-03-10', lastLogin: '2024-09-15 10:20' },
  ]);

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
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">Admin Management</h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed text-sm">
              Create and manage admin users who will have access to the ArogyaNexa platform. SuperAdmins can only create Admins, not access business data.
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-sm"
          >
            <span className="material-symbols-outlined text-sm">person_add</span> Create Admin
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Admins', value: admins.length, icon: 'group', color: 'text-primary' },
            { label: 'Active', value: admins.filter(a => a.status === 'Active').length, icon: 'check_circle', color: 'text-tertiary' },
            { label: 'Inactive', value: admins.filter(a => a.status === 'Inactive').length, icon: 'cancel', color: 'text-outline' },
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

        {/* Admins Table */}
        <div className="card overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10">
            <h2 className="font-headline text-2xl text-primary">All Admin Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Created', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 section-label text-[10px] font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {admins.map((admin) => (
                  <tr key={admin.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full clinical-gradient flex items-center justify-center text-white text-sm font-bold">
                          {admin.firstName[0]}{admin.lastName[0]}
                        </div>
                        <span className="font-medium text-on-surface">{admin.firstName} {admin.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className="badge bg-primary-fixed text-primary text-xs">{admin.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${admin.status === 'Active' ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container text-outline'}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{admin.createdAt}</td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{admin.lastLogin}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => showToast('Edit functionality coming soon', 'info')}
                        className="text-primary hover:text-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateAdminModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Optionally refresh the admin list here
        }}
      />

      <ToastContainer />
    </div>
  );
}
