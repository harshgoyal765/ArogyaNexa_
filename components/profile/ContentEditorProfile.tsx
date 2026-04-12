'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { formatDate, cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/profile', icon: 'person_outline', label: 'Profile' },
  { href: '/admin/content', icon: 'dashboard', label: 'Dashboard' },
  { href: '/wellness', icon: 'article', label: 'Articles' },
  { href: '/profile/security', icon: 'shield', label: 'Security' },
  { href: '/notifications', icon: 'notifications_none', label: 'Notifications' },
];

interface ContentEditorProfileData {
  designation?: string;
  department?: string;
  contentDomains?: string[];
  assignedSections?: string[];
  education?: Array<{ degree: string; institution: string; year: string }>;
  articlesPublished?: number;
  articlesInDraft?: number;
  averageReadTime?: string;
  totalReaders?: number;
  languages?: string[];
  expertise?: string[];
  bio?: string;
  joinedDate?: string;
  lastActivity?: string;
  workingHours?: string;
}

export default function ContentEditorProfile() {
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);
  const [profileData, setProfileData] = useState<ContentEditorProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/contentEditorProfile.json')
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(() => setProfileData(null))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16 bg-surface">
        {/* Sidebar */}
        <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col border-r border-slate-100 hidden lg:flex">
          <div className="px-8 mb-8">
            <h2 className="font-headline italic text-primary text-lg">Content Editor</h2>
            <p className="section-label text-[11px] mt-1">Content & Marketing</p>
          </div>
          <nav className="flex-1 space-y-1">
            {SIDEBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 pl-4 py-3 text-sm transition-all group',
                  pathname === link.href
                    ? 'text-primary font-semibold border-l-4 border-primary bg-white/50'
                    : 'text-on-surface-variant hover:bg-slate-100 hover:translate-x-1 duration-300'
                )}
              >
                <span className="material-symbols-outlined text-lg" style={pathname === link.href ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 px-8 py-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <p className="section-label text-[10px] text-secondary mb-2">Content Editor Profile</p>
              <h1 className="text-4xl font-headline font-bold text-primary leading-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-on-surface-variant">
                {profileData?.designation || 'Content Editor'}
              </p>
            </header>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="md:col-span-7 space-y-6">
                {/* Personal Information */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: user.firstName },
                      { label: 'Last Name', value: user.lastName },
                      { label: 'Email', value: user.email },
                      { label: 'Phone', value: user.phone || 'Not set' },
                      { label: 'Designation', value: profileData?.designation || 'Not set' },
                      { label: 'Department', value: profileData?.department || 'Not set' },
                      { label: 'Working Hours', value: profileData?.workingHours || 'Not set' },
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

                {/* Content Domains & Sections */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Content Areas</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-on-surface mb-3">Content Domains</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.contentDomains?.map(domain => (
                          <span key={domain} className="badge bg-primary-fixed text-primary">{domain}</span>
                        )) || <span className="text-on-surface-variant text-sm">No domains assigned</span>}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface mb-3">Assigned Sections</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.assignedSections?.map(section => (
                          <span key={section} className="badge bg-tertiary-fixed text-tertiary">{section}</span>
                        )) || <span className="text-on-surface-variant text-sm">No sections assigned</span>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Education */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Education</h2>
                  <div className="space-y-4">
                    {profileData?.education?.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-surface-container-low rounded-lg">
                        <h3 className="font-semibold text-on-surface">{edu.degree}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">{edu.institution}</p>
                        <p className="text-xs text-secondary mt-1">Graduated: {edu.year}</p>
                      </div>
                    )) || <span className="text-on-surface-variant text-sm">No education data available</span>}
                  </div>
                </section>

                {/* Expertise */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.expertise?.map(skill => (
                      <span key={skill} className="badge bg-amber-100 text-amber-800">{skill}</span>
                    )) || <span className="text-on-surface-variant text-sm">No expertise listed</span>}
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
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Content Stats</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Articles Published', value: profileData?.articlesPublished || 0, icon: 'article' },
                      { label: 'Articles in Draft', value: profileData?.articlesInDraft || 0, icon: 'draft' },
                      { label: 'Total Readers', value: profileData?.totalReaders?.toLocaleString() || '0', icon: 'visibility' },
                      { label: 'Avg Read Time', value: profileData?.averageReadTime || 'N/A', icon: 'schedule' },
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

                {/* Languages */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.languages?.map(lang => (
                      <span key={lang} className="badge bg-primary-fixed text-primary">{lang}</span>
                    )) || <span className="text-on-surface-variant text-sm">No languages specified</span>}
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
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
