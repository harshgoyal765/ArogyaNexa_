'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Heart, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { getUnreadNotificationCount } from '@/lib/dataLoader';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isAdmin, isPharmacist, isDoctor, isSuperAdmin, isContentEditor } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.cart?.itemCount ?? 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/products', label: 'Medicines' },
    { href: '/wellness', label: 'Wellness' },
    { href: '/ai-assistant', label: 'AI Assistant' },
    { href: '/dashboard', label: 'My Health' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled ? 'glass-nav shadow-primary-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg clinical-gradient flex items-center justify-center shadow-primary-sm">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              <span className="font-headline text-xl font-semibold text-primary tracking-tight">
                ArogyaNexa
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-body text-sm font-medium transition-colors duration-200',
                    pathname === link.href
                      ? 'text-primary border-b-2 border-primary pb-0.5'
                      : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isPharmacist && !isSuperAdmin && (
                <Link href="/pharmacist/prescriptions" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                  Pharmacist
                </Link>
              )}
              {isDoctor && !isSuperAdmin && (
                <Link href="/doctor" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                  Doctor Portal
                </Link>
              )}
              {isAdmin && !isSuperAdmin && (
                <Link href="/admin/dashboard" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              {isSuperAdmin && (
                <Link href="/superadmin" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                  System Monitor
                </Link>
              )}
              {isContentEditor && !isSuperAdmin && (
                <Link href="/admin/content" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                  Content
                </Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {isAuthenticated && (
                <>
                  <Link
                    href="/notifications"
                    className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all"
                    aria-label="Notifications"
                  >
                    <span className="material-symbols-outlined text-xl">notifications</span>
                    {/* Notification badge - can be enhanced with real unread count */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-white" />
                  </Link>

                  <Link
                    href="/cart"
                    className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all"
                    aria-label="Cart"
                  >
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 clinical-gradient text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-primary-md border border-outline-variant/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b border-outline-variant/10">
                      <p className="text-sm font-medium text-on-surface truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-outline truncate">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors">
                        <User size={16} /> Profile
                      </Link>
                      <Link href="/notifications" className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-base">notifications</span> Notifications
                      </Link>
                      <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors">
                        <Package size={16} /> Orders
                      </Link>
                      <Link href="/prescriptions" className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors">
                        <Heart size={16} /> Prescriptions
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-container/20 rounded-lg transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="btn-ghost text-sm py-2">Sign In</Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                </div>
              )}

              <button
                className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-full transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-nav border-t border-outline-variant/10 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-fixed text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center text-sm">Sign In</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary justify-center text-sm">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-primary-lg p-6">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search size={20} className="text-outline flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, supplements, devices..."
                className="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-outline text-lg"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-outline hover:text-primary">
                <X size={20} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="section-label">Popular:</span>
              {['Paracetamol', 'Vitamin D3', 'Omega-3', 'Insulin'].map((term) => (
                <button
                  key={term}
                  onClick={() => { setSearchQuery(term); }}
                  className="text-xs px-3 py-1 border border-outline-variant rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
