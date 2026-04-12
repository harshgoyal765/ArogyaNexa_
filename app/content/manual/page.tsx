'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';

const NAV_ITEMS = [
  { href: '/admin/content', icon: 'edit_note', label: 'Content Hub' },
  { href: '/wellness', icon: 'spa', label: 'Wellness Articles' },
];

export default function ContentManualPage() {
  return (
    <ProtectedRoute requiredRole={['CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN']}>
      <ContentManualContent />
    </ProtectedRoute>
  );
}

function ContentManualContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
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

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/content"
              className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              title="Back to Content Hub"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="font-headline text-2xl text-primary">Content Editor Manual</h1>
              <p className="text-xs text-on-surface-variant">Best practices & SEO guidelines</p>
            </div>
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
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <main className="p-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="clinical-gradient rounded-2xl p-12 text-white mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <span className="material-symbols-outlined text-4xl">auto_stories</span>
              </div>
              <h1 className="font-headline text-4xl mb-4">The Content Excellence Manual</h1>
              <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                Your comprehensive guide to creating high-authority wellness content that ranks, converts, and educates.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-primary">trending_up</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">82%</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Avg SEO Score</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-secondary">schedule</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">12 min</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Ideal Read Time</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-tertiary">article</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">2-3</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Articles per Week</p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* SEO Fundamentals */}
            <section className="card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">search</span>
                </div>
                <div>
                  <h2 className="font-headline text-2xl text-primary mb-2">SEO Fundamentals</h2>
                  <p className="text-on-surface-variant">Consistency over volume - the golden rule</p>
                </div>
              </div>
              <div className="space-y-4 pl-16">
                <div className="border-l-4 border-primary/20 pl-6 py-2">
                  <h3 className="font-semibold text-on-surface mb-2">Publishing Frequency</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Aim for 2-3 high-quality articles per week rather than daily low-effort posts. Search engines reward consistent publishing schedules.
                  </p>
                </div>
                <div className="border-l-4 border-primary/20 pl-6 py-2">
                  <h3 className="font-semibold text-on-surface mb-2">Keyword Strategy</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Focus on long-tail keywords (3-5 words) with lower competition. Example: "natural cortisol management supplements" vs "supplements".
                  </p>
                </div>
                <div className="border-l-4 border-primary/20 pl-6 py-2">
                  <h3 className="font-semibold text-on-surface mb-2">Internal Linking</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Include 3-5 internal links per article to related content. This improves site authority and keeps readers engaged longer.
                  </p>
                </div>
              </div>
            </section>

            {/* Content Structure */}
            <section className="card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-2xl">format_list_bulleted</span>
                </div>
                <div>
                  <h2 className="font-headline text-2xl text-primary mb-2">Article Structure</h2>
                  <p className="text-on-surface-variant">The anatomy of a high-performing article</p>
                </div>
              </div>
              <div className="space-y-4 pl-16">
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge bg-primary text-white text-xs">Required</span>
                    <h3 className="font-semibold text-on-surface">Key Takeaways (3 points)</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Start with 3 clear, actionable takeaways. These should be scannable and provide immediate value.
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge bg-primary text-white text-xs">Required</span>
                    <h3 className="font-semibold text-on-surface">Introduction (150-200 words)</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Hook the reader with a problem statement, then preview the solution your article provides.
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge bg-secondary text-white text-xs">Recommended</span>
                    <h3 className="font-semibold text-on-surface">3-4 Content Sections</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Each section should have a clear H2 heading and 300-500 words of valuable content.
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge bg-tertiary text-white text-xs">Optional</span>
                    <h3 className="font-semibold text-on-surface">Featured Quote</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Add a powerful quote to break up text and emphasize key insights.
                  </p>
                </div>
              </div>
            </section>

            {/* Writing Guidelines */}
            <section className="card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-2xl">edit_note</span>
                </div>
                <div>
                  <h2 className="font-headline text-2xl text-primary mb-2">Writing Best Practices</h2>
                  <p className="text-on-surface-variant">Voice, tone, and clinical accuracy</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 pl-16">
                <div>
                  <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                    Do This
                  </h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="text-tertiary mt-1">•</span>
                      <span>Use evidence-based claims with citations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-tertiary mt-1">•</span>
                      <span>Write in second person ("you") for engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-tertiary mt-1">•</span>
                      <span>Include 2 related product recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-tertiary mt-1">•</span>
                      <span>Optimize meta descriptions (150-160 chars)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-tertiary mt-1">•</span>
                      <span>Use short paragraphs (2-3 sentences max)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-sm">cancel</span>
                    Avoid This
                  </h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="text-error mt-1">•</span>
                      <span>Making medical claims without citations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-error mt-1">•</span>
                      <span>Using overly technical jargon</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-error mt-1">•</span>
                      <span>Keyword stuffing or unnatural phrasing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-error mt-1">•</span>
                      <span>Publishing without peer review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-error mt-1">•</span>
                      <span>Copying content from other sources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Workflow */}
            <section className="card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">workflow</span>
                </div>
                <div>
                  <h2 className="font-headline text-2xl text-primary mb-2">Publishing Workflow</h2>
                  <p className="text-on-surface-variant">From draft to live article</p>
                </div>
              </div>
              <div className="pl-16">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-outline-variant/30" />
                  <div className="space-y-8">
                    {[
                      { step: 1, title: 'Draft', desc: 'Write and save your article as draft', icon: 'edit' },
                      { step: 2, title: 'Review', desc: 'Submit for clinical accuracy review', icon: 'rate_review' },
                      { step: 3, title: 'Revise', desc: 'Address feedback and make edits', icon: 'sync' },
                      { step: 4, title: 'Schedule', desc: 'Set publish date and time', icon: 'schedule' },
                      { step: 5, title: 'Publish', desc: 'Article goes live on wellness hub', icon: 'publish' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4 relative">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold z-10 flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1 pt-2">
                          <h3 className="font-semibold text-on-surface mb-1">{item.title}</h3>
                          <p className="text-sm text-on-surface-variant">{item.desc}</p>
                        </div>
                        <span className="material-symbols-outlined text-primary">{item.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Reference */}
            <section className="card p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h2 className="font-headline text-2xl text-primary mb-6">Quick Reference Checklist</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Title is compelling and includes target keyword',
                  'Meta description is 150-160 characters',
                  '3 key takeaways at the start',
                  'Introduction hooks the reader',
                  '3-4 well-structured content sections',
                  'Featured quote for emphasis',
                  '2 related product recommendations',
                  '2+ scientific citations',
                  '3-5 internal links to related articles',
                  'Images optimized for web',
                  'Read time is 8-15 minutes',
                  'Submitted for clinical review',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">check_circle</span>
                    <span className="text-sm text-on-surface">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link href="/content/new" className="btn-primary inline-flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Start Writing New Article
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
