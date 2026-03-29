'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FallbackImage from '@/components/ui/FallbackImage';
import { ShoppingCart, AlertTriangle, FileText, ChevronLeft, Star, Info } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { productsService } from '@/lib/services/products.service';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { addToCartThunk } from '@/store/cartSlice';
import { formatCurrency, formatDate, getScheduleBadgeColor, cn } from '@/lib/utils';
import type { ProductResponse } from '@/types/product';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [alternatives, setAlternatives] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'interactions' | 'storage'>('info');

  useEffect(() => {
    if (!id) return;
    const numId = parseInt(id);
    Promise.all([
      productsService.getById(numId),
      productsService.getAlternatives(numId).catch(() => ({ data: { data: [] } })),
    ])
      .then(([prodRes, altRes]) => {
        setProduct(prodRes.data.data);
        setAlternatives(altRes.data.data.slice(0, 4));
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!product) return;
    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId: product.id, quantity }));
      showToast(`${product.name} added to cart`, 'success');
    } catch {
      showToast('Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return null;

  const images = [product.mainImageUrl, ...product.extraImageUrls].filter(Boolean);
  const discount = product.discountPercent > 0;

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-outline mb-8">
            <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/products')} className="hover:text-primary transition-colors">Medicines</button>
            <span>/</span>
            <span className="text-on-surface font-medium truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low">
                <FallbackImage src={images[activeImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                {product.nearExpiry && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-500/90 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <AlertTriangle size={14} /> Near Expiry
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn('w-16 h-16 rounded-xl overflow-hidden border-2 transition-all', i === activeImage ? 'border-primary' : 'border-transparent')}
                    >
                      <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.prescriptionRequired && (
                  <span className="badge bg-primary/10 text-primary"><FileText size={12} /> Prescription Required</span>
                )}
                {product.scheduleType && (
                  <span className={cn('badge', getScheduleBadgeColor(product.scheduleType))}>Schedule {product.scheduleType}</span>
                )}
                {product.nearExpiry && <span className="badge bg-amber-100 text-amber-800"><AlertTriangle size={12} /> Near Expiry</span>}
                {product.expired && <span className="badge bg-error-container text-error">Expired</span>}
              </div>

              <div>
                <p className="section-label mb-1">{product.dosageForm}</p>
                <h1 className="font-headline text-3xl lg:text-4xl text-primary leading-tight">{product.name}</h1>
                {product.saltComposition && (
                  <p className="text-on-surface-variant text-sm mt-2 italic">{product.saltComposition}</p>
                )}
              </div>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <span className="text-sm text-on-surface-variant">(4.8 · 124 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-headline text-4xl font-semibold text-primary">{formatCurrency(product.finalPrice)}</span>
                {discount && (
                  <>
                    <span className="text-lg text-outline line-through">{formatCurrency(product.mrp)}</span>
                    <span className="badge bg-tertiary text-white">{product.discountPercent}% OFF</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                {product.quantityAvailable > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                    <span className="text-on-surface-variant">{product.quantityAvailable} units in stock</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-error" />
                    <span className="text-error">Out of stock</span>
                  </>
                )}
              </div>

              {/* Quantity + Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-surface-container-low transition-colors text-on-surface-variant">−</button>
                  <span className="px-4 py-3 text-on-surface font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))} className="px-4 py-3 hover:bg-surface-container-low transition-colors text-on-surface-variant">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.expired || product.quantityAvailable === 0 || adding}
                  className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShoppingCart size={18} />}
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {product.prescriptionRequired && (
                <div className="flex items-start gap-3 p-4 bg-primary-fixed/30 rounded-xl border border-primary/10">
                  <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-on-surface-variant">This medicine requires a valid prescription. You can upload it during checkout.</p>
                </div>
              )}

              {/* Expiry info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <p className="section-label text-[10px] mb-1">Expiry Date</p>
                  <p className="font-medium text-on-surface">{formatDate(product.expiryDate)}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <p className="section-label text-[10px] mb-1">Batch No.</p>
                  <p className="font-medium text-on-surface">{product.batchNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-1 border-b border-outline-variant/20 mb-8">
              {(['info', 'interactions', 'storage'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px',
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
                  )}
                >
                  {tab === 'info' ? 'Product Info' : tab === 'interactions' ? 'Drug Interactions' : 'Storage'}
                </button>
              ))}
            </div>

            <div className="max-w-3xl">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {product.description && <p className="text-on-surface-variant leading-relaxed">{product.description}</p>}
                  {product.usageInstructions && (
                    <div>
                      <h4 className="font-semibold text-on-surface mb-2">Usage Instructions</h4>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{product.usageInstructions}</p>
                    </div>
                  )}
                  {product.sideEffects && (
                    <div className="p-4 bg-error-container/20 rounded-xl border-l-4 border-error">
                      <p className="text-xs font-bold uppercase tracking-wider text-error mb-1">Side Effects</p>
                      <p className="text-sm text-on-surface-variant">{product.sideEffects}</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'interactions' && (
                <div className="p-5 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Drug Interactions</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {product.drugInteractions || 'No known drug interactions on file. Always consult your pharmacist.'}
                  </p>
                </div>
              )}
              {activeTab === 'storage' && (
                <div className="p-5 bg-surface-container-low rounded-xl">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {product.storageCondition || 'Store in a cool, dry place away from direct sunlight. Keep out of reach of children.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="mt-16">
              <h2 className="font-headline text-2xl text-primary mb-6">Alternative Medicines</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => router.push(`/products/${alt.id}`)}
                    className="card p-4 text-left hover:-translate-y-0.5 transition-transform"
                  >
                    <p className="section-label text-[10px] mb-1">{alt.dosageForm}</p>
                    <p className="font-medium text-on-surface text-sm line-clamp-2">{alt.name}</p>
                    <p className="text-primary font-semibold mt-2 text-sm">{formatCurrency(alt.finalPrice)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
