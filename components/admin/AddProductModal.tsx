'use client';
import { useState } from 'react';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    categoryId: '',
    dosageForm: '',
    strength: '',
    packSize: '',
    mrp: '',
    discount: '',
    quantityAvailable: '',
    prescriptionRequired: false,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.dosageForm) newErrors.dosageForm = 'Dosage form is required';
    if (!formData.mrp) {
      newErrors.mrp = 'MRP is required';
    } else if (isNaN(Number(formData.mrp)) || Number(formData.mrp) <= 0) {
      newErrors.mrp = 'MRP must be a positive number';
    }
    if (!formData.quantityAvailable) {
      newErrors.quantityAvailable = 'Quantity is required';
    } else if (isNaN(Number(formData.quantityAvailable)) || Number(formData.quantityAvailable) < 0) {
      newErrors.quantityAvailable = 'Quantity must be a non-negative number';
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
      showToast('Product added successfully!', 'success');
      setLoading(false);
      // Reset form
      setFormData({
        name: '',
        genericName: '',
        manufacturer: '',
        categoryId: '',
        dosageForm: '',
        strength: '',
        packSize: '',
        mrp: '',
        discount: '',
        quantityAvailable: '',
        prescriptionRequired: false,
        description: '',
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
      name: '',
      genericName: '',
      manufacturer: '',
      categoryId: '',
      dosageForm: '',
      strength: '',
      packSize: '',
      mrp: '',
      discount: '',
      quantityAvailable: '',
      prescriptionRequired: false,
      description: '',
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
            <h2 className="font-headline text-3xl text-primary">Add New Product</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Add a new pharmaceutical product to the inventory
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
          {/* Basic Information */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="section-label text-[10px] block mb-2">
                  Product Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.name ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="e.g., Paracetamol 500mg Tablets"
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Generic Name</label>
                <input
                  type="text"
                  value={formData.genericName}
                  onChange={(e) => handleChange('genericName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="e.g., Acetaminophen"
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Manufacturer <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleChange('manufacturer', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.manufacturer ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="e.g., Sun Pharma"
                />
                {errors.manufacturer && (
                  <p className="text-error text-xs mt-1">{errors.manufacturer}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.categoryId ? 'border-error' : 'border-outline-variant'
                  )}
                >
                  <option value="">Select category</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Vitamins">Vitamins & Supplements</option>
                  <option value="Diabetes">Diabetes Care</option>
                  <option value="Heart">Heart & Blood Pressure</option>
                  <option value="Respiratory">Respiratory</option>
                  <option value="Digestive">Digestive Health</option>
                  <option value="Skin">Skin Care</option>
                </select>
                {errors.categoryId && (
                  <p className="text-error text-xs mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Dosage Form <span className="text-error">*</span>
                </label>
                <select
                  value={formData.dosageForm}
                  onChange={(e) => handleChange('dosageForm', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.dosageForm ? 'border-error' : 'border-outline-variant'
                  )}
                >
                  <option value="">Select form</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Drops">Drops</option>
                  <option value="Inhaler">Inhaler</option>
                </select>
                {errors.dosageForm && (
                  <p className="text-error text-xs mt-1">{errors.dosageForm}</p>
                )}
              </div>
            </div>
          </section>

          {/* Product Details */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[10px] block mb-2">Strength</label>
                <input
                  type="text"
                  value={formData.strength}
                  onChange={(e) => handleChange('strength', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Pack Size</label>
                <input
                  type="text"
                  value={formData.packSize}
                  onChange={(e) => handleChange('packSize', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="e.g., 10 tablets"
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  MRP (₹) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.mrp}
                  onChange={(e) => handleChange('mrp', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.mrp ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="0.00"
                />
                {errors.mrp && (
                  <p className="text-error text-xs mt-1">{errors.mrp}</p>
                )}
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">Discount (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => handleChange('discount', e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Quantity Available <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantityAvailable}
                  onChange={(e) => handleChange('quantityAvailable', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm',
                    errors.quantityAvailable ? 'border-error' : 'border-outline-variant'
                  )}
                  placeholder="0"
                />
                {errors.quantityAvailable && (
                  <p className="text-error text-xs mt-1">{errors.quantityAvailable}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onChange={(e) => handleChange('prescriptionRequired', e.target.checked)}
                  className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="prescriptionRequired" className="text-sm text-on-surface cursor-pointer">
                  Prescription Required
                </label>
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">Description</h3>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
              placeholder="Enter product description, usage instructions, and other details..."
            />
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
                  Adding...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
