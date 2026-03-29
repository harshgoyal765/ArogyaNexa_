'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { productsService } from '@/lib/services/products.service';
import type { ProductResponse } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/LoadingSpinner';
import { imageSelectors } from '@/lib/images';

export default function FeaturedProducts() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    productsService
      .list({ page: 0, size: 6 })
      .then(({ data }) => setProducts(data.data.content))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="section-label">Curated for you</span>
            <h2 className="font-headline text-4xl lg:text-5xl text-primary mt-2 leading-tight">
              Essential
              <br />
              <span className="italic font-normal">Formulations</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary border-b-2 border-primary-container pb-1 hover:border-primary transition-colors"
          >
            Browse All
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length > 0
            ? products.map((p, i) => (
                <div
                  key={p.id}
                  className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))
            : (
              // Fallback demo cards when API is not connected
              Array.from({ length: 6 }).map((_, i) => (
                <DemoProductCard key={i} index={i} visible={visible} />
              ))
            )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="btn-primary inline-flex">
            View All Medicines
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

const demoProducts = [
  { name: 'Atorvastatin Calcium', category: 'Cardiovascular', price: '₹24.50', rx: true, schedule: 'H', rating: '4.8' },
  { name: 'Omeprazole Magnesium', category: 'Gastrointestinal', price: '₹18.25', rx: false, schedule: 'OTC', rating: '4.9' },
  { name: 'Amoxicillin Forte', category: 'Antibacterial', price: '₹32.00', rx: true, schedule: 'H', rating: '4.7' },
  { name: 'Salbutamol Inhaler', category: 'Respiratory', price: '₹45.99', rx: true, schedule: 'H1', rating: '4.9' },
  { name: 'Complex Vitamin D3', category: 'Wellness', price: '₹12.50', rx: false, schedule: 'OTC', rating: '4.6' },
  { name: 'Precision BP Monitor', category: 'Devices', price: '₹89.00', rx: false, schedule: 'OTC', rating: '5.0' },
];

function DemoProductCard({ index, visible }: { index: number; visible: boolean }) {
  const p = demoProducts[index];
  
  // Get product images and cycle through them
  const productImages = imageSelectors.getProductImages();
  const supplementImages = imageSelectors.getSupplementImages();
  const allImages = [...productImages, ...supplementImages];
  const productImage = allImages[index % allImages.length];
  
  return (
    <div
      className={`card overflow-hidden group transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center overflow-hidden">
        {productImage ? (
          <img 
            src={productImage.src} 
            alt={productImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="material-symbols-outlined text-6xl text-outline-variant group-hover:scale-110 transition-transform duration-500">medication</span>
        )}
        {p.rx && (
          <span className="absolute top-3 left-3 badge bg-primary/90 text-white text-[10px]">Rx</span>
        )}
        {p.schedule !== 'OTC' && (
          <span className="absolute top-3 right-3 badge bg-amber-100 text-amber-800 text-[10px]">Schedule {p.schedule}</span>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div>
          <p className="section-label text-[10px]">{p.category}</p>
          <h3 className="font-headline text-base font-semibold text-primary mt-1 leading-snug">{p.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-xs font-medium text-on-surface-variant">{p.rating}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-surface-container-high">
          <span className="text-lg font-headline font-semibold text-primary">{p.price}</span>
          <button className="w-9 h-9 rounded-full border border-outline-variant hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90 flex items-center justify-center">
            <span className="material-symbols-outlined text-base">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
