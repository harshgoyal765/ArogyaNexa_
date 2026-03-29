'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { staticService } from '@/lib/services';
import type { CrmPipelineStage, CrmActivity } from '@/types/mockData';

// Source: stitch/stitch/sales_crm_dashboard/code.html
// Replace MOCK_CRM_PIPELINE with: GET /api/v1/crm/pipeline when CRM module is ready
// Replace MOCK_CRM_ACTIVITIES with: GET /api/v1/crm/activities?page=0&size=10

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/crm', icon: 'groups', label: 'CRM' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Inventory' },
  { href: '/pharmacist/prescriptions', icon: 'medical_services', label: 'Clinical Review' },
  { href: '/admin/logistics', icon: 'local_shipping', label: 'Logistics' },
];

const ALERTS = [
  { icon: 'insights', color: 'text-secondary', bg: 'bg-secondary-container/20', title: 'Market Shift Alert', desc: 'Bulk pricing in the South has dropped 4%. Adjust proposals.' },
  { icon: 'diversity_1', color: 'text-primary', bg: 'bg-primary/5', title: 'Team Sync Needed', desc: 'Sales lead overlapping in Midwest. Check CRM for account ownership.' },
  { icon: 'auto_awesome', color: 'text-tertiary', bg: 'bg-tertiary-fixed/20', title: 'AI Recommendation', desc: 'Top client is 85% likely to reorder in the next 48 hours. Call now.' },
];

export default function CRMPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <CRMContent />
    </ProtectedRoute>
  );
}

function CRMContent() {
  const [pipeline, setPipeline] = useState<CrmPipelineStage[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);

  useEffect(() => {
    staticService.getCrmPipeline()
      .then(({ data }) => setPipeline(data.data))
      .catch(() => setPipeline([]));

    staticService.getCrmActivities()
      .then(({ data }) => setActivities(data.data))
      .catch(() => setActivities([]));
  }, []);

  const FUNNEL_STAGES = pipeline.map(s => ({
    label: s.label,
    count: s.count.toLocaleString('en-IN'),
    growth: s.growth,
    growthColor: s.positive ? 'text-secondary' : 'text-error',
    width: s.width,
    barColor: s.positive ? 'bg-primary/80' : 'bg-primary/40',
  }));

  const ACTIVITIES = activities;

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Operational Excellence" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div className="flex items-center gap-6">
            <span className="font-headline italic text-2xl text-primary">ArogyaNexa</span>
            <nav className="hidden md:flex gap-6">
              {['Dashboard', 'Relationships', 'Pipeline', 'Insights'].map((item, i) => (
                <span key={item} className={`text-sm font-medium ${i === 0 ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>{item}</span>
              ))}
            </nav>
          </div>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 w-56 outline-none" placeholder="Search clients..." />
          </div>
        </header>

        <main className="px-10 py-10 pb-12">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-headline text-4xl md:text-5xl text-primary font-medium tracking-tight mb-4">Growth &amp; Relationships</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Your pipeline is showing a 14% uptick in high-intent engagement this week. Focus on the{' '}
                <span className="text-secondary font-semibold italic">Northwest Region</span> for expansion.
              </p>
            </div>
            <button className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">add</span> New Prospect
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sales Funnel */}
            <section className="md:col-span-8 card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline text-2xl text-primary italic">Sales Pipeline Funnel</h3>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                  <span>Quarterly View</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
              <div className="space-y-6">
                {FUNNEL_STAGES.map((stage) => (
                  <div key={stage.label} className="group cursor-pointer">
                    <div className="flex justify-between items-end mb-2">
                      <span className="section-label text-[10px]">{stage.label}</span>
                      <span className="text-xl font-headline text-primary">
                        {stage.count}{' '}
                        <span className={`text-xs font-body px-2 py-0.5 rounded ml-2 ${stage.growthColor} bg-current/10`}>{stage.growth}</span>
                      </span>
                    </div>
                    <div className="h-10 w-full bg-surface-container-low rounded-lg overflow-hidden">
                      <div className={`h-full ${stage.barColor} group-hover:opacity-90 transition-all duration-700`} style={{ width: stage.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Loyalty Metrics */}
            <section className="md:col-span-4 clinical-gradient text-white rounded-xl p-8 relative overflow-hidden shadow-primary-lg">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container rounded-full opacity-20 blur-3xl" />
              <h3 className="font-headline text-2xl italic mb-6 relative z-10">Loyalty Engagement</h3>
              <div className="space-y-8 relative z-10">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Elite Tier Retention</p>
                  <p className="text-4xl font-headline font-bold">94.2%</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Redemption Velocity</p>
                  <p className="text-4xl font-headline font-bold">2.4<span className="text-lg font-normal opacity-70 ml-2">pts/day</span></p>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-white/10">
                      <span className="material-symbols-outlined text-white">loyalty</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Program Milestone</p>
                      <p className="text-xs text-white/70">12 users near &apos;Diamond&apos; status</p>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-white/20 rounded-md text-sm hover:bg-white/10 transition-colors">View All Members</button>
                </div>
              </div>
            </section>

            {/* High-Value Activity */}
            <section className="md:col-span-7 bg-surface-container-low rounded-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline text-2xl text-primary">High-Value Activity</h3>
                <button className="section-label text-[10px] text-primary border-b border-primary/30">History</button>
              </div>
              <div className="space-y-4">
                {ACTIVITIES.map((a) => (
                  <div key={a.name} className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl hover:shadow-primary-sm transition-shadow">
                    <div className="w-12 h-12 rounded-full clinical-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">
                        {a.name} <span className="font-normal text-on-surface-variant ml-2">• {a.company}</span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{a.action}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-label uppercase tracking-tighter text-secondary font-bold">{a.value}</p>
                      <p className="text-[10px] text-on-surface-variant">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Regional Performance */}
            <section className="md:col-span-5 card overflow-hidden relative flex flex-col min-h-[300px]">
              <div className="p-8 pb-4">
                <h3 className="font-headline text-2xl text-primary">Regional Performance</h3>
                <p className="section-label text-[10px] mt-1">Live Market Density</p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-primary/5 to-secondary/5 relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[100px] text-primary/10">map</span>
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-white shadow-primary-sm" />
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-secondary rounded-full animate-bounce border-2 border-white" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary-container rounded-full border-2 border-white" />
                <div className="absolute bottom-4 left-4 right-4 glass-card p-4 rounded-lg flex justify-between items-center border border-outline-variant/10">
                  <div>
                    <p className="section-label text-[10px] text-primary">Top Performing Region</p>
                    <p className="text-sm font-headline font-bold text-on-surface">Northwest Hub</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-secondary">+₹2.4Cr</p>
                    <p className="text-[10px] text-on-surface-variant">vs. prev quarter</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Alerts Footer */}
          <footer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {ALERTS.map((alert) => (
              <div key={alert.title} className={`${alert.bg} p-6 rounded-xl flex items-center gap-4`}>
                <span className={`material-symbols-outlined text-3xl ${alert.color}`}>{alert.icon}</span>
                <div>
                  <h4 className={`font-bold text-sm ${alert.color}`}>{alert.title}</h4>
                  <p className="text-xs text-on-surface-variant">{alert.desc}</p>
                </div>
              </div>
            ))}
          </footer>
        </main>
      </div>
      <ToastContainer />
    </>
  );
}
