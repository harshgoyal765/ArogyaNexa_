'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';

const NAV_ITEMS = [
  { href: '/admin/content', icon: 'edit_note', label: 'Content Hub' },
  { href: '/wellness', icon: 'spa', label: 'Wellness Articles' },
];

export default function ContentProfilePage() {
  return (
    <ProtectedRoute requiredRole={['CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN']}>
      <ContentProfileContent />
    </ProtectedRoute>
  );
}

function ContentProfileContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'settings'>('profile');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const handleSave = () => {
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
        <div className="p-8">
          <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
          <p className="text-xs text-outline font-label uppercase tracking-widest">Content Portal</p>
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
              <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-outline">CONTENT EDITOR</p>
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
            <h1 className="font-headline text-2xl text-primary">My Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/content/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/content/profile"
              className="p-2 text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="card p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full clinical-gradient flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-3xl text-primary mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-on-surface-variant mb-4">Content Editor & Writer</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
                    <span className="text-on-surface-variant">Content Creator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">email</span>
                    <span className="text-on-surface-variant">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                    <span className="text-on-surface-variant">Joined Oct 2023</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Articles Published', value: '47', icon: 'article', color: 'text-primary' },
              { label: 'Total Views', value: '124.8k', icon: 'visibility', color: 'text-tertiary' },
              { label: 'Avg. SEO Score', value: '8.9/10', icon: 'trending_up', color: 'text-secondary' },
              { label: 'Engagement Rate', value: '12.4%', icon: 'thumb_up', color: 'text-tertiary' },
            ].map(stat => (
              <div key={stat.label} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                  <span className="section-label text-[10px]">{stat.label}</span>
                </div>
                <div className="font-headline text-3xl text-primary">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-outline-variant/20">
            {[
              { id: 'profile', label: 'Profile Information', icon: 'person' },
              { id: 'portfolio', label: 'Portfolio', icon: 'work' },
              { id: 'settings', label: 'Settings', icon: 'settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2',
                  activeTab === tab.id 
                    ? 'text-primary border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                )}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="card p-8">
              <h3 className="font-headline text-2xl text-primary mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="section-label text-[10px] block mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Specialization</label>
                  <input
                    type="text"
                    defaultValue="Health & Wellness Writing"
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="section-label text-[10px] block mb-2">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="Passionate content creator specializing in health, wellness, and medical topics. Experienced in creating engaging, SEO-optimized content that educates and inspires readers."
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleSave} className="btn-primary text-sm">
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="card p-8">
                <h3 className="font-headline text-2xl text-primary mb-6">Recent Articles</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Therapeutic Benefits of Ashwagandha in Cortisol Management', views: '12.4k', date: '2024-10-20', status: 'Published' },
                    { title: 'Understanding the Microbiome: A 2024 Perspective', views: '8.9k', date: '2024-10-18', status: 'Published' },
                    { title: 'Seasonal Nutrients: Preparing for the Winter Shift', views: '15.2k', date: '2024-10-15', status: 'Published' },
                    { title: 'Mental Vitality & Focus: Natural Approaches', views: '0', date: '2024-10-24', status: 'Draft' },
                  ].map((article, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-on-surface mb-1">{article.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            {article.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {article.date}
                          </span>
                        </div>
                      </div>
                      <span className={cn('badge text-xs', 
                        article.status === 'Published' ? 'bg-tertiary-fixed text-tertiary' : 'bg-amber-100 text-amber-800'
                      )}>
                        {article.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-8">
              <h3 className="font-headline text-2xl text-primary mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-on-surface mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Email notifications for article reviews', checked: true },
                      { label: 'Push notifications for comments', checked: true },
                      { label: 'Weekly performance summary', checked: false },
                      { label: 'SEO score updates', checked: true },
                    ].map((pref) => (
                      <label key={pref.label} className="flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={pref.checked}
                          className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-on-surface">{pref.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/20">
                  <h4 className="font-semibold text-on-surface mb-4">Security</h4>
                  <div className="space-y-3">
                    <button className="btn-secondary text-sm w-full justify-start">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Change Password
                    </button>
                    <button className="btn-secondary text-sm w-full justify-start">
                      <span className="material-symbols-outlined text-sm">security</span>
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/20">
                  <h4 className="font-semibold text-error mb-4">Danger Zone</h4>
                  <button className="btn-secondary text-sm text-error border-error hover:bg-error-container">
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
