'use client';
import { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    patientName: string;
    time: string;
    type: string;
    notes?: string;
  };
}

export default function ConsultationModal({ isOpen, onClose, appointment }: ConsultationModalProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'vitals' | 'prescription'>('notes');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
  });

  const handleComplete = () => {
    if (!consultationNotes.trim()) {
      showToast('Please add consultation notes', 'error');
      return;
    }
    showToast('Consultation completed successfully!', 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline text-3xl text-primary">Consultation Session</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {appointment.patientName} • {appointment.time} • {appointment.type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-tertiary-fixed px-4 py-2 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="text-xs font-bold text-tertiary">Session Active</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 border-b border-outline-variant/10 flex gap-2">
          {[
            { id: 'notes', label: 'Consultation Notes', icon: 'edit_note' },
            { id: 'vitals', label: 'Vitals', icon: 'monitor_heart' },
            { id: 'prescription', label: 'Prescription', icon: 'medication' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              )}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div>
                <label className="section-label text-[10px] block mb-2">Chief Complaint</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Patient's main concern or reason for visit..."
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Consultation Notes</label>
                <textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Detailed consultation notes, observations, patient history..."
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Diagnosis</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Primary and secondary diagnosis..."
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Treatment Plan</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Recommended treatment, follow-up instructions..."
                />
              </div>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Blood Pressure', key: 'bloodPressure', placeholder: 'e.g., 120/80 mmHg', icon: 'favorite' },
                { label: 'Heart Rate', key: 'heartRate', placeholder: 'e.g., 72 bpm', icon: 'monitor_heart' },
                { label: 'Temperature', key: 'temperature', placeholder: 'e.g., 98.6°F', icon: 'thermostat' },
                { label: 'Weight', key: 'weight', placeholder: 'e.g., 70 kg', icon: 'scale' },
                { label: 'Height', key: 'height', placeholder: 'e.g., 170 cm', icon: 'height' },
                { label: 'Oxygen Saturation', key: 'oxygenSaturation', placeholder: 'e.g., 98%', icon: 'air' },
              ].map((vital) => (
                <div key={vital.key} className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary">{vital.icon}</span>
                    <label className="section-label text-[10px]">{vital.label}</label>
                  </div>
                  <input
                    type="text"
                    value={vitals[vital.key as keyof typeof vitals]}
                    onChange={(e) => setVitals(prev => ({ ...prev, [vital.key]: e.target.value }))}
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                    placeholder={vital.placeholder}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="space-y-6">
              <div className="bg-primary-fixed/10 border-l-4 border-primary rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-xl">info</span>
                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-sm">Quick Prescription</h4>
                    <p className="text-xs text-on-surface-variant mb-3">
                      Add medications directly or use the full prescription form for detailed prescriptions.
                    </p>
                    <button 
                      onClick={() => showToast('Opening full prescription form...', 'info')}
                      className="btn-primary text-xs"
                    >
                      <span className="material-symbols-outlined text-xs">add_notes</span>
                      Open Full Prescription Form
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Quick Medication Entry</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm font-mono"
                  placeholder="Enter medications (one per line):&#10;Metformin 500mg - 1 tablet twice daily - 30 days&#10;Aspirin 75mg - 1 tablet daily - 30 days"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-between items-center">
          <button 
            onClick={onClose}
            className="btn-secondary text-sm"
          >
            Save as Draft
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleComplete}
              className="btn-primary text-sm"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Complete Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
