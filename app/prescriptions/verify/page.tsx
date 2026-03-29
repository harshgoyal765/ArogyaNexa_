'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { prescriptionsService, type PrescriptionItem } from '@/lib/services/articles.service';
import type { ApiResponse } from '@/types/api';

type Prescription = PrescriptionItem;

const STATUS_STEPS = ['Document Received', 'Pharmacist Assigned', 'Clinical Validation', 'Approved'];

export default function VerificationStatusPage() {
  return (
    <ProtectedRoute>
      <VerificationContent />
    </ProtectedRoute>
  );
}

function VerificationContent() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionsService
      .list()
      .then(({ data }) => setPrescriptions(data.data))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, []);

  const displayPrescriptions = prescriptions;

  const getStepIndex = (status: string) => {
    if (status === 'APPROVED') return 4;
    if (status === 'PENDING') return 2;
    return 0;
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen flex bg-surface">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-2 p-6 w-64 border-r border-slate-200/50 bg-slate-50 fixed left-0 top-24 bottom-0">
          <div className="mb-6 px-2">
            <h2 className="font-headline text-xl text-primary">Patient Portal</h2>
            <p className="text-xs font-medium tracking-wide text-outline">Verified Account</p>
          </div>
          <nav className="flex-grow space-y-1">
            {[
              { href: '/dashboard', icon: 'dashboard', label: 'Overview' },
              { href: '/prescriptions', icon: 'upload_file', label: 'Upload Center' },
              { href: '/prescriptions/verify', icon: 'history', label: 'Medical History', active: true },
              { href: '/products', icon: 'local_pharmacy', label: 'Pharmacy' },
              { href: '/profile', icon: 'settings', label: 'Settings' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${item.active ? 'bg-white text-primary shadow-primary-sm' : 'text-on-surface-variant hover:bg-slate-100 hover:pl-5'}`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/prescriptions" className="btn-primary justify-center text-sm py-3">
            <span className="material-symbols-outlined text-sm">add</span> New Consultation
          </Link>
        </aside>

        {/* Main */}
        <div className="flex-1 ml-0 md:ml-64 px-6 md:px-8 pb-12">
          <header className="mb-12 max-w-4xl">
            <span className="section-label text-[10px] text-secondary mb-2 block">Clinical Documents</span>
            <h1 className="font-headline text-4xl text-primary leading-tight mb-4">Prescription Verification</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
              Track the status of your medical authorizations. Our licensed pharmacists review every submission to ensure clinical accuracy and patient safety.
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Prescription List */}
            <div className="xl:col-span-8 space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : displayPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className={`bg-surface-container-lowest p-8 rounded-3xl shadow-primary-sm border ${rx.status === 'REJECTED' ? 'border-l-4 border-error' : 'border-outline-variant/15'} flex flex-col md:flex-row gap-8 relative overflow-hidden`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-headline text-2xl text-primary mb-1">{rx.notes || `Prescription #${rx.id}`}</h3>
                        <p className="text-sm text-on-surface-variant">Uploaded: {formatDate(rx.createdAt)} • Ref: #{rx.id}</p>
                      </div>
                      <span className={`badge text-xs ${rx.status === 'APPROVED' ? 'bg-secondary-container/30 text-secondary' : rx.status === 'REJECTED' ? 'bg-error-container text-error' : 'bg-surface-container-high text-primary'}`}>
                        {rx.status === 'PENDING' ? 'Under Review' : rx.status}
                      </span>
                    </div>

                    {rx.status === 'REJECTED' && rx.pharmacistNote && (
                      <div className="bg-error-container/20 border border-error/10 p-4 rounded-xl flex gap-4 items-start mb-6">
                        <span className="material-symbols-outlined text-error flex-shrink-0">warning</span>
                        <div>
                          <p className="text-sm font-bold text-on-error-container">Pharmacist&apos;s Note:</p>
                          <p className="text-sm text-on-error-container/80">{rx.pharmacistNote}</p>
                        </div>
                      </div>
                    )}

                    {rx.status === 'APPROVED' && (
                      <p className="text-on-surface-variant mb-6 leading-relaxed text-sm">
                        Your prescription has been successfully authenticated. You may now proceed to order your medications.
                      </p>
                    )}

                    {rx.status === 'PENDING' && (
                      <div className="relative mt-6">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-outline-variant/30" />
                        <div className="space-y-5">
                          {STATUS_STEPS.slice(0, getStepIndex(rx.status)).map((step, i) => (
                            <div key={step} className="relative pl-10">
                              <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full ${i < getStepIndex(rx.status) - 1 ? 'bg-tertiary shadow-[0_0_0_4px_rgba(0,77,16,0.1)]' : 'bg-outline-variant border-2 border-surface-container-lowest'}`} />
                              <p className={`text-sm font-semibold ${i < getStepIndex(rx.status) - 1 ? 'text-tertiary' : 'text-on-surface'}`}>{step}</p>
                              <p className="text-xs text-on-surface-variant italic">
                                {i < getStepIndex(rx.status) - 1 ? formatDate(rx.createdAt) : 'Estimated completion: 2 hours'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {rx.status === 'APPROVED' && (
                      <Link href="/products" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm">
                        Order Medications <span className="material-symbols-outlined">arrow_forward</span>
                      </Link>
                    )}

                    {rx.status === 'REJECTED' && (
                      <Link href="/prescriptions" className="inline-flex items-center gap-2 bg-error text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-error/90 transition-colors">
                        Re-upload Document
                      </Link>
                    )}
                  </div>

                  <div className={`md:w-44 h-44 rounded-xl flex flex-col items-center justify-center p-4 text-center flex-shrink-0 ${rx.status === 'APPROVED' ? 'bg-primary/5' : 'bg-surface-container-low border border-outline-variant/10'}`}>
                    {rx.status === 'APPROVED' ? (
                      <>
                        <span className="material-symbols-outlined text-primary text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="section-label text-[10px] text-primary">Ready for Order</span>
                      </>
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-outline-variant">description</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-4 space-y-5">
              {/* Insights */}
              <div className="bg-surface-container-low p-8 rounded-3xl">
                <h4 className="section-label text-[10px] text-primary mb-6">Verification Insights</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Active Requests</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{displayPrescriptions.filter(p => p.status === 'PENDING').length.toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Avg. Review Time</span>
                    <span className="font-headline text-lg font-bold text-on-surface">4.2 hrs</span>
                  </div>
                  <div className="w-full h-1 bg-outline-variant/20 rounded-full mt-4">
                    <div className="w-3/4 h-full bg-primary rounded-full" />
                  </div>
                  <p className="section-label text-[10px] text-center mt-2">Weekly Limit: {displayPrescriptions.length} / 15</p>
                </div>
              </div>

              {/* CTA */}
              <div className="clinical-gradient p-8 rounded-3xl text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-headline text-xl mb-4 italic">Need clinical assistance?</h4>
                  <p className="text-sm text-white/80 mb-6 leading-relaxed">Our concierge team is available 24/7 to help you with prescription clarifications or pharmacy transfers.</p>
                  <Link href="/ai-assistant" className="block w-full py-3 bg-white text-primary font-bold rounded-xl text-center hover:bg-surface-container-high transition-colors text-sm">
                    Speak to AI Assistant
                  </Link>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-9xl">medical_services</span>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="p-6 border border-outline-variant/20 rounded-3xl text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-outline">lock</span>
                  <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="material-symbols-outlined text-outline">security</span>
                </div>
                <p className="section-label text-[10px]">256-Bit HIPAA Compliant Environment</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}
