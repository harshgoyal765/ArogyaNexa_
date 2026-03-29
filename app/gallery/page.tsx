'use client';
import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { images, imageSelectors } from '@/lib/images';
import ProductImageGallery from '@/components/ui/ProductImageGallery';
import ProfileCard from '@/components/ui/ProfileCard';
import PharmacyShowcase from '@/components/ui/PharmacyShowcase';

const IMAGE_CATEGORIES = [
  { key: 'heroImages', label: 'Hero Images', icon: 'landscape' },
  { key: 'researchImages', label: 'Research', icon: 'science' },
  { key: 'productImages', label: 'Products', icon: 'medication' },
  { key: 'wellnessImages', label: 'Wellness', icon: 'spa' },
  { key: 'supplementImages', label: 'Supplements', icon: 'pill' },
  { key: 'profileImages', label: 'Profiles', icon: 'person' },
  { key: 'pharmacyImages', label: 'Pharmacy', icon: 'local_pharmacy' },
  { key: 'prescriptionImages', label: 'Prescriptions', icon: 'receipt_long' },
  { key: 'backgroundImages', label: 'Backgrounds', icon: 'texture' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('heroImages');
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    src: string;
    alt: string;
    category: string;
  } | null>(null);

  const currentImages = images[selectedCategory as keyof typeof images] || [];

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-16 text-center">
          <h1 className="font-headline text-5xl text-primary mb-6">Image Gallery</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Explore our comprehensive collection of medical and pharmaceutical imagery, 
            organized by category for easy integration across the platform.
          </p>
        </section>

        {/* Component Showcase */}
        <section className="mb-20">
          <h2 className="font-headline text-3xl text-primary mb-8">Component Examples</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Product Gallery Example */}
            <div className="space-y-4">
              <h3 className="font-medium text-primary">Product Image Gallery</h3>
              <ProductImageGallery category="product" />
            </div>

            {/* Profile Card Example */}
            <div className="space-y-4">
              <h3 className="font-medium text-primary">Profile Card</h3>
              <ProfileCard 
                name="Dr. Helena Vance"
                role="Chief Medical Officer"
                description="Specializing in precision medicine and cardiovascular health research."
                imageId="female-professional"
                variant="featured"
              />
            </div>

            {/* Supplement Gallery */}
            <div className="space-y-4">
              <h3 className="font-medium text-primary">Supplement Gallery</h3>
              <ProductImageGallery category="supplement" />
            </div>
          </div>

          {/* Pharmacy Showcase */}
          <div className="mb-12">
            <h3 className="font-medium text-primary mb-4">Pharmacy Showcase</h3>
            <PharmacyShowcase 
              title="State-of-the-Art Facilities"
              description="Our pharmaceutical facilities meet the highest standards of clinical excellence and safety protocols."
            />
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <h2 className="font-headline text-3xl text-primary mb-8">Browse by Category</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {IMAGE_CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.key
                    ? 'bg-primary text-white shadow-primary-sm'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{category.icon}</span>
                {category.label}
                <span className="badge bg-white/20 text-xs">
                  {(images[category.key as keyof typeof images] || []).length}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Image Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline text-2xl text-primary">
              {IMAGE_CATEGORIES.find(cat => cat.key === selectedCategory)?.label} 
              <span className="text-on-surface-variant text-lg ml-2">
                ({currentImages.length} images)
              </span>
            </h3>
          </div>

          {currentImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentImages.map((image: any) => (
                <div 
                  key={image.id} 
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square bg-surface-container rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-medium truncate">{image.id}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary truncate">{image.id}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{image.alt}</p>
                    <span className="badge bg-surface-container text-[10px]">{image.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">image_not_supported</span>
              <p className="text-on-surface-variant">No images found in this category</p>
            </div>
          )}
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6">
                <h3 className="font-headline text-xl text-primary mb-2">{selectedImage.id}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{selectedImage.alt}</p>
                <div className="flex items-center gap-4">
                  <span className="badge bg-primary/10 text-primary">{selectedImage.category}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(selectedImage.src)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}