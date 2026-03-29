'use client';
import Link from 'next/link';
import { AlertTriangle, FileText } from 'lucide-react';
import FallbackImage from '@/components/ui/FallbackImage';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { addToCartThunk } from '@/store/cartSlice';
import { formatCurrency, getScheduleBadgeColor, cn } from '@/lib/utils';
import type { ProductResponse } from '@/types/product';
import { useState } from 'react';

interface ProductCardProps {
  product: ProductResponse;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || product.expired || adding) return;
    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId: product.id, quantity: 1 }));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  const discount = product.discountPercent > 0;

  return (
    <Link href={`/products/${product.id}`} className={cn('group card block overflow-hidden', className)}>
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        {product.mainImageUrl ? (
              <FallbackImage
                src={product.mainImageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-outline-variant">
                  medication
                </span>
              </div>
            )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.prescriptionRequired && (
            <span className="badge bg-primary/90 text-white text-[10px] backdrop-blur-sm">
              <FileText size={10} /> Rx
            </span>
          )}
          {product.nearExpiry && !product.expired && (
            <span className="badge bg-amber-500/90 text-white text-[10px] backdrop-blur-sm">
              <AlertTriangle size={10} /> Near Expiry
            </span>
          )}
          {product.expired && (
            <span className="badge bg-error/90 text-white text-[10px] backdrop-blur-sm">
              Expired
            </span>
          )}
          {product.scheduleType && product.scheduleType !== 'OTC' && (
            <span className={cn('badge text-[10px]', getScheduleBadgeColor(product.scheduleType))}>
              Schedule {product.scheduleType}
            </span>
          )}
        </div>

        {discount && (
          <div className="absolute top-3 right-3 bg-tertiary text-white text-xs font-bold px-2 py-0.5 rounded-md">
            -{product.discountPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{product.dosageForm}</span>
          <div className="flex items-center gap-1 text-secondary">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-xs font-bold">4.8</span>
          </div>
        </div>

        <h3 className="font-headline text-xl text-primary group-hover:text-primary-container transition-colors line-clamp-2">
          {product.name}
        </h3>

        {product.saltComposition && (
          <p className="text-xs text-on-surface-variant italic line-clamp-2 leading-relaxed">{product.saltComposition}</p>
        )}

        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div className="px-3 py-1.5 bg-secondary-container rounded-md">
            <span className="text-lg font-bold text-on-secondary-container">
              {formatCurrency(product.finalPrice)}
            </span>
            {discount && (
              <span className="text-xs text-outline line-through ml-1.5">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.expired || !isAuthenticated || adding}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
              product.expired || !isAuthenticated
                ? 'bg-surface-container text-outline cursor-not-allowed'
                : added
                ? 'bg-tertiary text-white scale-110'
                : 'border border-outline-variant hover:bg-primary hover:text-white hover:border-primary active:scale-90'
            )}
            aria-label="Add to cart"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
