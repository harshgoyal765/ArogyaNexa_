'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  roles?: string[]; // if set, only show for these roles
}

interface AdminSidebarProps {
  title?: string;
  subtitle?: string;
  navItems?: NavItem[];
}

// Default navigation items based on roles
const getDefaultNavItems = (roles: string[]): NavItem[] => {
  const items: NavItem[] = [];

  // Admin and SuperAdmin get full access
  if (roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')) {
    items.push(
      { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
      { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
      { href: '/admin/orders', icon: 'shopping_cart', label: 'Orders' },
      { href: '/admin/users', icon: 'group', label: 'Users' },
      { href: '/admin/payments', icon: 'payments', label: 'Payments' },
      { href: '/admin/content', icon: 'edit_note', label: 'Content' },
      { href: '/admin/crm', icon: 'support_agent', label: 'CRM' },
      { href: '/admin/logistics', icon: 'local_shipping', label: 'Logistics' },
      { href: '/admin/operations', icon: 'settings', label: 'Operations' }
    );
  }
  
  // Content Editor only gets content management
  if (roles.includes('CONTENT_EDITOR') && !roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN')) {
    items.push(
      { href: '/admin/content', icon: 'edit_note', label: 'Content Hub' },
      { href: '/wellness', icon: 'spa', label: 'Wellness Articles' }
    );
  }

  return items;
};

export default function AdminSidebar({ title, subtitle, navItems }: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, roles } = useAuth();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  // Use provided navItems or get default based on role
  const items = navItems || getDefaultNavItems(roles);

  // Filter nav items by role if roles restriction is set
  const visibleItems = items.filter(
    (item) => !item.roles || item.roles.some((r) => roles.includes(r))
  );

  // Determine title and subtitle based on role if not provided
  const displayTitle = title || 'ArogyaNexa';
  const displaySubtitle = subtitle || (
    roles.includes('CONTENT_EDITOR') && !roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN')
      ? 'Content Portal'
      : 'Admin Portal'
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
      <div className="p-8">
        <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">{displayTitle}</Link>
        <p className="text-xs text-outline font-label uppercase tracking-widest">{displaySubtitle}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-all hover:translate-x-1 duration-200',
                active
                  ? 'text-primary font-semibold border-r-4 border-primary bg-primary-fixed/30'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              )}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="bg-tertiary/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs font-bold text-tertiary">System Status: Active</span>
          </div>
          <p className="text-[10px] text-on-surface-variant">All systems operational</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-outline truncate">{user.roles[0]}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}
