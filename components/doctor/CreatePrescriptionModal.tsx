'use client';
import { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreatePrescriptionModal({ isOpen, onClose, onSuccess }: CreatePrescriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refillAllowed: false,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.medication.trim()) newErrors.medication = 'Medication is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.frequency.trim()) newErrors.frequency = 'Frequency is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showToast('Prescription created successfully!', 'success');
      setLoading(false);
      // Reset form
      setFormData({
        patientName: '',
        patientId: '',
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        refillAllowed: false,
        notes: '',
      });
      setErrors({});
      onClose();
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      patientName: '',
      patientId: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      refillAllowed: false,
      notes: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-outline-variant/10 px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="font-headline text-3xl text-primary">Create Prescription</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Issue a new prescription for your patient
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Patient Information */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[10px] block mb-2">
                  Patient Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => handleChange('patientName', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.patientName ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="Enter patient name"
                />
                {errors.patientName && (
                  <p className="text-error text-xs mt-1">{errors.patientName}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Patient ID</label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => handleChange('patientId', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="e.g., PT-001"
                />
              </div>
            </div>
          </section>

          {/* Medication Details */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Medication Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="section-label text-[10px] block mb-2">
                  Medication Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.medication}
                  onChange={(e) => handleChange('medication', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.medication ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="e.g., Metformin 500mg"
                />
                {errors.medication && (
                  <p className="text-error text-xs mt-1">{errors.medication}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Dosage <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => handleChange('dosage', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.dosage ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="e.g., 1 tablet"
                />
                {errors.dosage && (
                  <p className="text-error text-xs mt-1">{errors.dosage}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Frequency <span className="text-error">*</span>
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.frequency ? 'border-error' : 'border-outline-variant'
                  )}
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed</option>
                </select>
                {errors.frequency && (
                  <p className="text-error text-xs mt-1">{errors.frequency}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Duration <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.duration ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="e.g., 30 days"
                />
                {errors.duration && (
                  <p className="text-error text-xs mt-1">{errors.duration}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="refillAllowed"
                  checked={formData.refillAllowed}
                  onChange={(e) => handleChange('refillAllowed', e.target.checked)}
                  className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="refillAllowed" className="text-sm text-on-surface cursor-pointer">
                  Refill Allowed
                </label>
              </div>
            </div>
          </section>

          {/* Instructions & Notes */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Instructions & Notes</h3>
            <div className="space-y-4">
              <div>
                <label className="section-label text-[10px] block mb-2">Patient Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="e.g., Take with food, avoid alcohol..."
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Doctor's Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Internal notes for pharmacist..."
                />
              </div>
            </div>
          </section>

          {/* Info Box */}
          <section className="bg-primary-fixed/10 border-l-4 border-primary rounded-lg p-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <div>
                <h4 className="font-semibold text-primary mb-2 text-sm">Prescription Verification</h4>
                <p className="text-xs text-on-surface-variant">
                  This prescription will be sent to the pharmacy for verification and dispensing. The patient will be notified once it's ready for pickup.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">add_notes</span>
                  Create Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
