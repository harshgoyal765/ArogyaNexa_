'use client';
import { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { imageSelectors, getImagesByCategory } from '@/lib/images';

const CALENDAR_DAYS = [
  { day: 'MON', date: '12', event: 'Promotion: Collagen Pure', eventColor: 'bg-primary/10 text-primary', borderColor: '' },
  { day: 'TUE', date: '13', event: null, borderColor: '' },
  { day: 'WED', date: '14', event: 'Article: Sleep Hygiene', eventColor: 'bg-tertiary/10 text-tertiary', borderColor: 'border-l-4 border-tertiary' },
  { day: 'THU', date: '15', event: null, borderColor: '' },
  { day: 'FRI', date: '16', event: 'Marketing: Weekend Reset', eventColor: 'bg-primary/10 text-primary', borderColor: 'border-l-4 border-primary' },
  { day: 'SAT', date: '17', event: null, borderColor: '', dim: true },
  { day: 'SUN', date: '18', event: null, borderColor: '', dim: true },
];

const PERFORMANCE = [
  { icon: 'visibility', label: 'Reads', value: '124.8k', growth: '+12%' },
  { icon: 'share', label: 'Shares', value: '3.2k', growth: '+8%' },
  { icon: 'shopping_cart', label: 'Conversions', value: '1.1k', growth: '+22%' },
];

const PENDING_REVIEWS = [
  { category: 'Science', status: 'Critical Review', title: 'Therapeutic Benefits of Ashwagandha in Cortisol Management', author: 'Dr. Aris Thorne' },
  { category: 'Bio-Tech', status: 'Pending Editor', title: 'Understanding the Microbiome: A 2024 Perspective', author: 'Sarah Vance' },
  { category: 'Lifestyle', status: 'Review Required', title: 'Seasonal Nutrients: Preparing for the Winter Shift', author: 'Dr. Julianne Lee' },
];

const SEO_DATA = [
  { segment: 'Supplements & Nootropics', coverage: 90, traffic: 'Organic Search (84%)', score: '9.2 / 10', scoreColor: 'bg-primary-container text-primary' },
  { segment: 'Dermatological Wellness', coverage: 75, traffic: 'Referral (42%)', score: '7.8 / 10', scoreColor: 'bg-surface-container-high text-on-surface-variant' },
  { segment: 'Mental Vitality & Focus', coverage: 45, traffic: 'Social Media (61%)', score: '5.4 / 10', scoreColor: 'bg-error-container text-error' },
];

export default function ContentEditorPage() {
  return (
    <ProtectedRoute requiredRole={['ADMIN', 'CONTENT_EDITOR', 'SUPER_ADMIN']}>
      <ContentEditorContent />
    </ProtectedRoute>
  );
}

function ContentEditorContent() {
  // Get images for the content sections
  const researchImages = imageSelectors.getResearchImages();
  const supplementImages = imageSelectors.getSupplementImages();
  const profileImages = imageSelectors.getProfileImages();

  // Modal states
  const [showSEODetails, setShowSEODetails] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);

  const handleExportReport = () => {
    showToast('SEO Report exported successfully', 'success');
    // In production, this would trigger a download
  };

  const handleRefineKeywords = () => {
    showToast('Opening keyword refinement tool...', 'info');
    // In production, this would open a keyword management interface
  };

  const handleViewDetails = (segment: any) => {
    setSelectedSegment(segment);
    setShowSEODetails(true);
  };

  return (
    <div className="bg-surface min-h-screen flex">
      <AdminSidebar />
      
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Content Management</h1>
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

        <main className="p-10">
          <div className="max-w-7xl mx-auto space-y-14">

            {/* Header & SEO Health */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-outline-variant/15 pb-12">
              <div className="max-w-2xl">
                <span className="section-label text-[10px] text-secondary mb-4 block">Wellness Hub Editorial</span>
                <h1 className="font-headline text-4xl text-primary leading-tight mb-5">Managing the modern apothecary&apos;s voice.</h1>
                <p className="text-on-surface-variant text-lg leading-relaxed font-light">Your central nervous system for clinical storytelling and marketing excellence.</p>
              </div>
              <div className="card p-6 flex items-center gap-6 min-w-[260px]">
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-container-high" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="175" strokeDashoffset="30" className="text-tertiary" />
                  </svg>
                  <span className="absolute font-bold text-primary text-sm">82%</span>
                </div>
                <div>
                  <p className="section-label text-[10px] mb-1">SEO Health Overview</p>
                  <p className="font-headline text-xl text-primary">High Vitality</p>
                  <p className="text-xs text-tertiary mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +4.2% from last month
                  </p>
                </div>
              </div>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Editorial Calendar */}
              <div className="col-span-12 lg:col-span-8 card p-8 flex flex-col min-h-[420px]">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="font-headline text-2xl text-primary mb-1">Editorial Calendar</h3>
                    <p className="text-sm text-on-surface-variant">Scheduled educational campaigns &amp; product launches.</p>
                  </div>
                  <Link href="/content/new" className="btn-primary text-sm py-2">New Content +</Link>
                </div>
                <div className="grid grid-cols-7 gap-3 flex-1">
                  {CALENDAR_DAYS.map((d) => (
                    <div key={d.day} className="space-y-3">
                      <div className="text-center pb-3 border-b border-outline-variant/10">
                        <p className="section-label text-[10px]">{d.day}</p>
                      </div>
                      <div className={`h-28 bg-surface-container-low rounded-lg p-3 ${d.borderColor} ${d.dim ? 'opacity-40' : ''} ${!d.event && !d.dim ? 'border-dashed border-2 border-outline-variant/20 flex items-center justify-center' : ''}`}>
                        {d.event ? (
                          <>
                            <span className="text-xs font-bold text-primary">{d.date}</span>
                            <div className={`mt-2 p-2 rounded text-[9px] font-bold leading-tight uppercase ${d.eventColor}`}>{d.event}</div>
                          </>
                        ) : !d.dim ? (
                          <span className="material-symbols-outlined text-outline-variant">add</span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance + Tip */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-headline text-lg text-primary">Hub Performance</h4>
                    <span className="material-symbols-outlined text-on-surface-variant">bar_chart</span>
                  </div>
                  <div className="space-y-5">
                    {PERFORMANCE.map((p) => (
                      <div key={p.label} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                          <span className="material-symbols-outlined">{p.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="section-label text-[10px]">{p.label}</p>
                          <p className="text-xl font-medium text-primary">{p.value}</p>
                        </div>
                        <div className="text-xs text-tertiary font-bold">{p.growth}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="clinical-gradient rounded-xl p-8 text-white relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                  </div>
                  <div className="relative z-10">
                    <p className="section-label text-[10px] text-white/70 mb-2 uppercase tracking-wider">Editor&apos;s Tip</p>
                    <h5 className="font-headline text-xl mb-4 italic leading-relaxed">&quot;SEO favors consistency over volume.&quot;</h5>
                    <p className="text-xs text-white/80 mb-6 leading-relaxed">
                      Learn proven strategies for building sustainable content authority and organic reach.
                    </p>
                    <Link 
                      href="/content/manual" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-widest transition-all group-hover:translate-x-1"
                    >
                      <span className="material-symbols-outlined text-sm">auto_stories</span>
                      READ THE MANUAL
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                </div>
              </div>

              {/* Pending Reviews */}
              <div className="col-span-12">
                <div className="flex items-end justify-between mb-8 px-1">
                  <div>
                    <h3 className="font-headline text-3xl text-primary mb-2">Pending Clinical Reviews</h3>
                    <p className="text-on-surface-variant text-sm">Content requiring medical accuracy verification before publishing.</p>
                  </div>
                  <a className="section-label text-[10px] text-primary hover:underline underline-offset-8" href="/wellness">View all (14)</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {PENDING_REVIEWS.map((article, index) => {
                    // Cycle through different image categories for variety
                    const imageCategories = [researchImages, supplementImages, researchImages];
                    const categoryImages = imageCategories[index % imageCategories.length];
                    const articleImage = categoryImages[index % categoryImages.length];
                    
                    return (
                      <Link 
                        key={article.title} 
                        href={`/content/edit/${index + 1}`}
                        className="card p-6 hover:shadow-primary-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-full h-40 bg-gradient-to-br from-surface-container to-surface-container-high rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                          {articleImage ? (
                            <img 
                              src={articleImage.src} 
                              alt={articleImage.alt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-5xl text-outline-variant group-hover:scale-110 transition-transform duration-500">article</span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="flex gap-2 mb-4">
                          <span className="badge bg-tertiary/10 text-tertiary text-[9px]">{article.category}</span>
                          <span className="badge bg-secondary/10 text-secondary text-[9px]">{article.status}</span>
                        </div>
                        <h4 className="font-headline text-xl text-primary mb-3 leading-snug">{article.title}</h4>
                        <div className="flex items-center justify-between pt-5 border-t border-outline-variant/10">
                          <div className="flex items-center gap-2">
                            {/* Use profile images for authors */}
                            {profileImages[index % profileImages.length] ? (
                              <img 
                                src={profileImages[index % profileImages.length].src}
                                alt={profileImages[index % profileImages.length].alt}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold">
                                {article.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            )}
                            <span className="text-xs font-medium text-on-surface-variant">{article.author}</span>
                          </div>
                          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit_square</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* SEO Analytics */}
              <div className="col-span-12 card p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-headline text-2xl text-primary mb-1">Hub SEO Health Analytics</h3>
                    <p className="text-sm text-on-surface-variant">Deep-dive into keyword saturation and authority scores.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExportReport}
                      className="px-4 py-2 bg-surface-container-low hover:bg-primary/10 text-primary text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Export Report
                    </button>
                    <button 
                      onClick={handleRefineKeywords}
                      className="px-4 py-2 bg-surface-container-low hover:bg-secondary/10 text-primary text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">tune</span>
                      Refine Keywords
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-outline-variant/15">
                      <tr>
                        {['Content Segment', 'Keyword Coverage', 'Traffic Source', 'Authority Score', 'Actions'].map(h => (
                          <th key={h} className="pb-4 section-label text-[10px] font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {SEO_DATA.map((row) => (
                        <tr key={row.segment}>
                          <td className="py-5 font-medium text-primary">{row.segment}</td>
                          <td className="py-5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-surface-container-low rounded-full max-w-[100px]">
                                <div className={`h-full rounded-full ${row.coverage >= 80 ? 'bg-tertiary' : row.coverage >= 60 ? 'bg-secondary' : 'bg-error'}`} style={{ width: `${row.coverage}%` }} />
                              </div>
                              <span className="text-xs text-on-surface-variant">{row.coverage}%</span>
                            </div>
                          </td>
                          <td className="py-5 text-sm text-on-surface-variant">{row.traffic}</td>
                          <td className="py-5">
                            <span className={`badge text-[10px] ${row.scoreColor}`}>{row.score}</span>
                          </td>
                          <td className="py-5">
                            <button 
                              onClick={() => handleViewDetails(row)}
                              className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-medium"
                              title="View detailed analytics"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* SEO Details Modal */}
      {showSEODetails && selectedSegment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-outline-variant/20 p-6 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-2xl text-primary">{selectedSegment.segment}</h2>
                <p className="text-sm text-on-surface-variant">Detailed SEO Analytics</p>
              </div>
              <button
                onClick={() => setShowSEODetails(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-4">
                  <p className="section-label text-[10px] mb-2">Keyword Coverage</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-primary">{selectedSegment.coverage}%</p>
                    <div className={`text-xs font-bold mb-1 ${selectedSegment.coverage >= 80 ? 'text-tertiary' : selectedSegment.coverage >= 60 ? 'text-secondary' : 'text-error'}`}>
                      {selectedSegment.coverage >= 80 ? 'Excellent' : selectedSegment.coverage >= 60 ? 'Good' : 'Needs Work'}
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <p className="section-label text-[10px] mb-2">Authority Score</p>
                  <p className="text-3xl font-bold text-primary">{selectedSegment.score}</p>
                </div>
                <div className="card p-4">
                  <p className="section-label text-[10px] mb-2">Traffic Source</p>
                  <p className="text-sm font-medium text-on-surface mt-2">{selectedSegment.traffic}</p>
                </div>
              </div>

              {/* Top Keywords */}
              <div className="card p-6">
                <h3 className="font-headline text-lg text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">search</span>
                  Top Performing Keywords
                </h3>
                <div className="space-y-3">
                  {[
                    { keyword: 'natural supplements', volume: '12.5k', rank: 3, trend: 'up' },
                    { keyword: 'wellness products', volume: '8.2k', rank: 7, trend: 'up' },
                    { keyword: 'health optimization', volume: '5.8k', rank: 12, trend: 'down' },
                    { keyword: 'clinical nutrition', volume: '4.1k', rank: 5, trend: 'stable' },
                  ].map((kw) => (
                    <div key={kw.keyword} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-on-surface">{kw.keyword}</p>
                        <p className="text-xs text-on-surface-variant">Monthly searches: {kw.volume}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-on-surface-variant">Rank</p>
                          <p className="text-lg font-bold text-primary">#{kw.rank}</p>
                        </div>
                        <span className={`material-symbols-outlined text-sm ${
                          kw.trend === 'up' ? 'text-tertiary' : kw.trend === 'down' ? 'text-error' : 'text-on-surface-variant'
                        }`}>
                          {kw.trend === 'up' ? 'trending_up' : kw.trend === 'down' ? 'trending_down' : 'trending_flat'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Recommendations */}
              <div className="card p-6">
                <h3 className="font-headline text-lg text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">lightbulb</span>
                  Optimization Recommendations
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-tertiary-container/20 rounded-lg">
                    <span className="material-symbols-outlined text-tertiary mt-0.5">check_circle</span>
                    <div>
                      <p className="font-medium text-on-surface">Increase internal linking</p>
                      <p className="text-xs text-on-surface-variant">Add 3-5 more internal links to related articles</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-secondary-container/20 rounded-lg">
                    <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
                    <div>
                      <p className="font-medium text-on-surface">Update meta descriptions</p>
                      <p className="text-xs text-on-surface-variant">5 articles need optimized meta descriptions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-error-container/20 rounded-lg">
                    <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                    <div>
                      <p className="font-medium text-on-surface">Improve page load speed</p>
                      <p className="text-xs text-on-surface-variant">Optimize images to reduce load time by 30%</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={handleExportReport}
                  className="btn-primary flex-1"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export Full Report
                </button>
                <button 
                  onClick={() => setShowSEODetails(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}
