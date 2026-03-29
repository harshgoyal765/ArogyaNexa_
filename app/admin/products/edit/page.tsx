'use client';
import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { productsApi } from '@/lib/api/products';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

export default function EditProductPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <ProtectedRoute requiredRole="ADMIN">
        <EditProductContent />
      </ProtectedRoute>
    </Suspense>
  );
}

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isNew = !productId;

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', brandId: '', saltComposition: '', dosageForm: 'TABLET',
    scheduleType: 'OTC', prescriptionRequired: false, sideEffects: '',
    usageInstructions: '', drugInteractions: '', storageCondition: '',
    quantityAvailable: 0, mrp: 0, discountPercent: 0,
    categoryId: 1, weightGrams: 0, batchNumber: '',
    manufacturingDate: '', expiryDate: '',
    metaTitle: '', metaDescription: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (publish: boolean) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('product', JSON.stringify({ ...form, status: publish ? 'ACTIVE' : 'INACTIVE' }));
      if (imageFile) fd.append('mainImage', imageFile);
      if (productId) {
        await productsApi.update(parseInt(productId), fd);
        showToast('Product updated successfully', 'success');
      } else {
        await productsApi.create(fd);
        showToast('Product created successfully', 'success');
      }
      router.push('/admin/products');
    } catch {
      showToast('Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 outline-none';
  const labelCls = 'block text-[0.7rem] font-bold uppercase tracking-wider text-outline mb-1.5';

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="font-headline italic text-xl text-primary">
              {isNew ? 'Add New Product' : 'Edit Product'}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSubmit(false)} disabled={saving} className="btn-secondary text-sm py-2">
              Save Draft
            </button>
            <button onClick={() => handleSubmit(true)} disabled={saving} className="btn-primary text-sm py-2">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">publish</span>}
              Publish Product
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto flex gap-8">
          {/* Main form */}
          <div className="flex-1 space-y-10">

            {/* Basic Info */}
            <section className="card p-8">
              <h2 className="font-headline text-2xl text-primary font-bold mb-1">Basic Information</h2>
              <p className="text-on-surface-variant text-sm mb-6">Core identification details for the clinical registry.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={labelCls}>Product Name</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="e.g. Amoxicillin Trihydrate" />
                </div>
                <div>
                  <label className={labelCls}>Salt Composition</label>
                  <input value={form.saltComposition} onChange={e => set('saltComposition', e.target.value)} className={inputCls} placeholder="e.g. Amoxicillin 500mg" />
                </div>
                <div>
                  <label className={labelCls}>Batch Number</label>
                  <input value={form.batchNumber} onChange={e => set('batchNumber', e.target.value)} className={`${inputCls} font-mono`} placeholder="e.g. BATCH-2024-001" />
                </div>
                <div>
                  <label className={labelCls}>Dosage Form</label>
                  <select value={form.dosageForm} onChange={e => set('dosageForm', e.target.value)} className={inputCls}>
                    {['TABLET','CAPSULE','SYRUP','INJECTION','CREAM','DROPS','INHALER','PATCH'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Schedule Type</label>
                  <select value={form.scheduleType} onChange={e => set('scheduleType', e.target.value)} className={inputCls}>
                    {['OTC','G','H','H1','X'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Manufacturing Date</label>
                  <input type="date" value={form.manufacturingDate} onChange={e => set('manufacturingDate', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2 flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Prescription Required</p>
                    <p className="text-[10px] text-outline">Requires certified doctor verification</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set('prescriptionRequired', !form.prescriptionRequired)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${form.prescriptionRequired ? 'bg-tertiary' : 'bg-surface-container-high'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.prescriptionRequired ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Clinical Details */}
            <section className="card p-8">
              <h2 className="font-headline text-2xl text-primary font-bold mb-1">Clinical Details</h2>
              <p className="text-on-surface-variant text-sm mb-6">Medical specifications and safety protocols.</p>
              <div className="space-y-6">
                <div>
                  <label className={labelCls}>Side Effects</label>
                  <textarea value={form.sideEffects} onChange={e => set('sideEffects', e.target.value)} rows={3} className={inputCls} placeholder="Common and rare adverse reactions..." />
                </div>
                <div>
                  <label className={labelCls}>Usage Instructions</label>
                  <textarea value={form.usageInstructions} onChange={e => set('usageInstructions', e.target.value)} rows={3} className={inputCls} placeholder="Step-by-step administration guide..." />
                </div>
                <div>
                  <label className={labelCls}>Drug Interactions</label>
                  <textarea value={form.drugInteractions} onChange={e => set('drugInteractions', e.target.value)} rows={2} className={inputCls} placeholder="Known drug interactions..." />
                </div>
                <div className="p-5 bg-error-container/20 border-l-4 border-error rounded-r-xl">
                  <div className="flex items-center gap-2 text-error font-bold text-xs uppercase tracking-widest mb-2">
                    <span className="material-symbols-outlined text-sm">warning</span> Critical Warnings
                  </div>
                  <textarea value={form.storageCondition} onChange={e => set('storageCondition', e.target.value)} rows={2} className="w-full bg-transparent border-none text-sm text-on-error-container italic focus:ring-0 outline-none resize-none" placeholder="Highlight severe contraindications or hypersensitivity alerts..." />
                </div>
              </div>
            </section>

            {/* Inventory & Pricing */}
            <section className="card p-8">
              <h2 className="font-headline text-2xl text-primary font-bold mb-1">Inventory &amp; Pricing</h2>
              <p className="text-on-surface-variant text-sm mb-6">Financial and stock management parameters.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <label className={labelCls}>MRP (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm font-bold">₹</span>
                    <input type="number" value={form.mrp} onChange={e => set('mrp', parseFloat(e.target.value))} className={`${inputCls} pl-8 font-bold`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Discount %</label>
                  <input type="number" value={form.discountPercent} onChange={e => set('discountPercent', parseFloat(e.target.value))} className={`${inputCls} font-bold`} min="0" max="100" />
                </div>
                <div>
                  <label className={labelCls}>Stock Qty</label>
                  <input type="number" value={form.quantityAvailable} onChange={e => set('quantityAvailable', parseInt(e.target.value))} className={`${inputCls} font-bold`} />
                </div>
                <div>
                  <label className={labelCls}>Weight (g)</label>
                  <input type="number" value={form.weightGrams} onChange={e => set('weightGrams', parseFloat(e.target.value))} className={`${inputCls} font-bold`} />
                </div>
              </div>
            </section>

            {/* Media */}
            <section className="card p-8">
              <h2 className="font-headline text-2xl text-primary font-bold mb-1">Media Assets</h2>
              <p className="text-on-surface-variant text-sm mb-6">High-resolution imagery for the product listing.</p>
              <div
                onClick={() => imageRef.current?.click()}
                className="border-2 border-dashed border-outline-variant/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-surface-container-low transition-all"
              >
                <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto mb-3" />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">add_photo_alternate</span>
                )}
                <p className="text-sm text-on-surface-variant">{imagePreview ? 'Click to change image' : 'Click to upload product image'}</p>
                <p className="text-xs text-outline mt-1">PNG, JPG, WEBP — max 5MB</p>
              </div>
            </section>

            {/* SEO */}
            <section className="card p-8">
              <h2 className="font-headline text-2xl text-primary font-bold mb-1">Search Optimization</h2>
              <p className="text-on-surface-variant text-sm mb-6">Configuration for search engine visibility.</p>
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} className={inputCls} placeholder="Optimal SEO heading..." maxLength={60} />
                  <div className="flex justify-between text-[10px] text-outline mt-1 px-1">
                    <span>Recommended: 60 characters</span>
                    <span>{form.metaTitle.length}/60</span>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} rows={2} className={inputCls} placeholder="Brief summary for search results..." maxLength={160} />
                  <div className="flex justify-between text-[10px] text-outline mt-1 px-1">
                    <span>Recommended: 160 characters</span>
                    <span>{form.metaDescription.length}/160</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-72 space-y-5 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h3 className="font-headline text-xl text-primary font-bold mb-5">Publishing</h3>
              <div className="space-y-3">
                <button onClick={() => handleSubmit(true)} disabled={saving} className="btn-primary w-full justify-center py-3">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">publish</span>}
                  Publish Product
                </button>
                <button onClick={() => handleSubmit(false)} disabled={saving} className="w-full py-3 px-4 bg-surface-container-high text-on-surface-variant font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-outline-variant/30 transition-colors">
                  <span className="material-symbols-outlined text-sm">save</span> Save as Draft
                </button>
              </div>
              <div className="mt-6 pt-5 border-t border-outline-variant/10">
                <button onClick={() => router.push('/admin/products')} className="w-full py-2.5 px-4 text-error font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-error-container/20 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Cancel
                </button>
              </div>
              <div className="mt-6 space-y-3 text-xs">
                {[
                  { label: 'Status', value: 'Draft', color: 'text-on-surface' },
                  { label: 'Visibility', value: 'Public', color: 'text-on-surface' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between font-bold text-outline uppercase tracking-wider">
                    <span>{item.label}</span>
                    <span className={item.color}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary-container/10 p-5 rounded-xl border border-secondary/10">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-sm">tips_and_updates</span> Editor Insight
              </div>
              <p className="text-xs text-on-secondary-fixed-variant leading-relaxed">
                Ensure the <span className="font-bold">Salt Composition</span> matches official pharmacological terminology for better clinical cross-referencing.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
