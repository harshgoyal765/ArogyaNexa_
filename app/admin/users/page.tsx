'use client';
import { useEffect, useState } from 'react';
import { Search, Shield } from 'lucide-react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';
import { staticService } from '@/lib/services/static.service';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { UserProfileResponse } from '@/types/auth';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminUsersContent />
    </ProtectedRoute>
  );
}

function AdminUsersContent() {
  const [data, setData] = useState<PagedResponse<UserProfileResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);

    async function loadUsers() {
      try {
        const { data: res } = await api.get<ApiResponse<PagedResponse<UserProfileResponse>>>('/api/v1/users', {
          params: { page, size: 15, search: search || undefined },
        });
        setData(res.data);
      } catch {
        try {
          const { data: res } = await staticService.getUsers({ page, size: 15, search: search || undefined });
          const users = res.data;
          setData({
            content: users,
            page,
            size: 15,
            totalElements: users.length,
            totalPages: Math.ceil(users.length / 15),
            last: true,
          });
        } catch {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [page, search]);

  const handleRoleChange = async (uuid: string, role: string) => {
    try {
      await api.post(`/api/v1/users/${uuid}/roles`, { role });
      showToast('Role updated successfully', 'success');
    } catch {
      showToast('Failed to update role', 'error');
    }
  };

  // Demo users for when API isn't connected — now sourced through the shared static service
  const users = data?.content ?? [];

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <h1 className="font-headline text-2xl text-primary">User Management</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-64"
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['User', 'Email', 'Roles', 'Verified', 'MFA', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {users.map((user) => (
                      <tr key={user.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <span className="font-medium text-on-surface">{user.firstName} {user.lastName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-on-surface-variant">{user.email}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map(r => (
                              <span key={r} className="badge bg-primary-fixed text-primary text-[10px]">{r}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {user.emailVerified
                            ? <span className="text-tertiary flex items-center gap-1"><Shield size={14} /> Yes</span>
                            : <span className="text-outline text-xs">No</span>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge ${user.mfaEnabled ? 'bg-tertiary-fixed/50 text-tertiary' : 'bg-surface-container text-outline'}`}>
                            {user.mfaEnabled ? 'On' : 'Off'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-on-surface-variant text-xs">{formatDate(user.createdAt)}</td>
                        <td className="px-5 py-4">
                          <select
                            defaultValue={user.roles[0]}
                            onChange={(e) => handleRoleChange(user.uuid, e.target.value)}
                            className="text-xs bg-surface-container-low border-none rounded-lg px-2 py-1 text-on-surface-variant"
                          >
                            {['CUSTOMER', 'PHARMACIST', 'ADMIN', 'SUPER_ADMIN'].map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
