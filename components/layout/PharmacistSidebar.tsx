'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/pharmacist/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/pharmacist/inventory', icon: 'inventory_2', label: 'Inventory' },
  { href: '/pharmacist/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/pharmacist/analytics', icon: 'bar_chart', label: 'Analytics' },
];

export default function PharmacistSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
      <div className="p-8">
        <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
        <p className="text-xs text-outline font-label uppercase tracking-widest">Pharmacist Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-all hover:translate-x-1 duration-200',
                active
                  ? 'text-primary font-semibold border-r-4 border-primary bg-primary-fixed/30'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              )}>
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
            <span className="text-xs font-bold text-tertiary">On Duty</span>
          </div>
          <p className="text-[10px] text-on-surface-variant">Clinical review queue active</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-outline">PHARMACIST</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide">
          <span className="material-symbols-outlined text-sm">logout</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}
