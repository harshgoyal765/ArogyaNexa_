'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { ordersService } from '@/lib/services/orders.service';
import { staticService } from '@/lib/services/static.service';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { OrderResponse } from '@/types/order';
import { 
  ProfileHeaderSkeleton, 
  WellnessScoreSkeleton, 
  DashboardCardSkeleton, 
  ArticleCardSkeleton 
} from '@/components/ui/LoadingSpinner';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/products', icon: 'medication', label: 'Products' },
  { href: '/orders', icon: 'receipt_long', label: 'My Orders' },
  { href: '/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/appointments', icon: 'calendar_month', label: 'Book Appointment' },
  { href: '/support', icon: 'support_agent', label: 'Support' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute>
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}

function PatientDashboardContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(s => s.auth);
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock appointments data
  const upcomingAppointments = [
    { id: 'APT-001', doctor: 'Dr. Sarah Thorne', specialization: 'Internal Medicine', date: '2024-10-28', time: '10:00 AM', status: 'Confirmed', type: 'Consultation' },
    { id: 'APT-002', doctor: 'Dr. Rajesh Kumar', specialization: 'Cardiology', date: '2024-11-05', time: '02:00 PM', status: 'Pending', type: 'Follow-up' },
  ];

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  useEffect(() => {
    Promise.all([
      ordersService.list({ page: 0, size: 3 })
        .then(({ data }) => setRecentOrders(data.data.content))
        .catch(() => setRecentOrders([])),
      staticService.getWellness()
        .then(({ data }) => setWellnessScore(data.data.score))
        .catch(() => setWellnessScore(0))
    ]).finally(() => setLoading(false));
  }, []);

  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (wellnessScore / 100) * circumference;

  const metrics = [
    { label: 'Activity', value: 'High', color: 'text-primary' },
    { label: 'Nutrition', value: 'Optimal', color: 'text-primary' },
    { label: 'Sleep', value: 'Improving', color: 'text-primary' },
  ];

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
          <div className="p-8">
            <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
            <p className="text-xs text-outline font-label uppercase tracking-widest">Patient Portal</p>
          </div>
        </aside>
        <div className="ml-64 flex-1 min-h-screen">
          <div className="p-8">
            <ProfileHeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8">
                <WellnessScoreSkeleton />
              </div>
              <div className="md:col-span-4">
                <DashboardCardSkeleton />
              </div>
              <div className="md:col-span-5">
                <DashboardCardSkeleton />
              </div>
              <div className="md:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ArticleCardSkeleton />
                  <ArticleCardSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
        <div className="p-8">
          <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
          <p className="text-xs text-outline font-label uppercase tracking-widest">Patient Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-all hover:translate-x-1 duration-200',
                  active ? 'text-primary font-semibold border-r-4 border-primary bg-primary-fixed/30' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                )}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-outline">PATIENT</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-sm">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/profile" 
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="font-headline text-3xl text-primary mb-2">
              Good morning, {user?.firstName || 'there'}.
            </h2>
            <p className="text-on-surface-variant max-w-2xl">
              Your personal health overview. We&apos;ve curated these insights to help you maintain your momentum this week.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Upcoming Appointments */}
            <div className="md:col-span-12 card p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-headline text-2xl text-primary">Upcoming Appointments</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Your scheduled doctor consultations</p>
                </div>
                <Link href="/appointments" className="btn-primary text-sm">
                  <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                  Book New Appointment
                </Link>
              </div>
              
              {upcomingAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="bg-surface-container-low rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full clinical-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                            {apt.doctor.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-on-surface mb-1">{apt.doctor}</h3>
                            <p className="text-sm text-primary">{apt.specialization}</p>
                            <span className={cn('badge text-xs mt-2 inline-block', 
                              apt.status === 'Confirmed' ? 'bg-tertiary-fixed text-tertiary' : 'bg-amber-100 text-amber-800'
                            )}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                          <span className="text-on-surface-variant">{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                          <span className="text-on-surface-variant">{apt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">medical_services</span>
                          <span className="text-on-surface-variant">{apt.type}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                        <button className="flex-1 btn-secondary text-xs">
                          <span className="material-symbols-outlined text-xs">event_busy</span>
                          Reschedule
                        </button>
                        <button className="flex-1 btn-secondary text-xs text-error border-error">
                          <span className="material-symbols-outlined text-xs">cancel</span>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">event_available</span>
                  <p className="text-on-surface-variant mb-4">No upcoming appointments</p>
                  <Link href="/appointments" className="btn-primary text-sm inline-flex">
                    <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                    Book Your First Appointment
                  </Link>
                </div>
              )}
            </div>

            {/* Wellness Score */}
            <div className="md:col-span-8 card p-8 flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                  <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-surface-container-high" />
                  <circle
                    cx="96" cy="96" r="88" fill="transparent"
                    stroke="currentColor" strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-primary-container transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-4xl font-bold text-primary">{wellnessScore}</span>
                  <span className="section-label text-[10px]">Wellness Score</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-2xl text-primary mb-4">You&apos;re doing excellent.</h2>
                <p className="text-on-surface-variant mb-6 leading-relaxed text-sm">
                  Your activity levels have increased by 14% this week. Clinical markers suggest consistent improvement in sleep quality since your last consult.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {metrics.map(m => (
                    <div key={m.label} className="bg-surface-container-low p-3 rounded-xl">
                      <span className="text-xs text-on-surface-variant block mb-1">{m.label}</span>
                      <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prescription Refills */}
            <div className="md:col-span-4 clinical-gradient text-white rounded-xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-3xl mb-4 block">pill</span>
                <h3 className="font-headline text-2xl mb-6">Prescription Refills</h3>
                <div className="space-y-5">
                  {[
                    { name: 'Lisinopril 10mg', days: '5 days remaining', urgent: true },
                    { name: 'Vitamin D3 2000IU', days: '12 days remaining', urgent: false },
                  ].map(rx => (
                    <div key={rx.name} className={`flex justify-between items-start ${rx.urgent ? 'border-b border-white/20 pb-4' : 'opacity-70'}`}>
                      <div>
                        <p className="font-medium text-sm">{rx.name}</p>
                        <p className="text-xs text-white/70">{rx.days}</p>
                      </div>
                      {rx.urgent ? (
                        <Link href="/products" className="bg-white text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-primary-fixed transition-colors">Refill</Link>
                      ) : (
                        <span className="text-[10px] uppercase border border-white/30 px-2 py-1 rounded">Auto-ship</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Recent Orders */}
            <div className="md:col-span-5 card p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-xl text-primary">Recent Orders</h3>
                <Link href="/orders" className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? recentOrders.map(order => (
                  <Link key={order.uuid} href={`/orders/${order.uuid}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-lg">receipt_long</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{order.orderNumber}</p>
                      <p className="text-xs text-on-surface-variant">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="font-semibold text-primary text-sm flex-shrink-0">{formatCurrency(order.totalAmount)}</span>
                  </Link>
                )) : (
                  // Demo consultations
                  [
                    { icon: 'check', bg: 'bg-tertiary-fixed', color: 'text-tertiary', status: 'Completed • Oct 24', title: 'Quarterly Wellness Review', doctor: 'Dr. Sarah Al-Farsi' },
                    { icon: 'calendar_today', bg: 'bg-surface-container-high', color: 'text-on-surface-variant', status: 'Upcoming • Nov 12', title: 'Nutrition Therapy Session', doctor: 'Clinical Nutritionist: Mark Wey' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`material-symbols-outlined ${item.color} text-xl`}>{item.icon}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold ${item.color} mb-1 block`}>{item.status}</span>
                        <p className="font-semibold text-on-surface text-sm">{item.title}</p>
                        <p className="text-xs text-on-surface-variant">{item.doctor}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Curated Articles */}
            <div className="md:col-span-7 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <h3 className="font-headline text-xl text-primary mb-6">Articles for Your Health Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { category: 'Nutrition', title: 'Optimizing magnesium intake for sleep quality', time: '4 min read' },
                  { category: 'Science', title: 'The role of Lisinopril in vascular health', time: '6 min read' },
                ].map(article => (
                  <Link key={article.title} href="/wellness" className="card overflow-hidden group hover:-translate-y-0.5 transition-transform">
                    <div className="h-28 bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:scale-110 transition-transform duration-500">article</span>
                    </div>
                    <div className="p-4">
                      <span className="section-label text-[10px] text-primary">{article.category}</span>
                      <h4 className="font-headline text-base mt-1 mb-2 line-clamp-2 text-on-surface">{article.title}</h4>
                      <p className="text-xs text-on-surface-variant">{article.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 bg-secondary-container/20 rounded-xl p-5 flex items-center justify-between border border-secondary-container/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-secondary-container text-sm">Personalized Care Path</p>
                    <p className="text-xs text-on-secondary-container/80">Update your health goals for more precise content.</p>
                  </div>
                </div>
                <Link href="/profile" className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0">Update Goals</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
