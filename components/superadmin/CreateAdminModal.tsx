'use client';
import { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAdminModal({ isOpen, onClose, onSuccess }: CreateAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: '',
    employeeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
      showToast('Admin user created successfully!', 'success');
      setLoading(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        department: '',
        employeeId: '',
      });
      setErrors({});
      onClose();
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      department: '',
      employeeId: '',
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
            <h2 className="font-headline text-3xl text-primary">Create Admin User</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Add a new admin user to manage the ArogyaNexa platform
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
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[10px] block mb-2">
                  First Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.firstName ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-error text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Last Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.lastName ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-error text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.email ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="admin@arogyanexa.com"
                />
                {errors.email && (
                  <p className="text-error text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </section>

          {/* Account Details */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[10px] block mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                >
                  <option value="">Select department</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Content Management">Content Management</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="EMP-001"
                />
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[10px] block mb-2">
                  Password <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.password ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="Minimum 8 characters"
                />
                {errors.password && (
                  <p className="text-error text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-on-surface-variant mt-1.5">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.confirmPassword ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </section>

          {/* Permissions Info */}
          <section className="bg-primary-fixed/10 border-l-4 border-primary rounded-lg p-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <div>
                <h4 className="font-semibold text-primary mb-2 text-sm">Default Admin Permissions</h4>
                <p className="text-xs text-on-surface-variant mb-3">
                  The new admin user will be granted the following permissions by default:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Manage Products',
                    'Manage Orders',
                    'Manage Users',
                    'View Analytics',
                    'Manage Content',
                    'Customer Support',
                  ].map(permission => (
                    <div key={permission} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span className="text-xs text-on-surface">{permission}</span>
                    </div>
                  ))}
                </div>
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
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Create Admin User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
