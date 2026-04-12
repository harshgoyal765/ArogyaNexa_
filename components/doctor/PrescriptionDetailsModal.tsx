'use client';
import { showToast } from '@/components/ui/Toast';

interface PrescriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: {
    id: string;
    patient: string;
    medication: string;
    dosage: string;
    duration: string;
    status: string;
    date: string;
  };
}

export default function PrescriptionDetailsModal({ isOpen, onClose, prescription }: PrescriptionDetailsModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    showToast('Printing prescription...', 'info');
  };

  const handleDownload = () => {
    showToast('Downloading prescription PDF...', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
          <div>
            <h2 className="font-headline text-3xl text-primary">Prescription Details</h2>
            <p className="text-sm text-on-surface-variant mt-1">{prescription.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Prescription Content */}
        <div className="p-8">
          {/* Header with Logo */}
          <div className="mb-8 pb-6 border-b-2 border-primary/20">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-headline italic text-4xl text-primary mb-2">ArogyaNexa</h1>
                <p className="text-sm text-on-surface-variant">Digital Healthcare Platform</p>
                <p className="text-xs text-outline mt-1">License No: MED-2024-AH-001</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">Dr. Sarah Thorne, MD</p>
                <p className="text-xs text-on-surface-variant">Internal Medicine Specialist</p>
                <p className="text-xs text-outline mt-1">Reg. No: DMC-45678</p>
                <p className="text-xs text-outline">Contact: +91 98765 00000</p>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-8">
            <h3 className="section-label text-[10px] mb-3">PATIENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4 bg-surface-container-low/50 p-6 rounded-xl">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Patient Name</p>
                <p className="font-semibold text-on-surface">{prescription.patient}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Date</p>
                <p className="font-semibold text-on-surface">{prescription.date}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Patient ID</p>
                <p className="font-mono text-sm text-primary">PT-001</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Age / Gender</p>
                <p className="font-semibold text-on-surface">45 Years / Female</p>
              </div>
            </div>
          </div>

          {/* Prescription Symbol */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-6xl text-primary font-serif">℞</span>
              <div>
                <h3 className="font-headline text-2xl text-primary">Prescription</h3>
                <p className="text-xs text-on-surface-variant">Medication Details</p>
              </div>
            </div>
          </div>

          {/* Medication Details */}
          <div className="mb-8 bg-white border-2 border-primary/10 rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <p className="section-label text-[10px] mb-2">MEDICATION</p>
                <p className="text-xl font-semibold text-primary">{prescription.medication}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="section-label text-[10px] mb-1">DOSAGE</p>
                  <p className="text-on-surface">{prescription.dosage}</p>
                </div>
                <div>
                  <p className="section-label text-[10px] mb-1">DURATION</p>
                  <p className="text-on-surface">{prescription.duration}</p>
                </div>
              </div>
              <div>
                <p className="section-label text-[10px] mb-1">INSTRUCTIONS</p>
                <p className="text-sm text-on-surface-variant">
                  Take with food. Avoid alcohol. Complete the full course even if symptoms improve.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600">info</span>
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">Important Notes</p>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• Monitor blood sugar levels regularly</li>
                  <li>• Report any unusual side effects immediately</li>
                  <li>• Follow up appointment in 30 days</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-tertiary-fixed px-4 py-2 rounded-lg">
              <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
              <span className="text-sm font-bold text-tertiary">Status: {prescription.status.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-6 border-t border-outline-variant/20">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-on-surface-variant mb-2">Digitally Signed By</p>
                <p className="font-headline text-2xl text-primary italic mb-1">Dr. Sarah Thorne</p>
                <p className="text-xs text-outline">Date: {prescription.date}</p>
              </div>
              <div className="text-right">
                <div className="w-32 h-16 border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs text-outline">Digital Seal</span>
                </div>
                <p className="text-xs text-outline">Verified by ArogyaNexa</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
            <p className="text-xs text-outline">
              This is a digitally generated prescription. For any queries, contact ArogyaNexa Support.
            </p>
            <p className="text-xs text-outline mt-1">
              Prescription ID: {prescription.id} | Generated on {prescription.date}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
          <button 
            onClick={onClose}
            className="btn-secondary text-sm"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button 
              onClick={handleDownload}
              className="btn-secondary text-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download PDF
            </button>
            <button 
              onClick={handlePrint}
              className="btn-primary text-sm"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
