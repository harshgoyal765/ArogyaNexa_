'use client';
import { useEffect, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import PrescriptionUploader from '@/components/ui/PrescriptionUploader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { prescriptionsService, type PrescriptionItem } from '@/lib/services/articles.service';
import { formatDate, cn } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

interface Prescription {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fileUrl: string;
  notes?: string;
  createdAt: string;
}

export default function PrescriptionsPage() {
  return (
    <ProtectedRoute>
      <PrescriptionsContent />
    </ProtectedRoute>
  );
}

function PrescriptionsContent() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchPrescriptions = () => {
    setLoading(true);
    prescriptionsService
      .list()
      .then(({ data }) => setPrescriptions(data.data))
      .catch(() => {
        setPrescriptions([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const handleUploaded = () => {
    showToast('Prescription uploaded successfully', 'success');
    setShowUpload(false);
    fetchPrescriptions();
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <header className="mb-12 max-w-4xl">
            <span className="section-label text-[10px] text-secondary mb-2 block">Clinical Documents</span>
            <h1 className="font-headline text-4xl text-primary leading-tight mb-4">Prescription Verification</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
              Track the status of your medical authorizations. Our licensed pharmacists review every submission to ensure clinical accuracy and patient safety.
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left: Prescription List */}
            <div className="xl:col-span-8 space-y-6">
              {/* Upload toggle */}
              <div className="flex justify-end">
                <button onClick={() => setShowUpload(!showUpload)} className="btn-primary text-sm">
                  <Plus size={16} /> Upload New Prescription
                </button>
              </div>

              {showUpload && (
                <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 shadow-sm">
                  <h2 className="font-headline text-2xl text-primary mb-2 italic">Secure Prescription Upload</h2>
                  <p className="text-on-surface-variant mb-6 leading-relaxed italic">
                    To fulfill your medication order, please provide a high-resolution scan or photo of your valid medical prescription. Our clinical team will verify documents within 2 hours.
                  </p>
                  <PrescriptionUploader onUploaded={handleUploaded} />
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                  <FileText size={64} className="mx-auto text-outline-variant" />
                  <h3 className="font-headline text-2xl text-primary">No prescriptions yet</h3>
                  <p className="text-on-surface-variant text-sm">Upload your first prescription to get started.</p>
                </div>
              ) : (
                prescriptions.map((rx) => (
                  <div key={rx.id} className={cn(
                    'bg-surface-container-lowest p-8 rounded-xl shadow-sm border flex flex-col md:flex-row gap-8',
                    rx.status === 'REJECTED' ? 'border-l-4 border-error' : 'border-outline-variant/15'
                  )}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-headline text-primary mb-1">
                            {rx.status === 'APPROVED' ? 'Prescription Approved' :
                             rx.status === 'REJECTED' ? 'Action Required' : 'Under Review'}
                          </h3>
                          <p className="text-sm text-on-surface-variant">Uploaded: {formatDate(rx.createdAt)} • Ref: #{rx.id.slice(0, 8)}</p>
                        </div>
                        <span className={cn('px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full', {
                          'bg-surface-container-high text-primary': rx.status === 'PENDING',
                          'bg-secondary-container/30 text-secondary': rx.status === 'APPROVED',
                          'bg-error-container text-on-error-container': rx.status === 'REJECTED',
                        })}>
                          {rx.status === 'PENDING' ? 'Under Review' : rx.status}
                        </span>
                      </div>

                      {rx.status === 'PENDING' && (
                        /* Timeline */
                        <div className="relative mt-8">
                          <div className="absolute left-4 top-0 bottom-0 w-px bg-outline-variant/30" />
                          <div className="space-y-6">
                            {[
                              { label: 'Document Received', time: formatDate(rx.createdAt), done: true },
                              { label: 'Pharmacist Assigned', time: 'In progress', done: true },
                              { label: 'Clinical Validation', time: 'Estimated: 2 hours', active: true },
                            ].map((step) => (
                              <div key={step.label} className="relative pl-10">
                                <div className={cn('absolute left-2.5 top-1 w-3 h-3 rounded-full', step.done || step.active ? 'bg-tertiary' : 'bg-outline-variant border-2 border-surface-container-lowest')} />
                                <p className={cn('text-sm font-semibold', step.active ? 'text-primary' : 'text-tertiary')}>{step.label}</p>
                                <p className="text-xs text-on-surface-variant italic">{step.time}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {rx.status === 'APPROVED' && (
                        <div>
                          <p className="text-on-surface-variant mb-6 leading-relaxed">Your prescription has been successfully authenticated. You may now proceed to order your medications.</p>
                          <a href="/products" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                            Order Medications
                            <span className="material-symbols-outlined">arrow_forward</span>
                          </a>
                        </div>
                      )}

                      {rx.status === 'REJECTED' && rx.notes && (
                        <div className="bg-error-container/20 border border-error/10 p-4 rounded-lg flex gap-4 items-start mb-6">
                          <span className="material-symbols-outlined text-error">warning</span>
                          <div>
                            <p className="text-sm font-bold text-on-error-container">Pharmacist&apos;s Note:</p>
                            <p className="text-sm text-on-error-container/80">{rx.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Document preview */}
                    <div className="md:w-48 h-48 bg-surface-container-low rounded-xl flex items-center justify-center overflow-hidden border border-outline-variant/10">
                      {rx.fileUrl ? (
                        <a href={rx.fileUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                          <img src={rx.fileUrl} alt="Prescription" className="w-full h-full object-cover opacity-60 grayscale" />
                        </a>
                      ) : rx.status === 'APPROVED' ? (
                        <div className="flex flex-col items-center text-center p-4">
                          <span className="material-symbols-outlined text-primary text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-xs font-bold text-primary uppercase tracking-tighter">Ready for Order</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center p-4">
                          <FileText size={32} className="text-outline-variant mb-2" />
                          <span className="text-xs text-on-surface-variant">No preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Status Summary & Support */}
            <div className="xl:col-span-4 space-y-6">
              {/* Insights */}
              <div className="bg-surface-container-low p-8 rounded-xl">
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Verification Insights</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Active Requests</span>
                    <span className="text-lg font-headline font-bold">{prescriptions.filter(p => p.status === 'PENDING').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Approved</span>
                    <span className="text-lg font-headline font-bold text-tertiary">{prescriptions.filter(p => p.status === 'APPROVED').length}</span>
                  </div>
                  <div className="w-full h-1 bg-outline-variant/20 rounded-full mt-4">
                    <div className="w-3/4 h-full bg-primary rounded-full" />
                  </div>
                  <p className="text-[10px] text-on-surface-variant text-center mt-2 uppercase tracking-widest">
                    Weekly Limit: {prescriptions.length} / 15
                  </p>
                </div>
              </div>

              {/* Concierge */}
              <div className="bg-primary p-8 rounded-xl text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-xl font-headline mb-4 italic">Need clinical assistance?</h4>
                  <p className="text-sm opacity-80 mb-6 leading-relaxed">Our concierge team is available 24/7 to help you with prescription clarifications or pharmacy transfers.</p>
                  <a href="/ai-assistant" className="block w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors text-center text-sm">
                    Speak to a Pharmacist
                  </a>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-9xl">medical_services</span>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="p-6 border border-outline-variant/20 rounded-xl text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-outline">lock</span>
                  <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="material-symbols-outlined text-outline">security</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">256-Bit HIPAA Compliant Environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
