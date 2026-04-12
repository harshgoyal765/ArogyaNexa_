'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { formatDate } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

interface AdminProfileData {
  organization?: string;
  department?: string;
  employeeId?: string;
  joinedDate?: string;
  permissions?: string[];
  managedUsers?: number;
  activeProjects?: number;
  lastActivity?: string;
  bio?: string;
  officeLocation?: string;
  workingHours?: string;
}

export default function AdminProfilePage() {
  return (
    <ProtectedRoute requiredRole="ADMIN" blockSuperAdmin={true}>
      <AdminProfileContent />
    </ProtectedRoute>
  );
}

function AdminProfileContent() {
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);
  const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/adminProfile.json')
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(() => setProfileData(null))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Admin Profile</h1>
            <p className="text-xs text-on-surface-variant">Manage your account settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/admin/profile"
              className="p-2 text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="md:col-span-7 space-y-6">
              {/* Personal Information */}
              <section className="card p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-full clinical-gradient flex items-center justify-center text-white text-3xl font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-semibold text-primary">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-on-surface-variant">Platform Administrator</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', value: user.firstName },
                    { label: 'Last Name', value: user.lastName },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone || 'Not set' },
                    { label: 'Employee ID', value: profileData?.employeeId || 'Not set' },
                    { label: 'Department', value: profileData?.department || 'Not set' },
                    { label: 'Office Location', value: profileData?.officeLocation || 'Not set' },
                    { label: 'Joined Date', value: profileData?.joinedDate ? formatDate(profileData.joinedDate) : 'N/A' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="section-label text-[10px]">{field.label}</label>
                      <p className="font-body text-on-surface mt-1">{field.value}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => showToast('Edit functionality coming soon', 'info')}
                  className="mt-6 btn-secondary text-sm"
                >
                  Edit Information
                </button>
              </section>

              {/* Permissions */}
              <section className="card p-8">
                <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Permissions & Access</h2>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData?.permissions?.map(permission => (
                      <span key={permission} className="badge bg-primary-fixed text-primary">
                        {permission}
                      </span>
                    )) || <span className="text-on-surface-variant text-sm">No permissions loaded</span>}
                  </div>
                </div>
              </section>

              {/* Bio */}
              {profileData?.bio && (
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-4">About</h2>
                  <p className="text-on-surface-variant leading-relaxed">{profileData.bio}</p>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="md:col-span-5 space-y-6">
              {/* Statistics */}
              <section className="card p-8">
                <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Statistics</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Managed Users', value: profileData?.managedUsers || 0, icon: 'group' },
                    { label: 'Active Projects', value: profileData?.activeProjects || 0, icon: 'work' },
                    { label: 'Working Hours', value: profileData?.workingHours || 'Not set', icon: 'schedule' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                        <span className="text-sm text-on-surface-variant">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-on-surface">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Account Status */}
              <section className="card p-8">
                <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Account Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Email Verified</span>
                    <span className={`badge ${user.emailVerified ? 'bg-tertiary-fixed text-tertiary' : 'bg-error-container text-error'}`}>
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">2FA Enabled</span>
                    <span className={`badge ${user.mfaEnabled ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container text-outline'}`}>
                      {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Role</span>
                    <span className="badge bg-primary-fixed text-primary">{user.roles[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Last Activity</span>
                    <span className="text-sm text-on-surface">
                      {profileData?.lastActivity ? formatDate(profileData.lastActivity) : 'N/A'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="card p-8">
                <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/admin/products" className="btn-secondary text-sm w-full">
                    <span className="material-symbols-outlined text-sm">inventory_2</span>
                    Manage Products
                  </Link>
                  <Link href="/admin/orders" className="btn-secondary text-sm w-full">
                    <span className="material-symbols-outlined text-sm">receipt_long</span>
                    View Orders
                  </Link>
                  <Link href="/admin/users" className="btn-secondary text-sm w-full">
                    <span className="material-symbols-outlined text-sm">group</span>
                    Manage Users
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
