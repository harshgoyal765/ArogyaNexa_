'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
}

interface HistoryRecord {
  id: string;
  date: string;
  type: 'Visit' | 'Prescription' | 'Lab Test' | 'Procedure';
  title: string;
  description: string;
  doctor: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

const HISTORY_DATA: HistoryRecord[] = [
  { id: 'H-001', date: '2024-10-20', type: 'Visit', title: 'Regular Checkup', description: 'Blood pressure monitoring and diabetes management review', doctor: 'Dr. Sarah Thorne', status: 'Completed' },
  { id: 'H-002', date: '2024-10-20', type: 'Prescription', title: 'Metformin 500mg', description: '1 tablet twice daily for 30 days', doctor: 'Dr. Sarah Thorne', status: 'Completed' },
  { id: 'H-003', date: '2024-10-15', type: 'Lab Test', title: 'HbA1c Test', description: 'Result: 6.8% - Good control', doctor: 'Lab Technician', status: 'Completed' },
  { id: 'H-004', date: '2024-09-28', type: 'Visit', title: 'Follow-up Consultation', description: 'Medication adjustment and lifestyle counseling', doctor: 'Dr. Sarah Thorne', status: 'Completed' },
  { id: 'H-005', date: '2024-09-28', type: 'Prescription', title: 'Metformin 500mg', description: '1 tablet twice daily for 30 days', doctor: 'Dr. Sarah Thorne', status: 'Completed' },
  { id: 'H-006', date: '2024-09-10', type: 'Lab Test', title: 'Lipid Profile', description: 'All values within normal range', doctor: 'Lab Technician', status: 'Completed' },
];

export default function PatientHistoryModal({ isOpen, onClose, patientName, patientId }: PatientHistoryModalProps) {
  const [filter, setFilter] = useState<'All' | 'Visit' | 'Prescription' | 'Lab Test' | 'Procedure'>('All');

  const filteredHistory = filter === 'All' 
    ? HISTORY_DATA 
    : HISTORY_DATA.filter(h => h.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Visit': return 'bg-primary-fixed text-primary';
      case 'Prescription': return 'bg-tertiary-fixed text-tertiary';
      case 'Lab Test': return 'bg-secondary-container text-secondary';
      case 'Procedure': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Visit': return 'medical_services';
      case 'Prescription': return 'medication';
      case 'Lab Test': return 'science';
      case 'Procedure': return 'healing';
      default: return 'description';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
          <div>
            <h2 className="font-headline text-3xl text-primary">Medical History</h2>
            <p className="text-sm text-on-surface-variant mt-1">{patientName} • {patientId}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-8 py-4 border-b border-outline-variant/10 flex gap-2 overflow-x-auto">
          {['All', 'Visit', 'Prescription', 'Lab Test', 'Procedure'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={cn(
                'px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap',
                filter === tab 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-outline-variant/20" />

            {/* History Items */}
            <div className="space-y-6">
              {filteredHistory.map((record, index) => (
                <div key={record.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div className={cn(
                    'absolute left-0 w-12 h-12 rounded-full flex items-center justify-center',
                    getTypeColor(record.type)
                  )}>
                    <span className="material-symbols-outlined text-xl">{getTypeIcon(record.type)}</span>
                  </div>

                  {/* Content Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-on-surface text-lg">{record.title}</h3>
                          <span className={cn('badge text-xs', getTypeColor(record.type))}>
                            {record.type}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-2">{record.description}</p>
                        <div className="flex items-center gap-4 text-xs text-outline">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">person</span>
                            {record.doctor}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {record.date}
                          </span>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary-container transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-between items-center">
          <p className="text-sm text-on-surface-variant">
            Showing {filteredHistory.length} of {HISTORY_DATA.length} records
          </p>
          <div className="flex gap-3">
            <button className="btn-secondary text-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              Export History
            </button>
            <button onClick={onClose} className="btn-primary text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
