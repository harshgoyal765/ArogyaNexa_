'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import PharmacistSidebar from '@/components/layout/PharmacistSidebar';
import { productsService } from '@/lib/services/products.service';
import { staticService } from '@/lib/services/static.service';
import { formatCurrency, cn } from '@/lib/utils';
import type { ProductResponse } from '@/types/product';
import type { LowStockItem } from '@/types/mockData';

export default function PharmacistInventoryPage() {
  return (
    <ProtectedRoute requiredRole={['PHARMACIST', 'ADMIN', 'SUPER_ADMIN']}>
      <InventoryContent />
    </ProtectedRoute>
  );
}

function InventoryContent() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LOW' | 'RX' | 'OTC'>('ALL');

  useEffect(() => {
    productsService.list({ page: 0, size: 50 })
      .then(({ data }) => setProducts(data.data.content))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    staticService.getLowStock()
      .then(({ data }) => setLowStock(data.data))
      .catch(() => setLowStock([]));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.saltComposition.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'ALL' ? true :
      filter === 'LOW' ? p.quantityAvailable < 20 :
      filter === 'RX' ? p.prescriptionRequired :
      !p.prescriptionRequired;
    return matchSearch && matchFilter;
  });

  const stockLevel = (qty: number) =>
    qty === 0 ? { label: 'Out of Stock', cls: 'bg-error-container text-error' } :
    qty < 15 ? { label: 'Critical', cls: 'bg-error-container/60 text-error' } :
    qty < 50 ? { label: 'Low', cls: 'bg-amber-100 text-amber-800' } :
    { label: 'In Stock', cls: 'bg-tertiary-fixed/50 text-tertiary' };

  return (
    <div className="bg-surface min-h-screen flex">
      <PharmacistSidebar />
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Inventory</h1>
            <p className="text-xs text-on-surface-variant">Stock levels &amp; dispensing reference</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/10 outline-none"
              placeholder="Search by name or salt..."
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Alert strip */}
          {lowStock.filter(s => s.level === 'critical').length > 0 && (
            <div className="bg-error-container/20 border border-error/20 rounded-xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-sm text-error font-medium">
                {lowStock.filter(s => s.level === 'critical').length} items at critical stock level — reorder required.
              </p>
            </div>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total SKUs', value: products.length, icon: 'inventory_2', color: 'text-primary', bg: 'bg-primary-fixed/30' },
              { label: 'Low Stock', value: products.filter(p => p.quantityAvailable < 20).length, icon: 'warning', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Rx Required', value: products.filter(p => p.prescriptionRequired).length, icon: 'description', color: 'text-secondary', bg: 'bg-secondary-container/20' },
              { label: 'OTC Items', value: products.filter(p => !p.prescriptionRequired).length, icon: 'local_pharmacy', color: 'text-tertiary', bg: 'bg-tertiary-fixed/30' },
            ].map((s) => (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
                <div>
                  <p className="section-label text-[10px]">{s.label}</p>
                  <p className="font-headline text-2xl text-on-surface">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
            {(['ALL', 'LOW', 'RX', 'OTC'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all',
                  filter === f ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary')}>
                {f === 'LOW' ? 'Low Stock' : f === 'RX' ? 'Prescription' : f}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Product', 'Salt / Composition', 'Form', 'Schedule', 'Stock', 'MRP', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {filtered.map((p) => {
                      const stock = stockLevel(p.quantityAvailable);
                      return (
                        <tr key={p.uuid} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-medium text-on-surface">{p.name}</p>
                            {p.nearExpiry && <span className="text-[10px] text-amber-600 font-bold">Near Expiry</span>}
                          </td>
                          <td className="px-5 py-4 text-on-surface-variant text-xs">{p.saltComposition}</td>
                          <td className="px-5 py-4 text-on-surface-variant text-xs">{p.dosageForm}</td>
                          <td className="px-5 py-4">
                            <span className={cn('badge text-[10px]',
                              p.scheduleType === 'H' || p.scheduleType === 'H1' ? 'bg-error-container/30 text-error' : 'bg-surface-container text-outline'
                            )}>{p.scheduleType}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-on-surface">{p.quantityAvailable}</span>
                              <span className={`badge text-[10px] ${stock.cls}`}>{stock.label}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-medium text-on-surface">{formatCurrency(p.mrp)}</td>
                          <td className="px-5 py-4">
                            <span className={cn('badge text-[10px]',
                              p.status === 'ACTIVE' ? 'bg-tertiary-fixed/50 text-tertiary' : 'bg-surface-container text-outline'
                            )}>{p.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-on-surface-variant text-sm">No products match your search.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
