'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductCard from '@/components/ui/ProductCard';
import Pagination from '@/components/ui/Pagination';
import { ProductCardSkeleton } from '@/components/ui/LoadingSpinner';
import { ToastContainer } from '@/components/ui/Toast';
import { productsService } from '@/lib/services/products.service';
import type { ProductResponse } from '@/types/product';
import type { PagedResponse } from '@/types/api';
import { cn } from '@/lib/utils';

const SCHEDULE_TYPES = ['OTC', 'G', 'H', 'H1', 'X'];
const DOSAGE_FORMS = ['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'DROPS', 'INHALER', 'PATCH'];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<PagedResponse<ProductResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const scheduleType = searchParams.get('scheduleType') || '';
  const dosageForm = searchParams.get('dosageForm') || '';
  const prescriptionRequired = searchParams.get('prescriptionRequired') || '';
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortDir = searchParams.get('sortDir') || 'asc';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 12, sortBy, sortDir };
      if (keyword) params.keyword = keyword;
      if (scheduleType) params.scheduleType = scheduleType;
      if (dosageForm) params.dosageForm = dosageForm;
      if (prescriptionRequired) params.prescriptionRequired = prescriptionRequired === 'true';

      const { data: res } = await productsService.search(params as Parameters<typeof productsService.search>[0]);
      setData(res.data);
    } catch {
      setData({ content: [], page: 0, size: 12, totalElements: 0, totalPages: 0, last: true });
    } finally {
      setLoading(false);
    }
  }, [keyword, page, scheduleType, dosageForm, prescriptionRequired, sortBy, sortDir]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => router.push('/products');

  const hasFilters = !!(keyword || scheduleType || dosageForm || prescriptionRequired);

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-4">
                <a href="/" className="hover:text-primary">Home</a>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <a href="/products" className="hover:text-primary">Pharmacy</a>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-bold">{keyword ? `Results for "${keyword}"` : 'All Medicines'}</span>
              </nav>
              <h1 className="font-headline text-4xl lg:text-5xl text-primary leading-tight">
                {keyword ? `Results for "${keyword}"` : 'Clinical Therapeutics'}
              </h1>
              {data && (
                <p className="text-on-surface-variant mt-2 max-w-xl">
                  {data.totalElements.toLocaleString()} products found
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-error hover:bg-error-container/20 px-3 py-2 rounded-lg transition-colors">
                  <X size={14} /> Clear filters
                </button>
              )}
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split('-');
                  updateParam('sortBy', sb);
                  updateParam('sortDir', sd);
                }}
                className="input-field py-2 text-sm w-auto"
              >
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="finalPrice-asc">Price: Low to High</option>
                <option value="finalPrice-desc">Price: High to Low</option>
              </select>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors', sidebarOpen ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low')}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            {sidebarOpen && (
              <aside className="w-64 flex-shrink-0 space-y-6">
                {/* Category Navigation */}
                <div className="card p-5 space-y-1">
                  <div className="mb-4 px-2">
                    <h2 className="font-headline text-xl text-primary">Shop by Category</h2>
                    <p className="text-sm font-medium text-on-surface-variant opacity-70">Browse our curated selection</p>
                  </div>
                  {[
                    { icon: 'medical_services', label: 'All Medicines', active: !scheduleType && !dosageForm },
                    { icon: 'spa', label: 'Wellness' },
                    { icon: 'person', label: 'Personal Care' },
                    { icon: 'child_care', label: 'Baby Care' },
                    { icon: 'monitor_heart', label: 'Health Devices' },
                  ].map((cat) => (
                    <div key={cat.label} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg transition-transform hover:translate-x-1 cursor-pointer', cat.active ? 'bg-blue-100/50 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low')}>
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      <span className="text-sm">{cat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="card p-5 space-y-5">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Schedule Type</h3>
                  <div className="space-y-2">
                    {SCHEDULE_TYPES.map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="schedule"
                          checked={scheduleType === s}
                          onChange={() => updateParam('scheduleType', scheduleType === s ? '' : s)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="card p-5 space-y-5">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Dosage Form</h3>
                  <div className="space-y-2">
                    {DOSAGE_FORMS.map((d) => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={dosageForm === d}
                          onChange={() => updateParam('dosageForm', dosageForm === d ? '' : d)}
                          className="accent-primary rounded"
                        />
                        <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors capitalize">{d.toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prescriptionRequired === 'false'}
                      onChange={() => updateParam('prescriptionRequired', prescriptionRequired === 'false' ? '' : 'false')}
                      className="accent-primary rounded"
                    />
                    <span className="text-sm text-on-surface-variant">OTC Only (No Rx needed)</span>
                  </label>
                </div>

                <div className="mt-auto pt-4">
                  <button onClick={() => router.push('/prescriptions')} className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white text-sm font-semibold rounded-md shadow-sm hover:opacity-90 transition-all active:scale-95">
                    Upload Prescription
                  </button>
                </div>
              </aside>
            )}

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : data && data.content.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.content.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                  <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    onPageChange={(p) => updateParam('page', String(p))}
                    className="mt-12"
                  />
                </>
              ) : (
                <div className="text-center py-24">
                  <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
                  <h3 className="font-headline text-2xl text-primary mt-4 mb-2">No products found</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Try adjusting your search or filters.</p>
                  <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
