'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { productsService } from '@/lib/services/products.service';
import { formatCurrency } from '@/lib/utils';
import type { ProductResponse } from '@/types/product';
import type { PagedResponse } from '@/types/api';

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminProductsContent />
    </ProtectedRoute>
  );
}

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

function AdminProductsContent() {
  const [data, setData] = useState<PagedResponse<ProductResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    const req = search
      ? productsService.search({ keyword: search, page, size: 15 })
      : productsService.list({ page, size: 15 });
    req
      .then(({ data: res }) => setData(res.data))
      .catch(() => {
        setData({ content: [], page: 0, size: 15, totalElements: 0, totalPages: 0, last: true });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await productsService.delete(id);
      showToast(`${name} deleted`, 'success');
      fetchProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <nav className="flex gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              <span>Catalog</span><span>/</span>
              <span className="text-primary">Pharmaceuticals</span>
            </nav>
            <h1 className="font-headline text-2xl text-primary">Product Management</h1>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input type="text" placeholder="Search clinical inventory..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="input-field pl-9 py-2 text-sm w-64" />
            </div>
            <button className="btn-primary text-sm"><Plus size={18} /> Add New Product</button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Inventory Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">+12% Growth</span>
              </div>
              <h5 className="text-primary text-sm font-bold uppercase tracking-widest mb-1">Stock Turnover</h5>
              <p className="font-headline text-4xl text-primary font-bold">4.2x</p>
              <p className="text-xs text-on-surface-variant mt-2">Inventory cycles per quarter</p>
            </div>
            <div className="bg-secondary-container/10 rounded-2xl p-6 border border-secondary-container/20">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container/20 rounded-lg">
                  <span className="material-symbols-outlined text-secondary">health_and_safety</span>
                </div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Compliance Ready</span>
              </div>
              <h5 className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">Prescription Items</h5>
              <p className="font-headline text-4xl text-secondary font-bold">186</p>
              <p className="text-xs text-on-surface-variant mt-2">Registered controlled substances</p>
            </div>
            <div className="bg-error/5 rounded-2xl p-6 border border-error/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-error/10 rounded-lg">
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
                <span className="text-[10px] font-bold text-error uppercase tracking-widest">Attention Required</span>
              </div>
              <h5 className="text-error text-sm font-bold uppercase tracking-widest mb-1">Expiring Soon</h5>
              <p className="font-headline text-4xl text-error font-bold">14</p>
              <p className="text-xs text-on-surface-variant mt-2">Products expire within 30 days</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : (
            <>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-container-low">
                      <tr>
                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Rx', 'Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left section-label text-[10px] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                      {data?.content.map((p) => (
                        <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-on-surface line-clamp-1">{p.name}</p>
                              <p className="text-xs text-outline">{p.dosageForm}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-on-surface-variant">{p.categoryId}</td>
                          <td className="px-4 py-3 font-medium text-primary">{formatCurrency(p.finalPrice)}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${p.quantityAvailable > 10 ? 'bg-tertiary-fixed/50 text-tertiary' : p.quantityAvailable > 0 ? 'bg-amber-100 text-amber-800' : 'bg-error-container text-error'}`}>
                              {p.quantityAvailable}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge ${p.status === 'ACTIVE' ? 'bg-tertiary-fixed/50 text-tertiary' : 'bg-surface-container text-outline'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.prescriptionRequired ? <span className="badge bg-primary/10 text-primary">Yes</span> : <span className="text-outline text-xs">No</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-outline hover:text-primary transition-colors rounded-lg hover:bg-surface-container-low">
                                <Edit size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                disabled={deleting === p.id}
                                className="p-1.5 text-outline hover:text-error transition-colors rounded-lg hover:bg-error-container/20"
                              >
                                {deleting === p.id ? <span className="w-3.5 h-3.5 border-2 border-error border-t-transparent rounded-full animate-spin block" /> : <Trash2 size={15} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {data && (
                <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Showing {data.content.length} of {data.totalElements} products</span>
                  <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
