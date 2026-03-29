'use client';
import { useState } from 'react';
import { imageSelectors, getImageById } from '@/lib/images';

interface ProductImageGalleryProps {
  productId?: string;
  category?: 'product' | 'supplement' | 'prescription';
  className?: string;
}

export default function ProductImageGallery({ 
  productId, 
  category = 'product', 
  className = '' 
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Get images based on category or specific product
  const getImages = () => {
    if (productId) {
      const specificImage = getImageById(productId);
      return specificImage ? [specificImage] : [];
    }
    
    switch (category) {
      case 'supplement':
        return imageSelectors.getSupplementImages();
      case 'prescription':
        return imageSelectors.getPrescriptionImages();
      default:
        return imageSelectors.getProductImages();
    }
  };

  const images = getImages();
  const selectedImage = images[selectedImageIndex];

  if (!images.length) {
    return (
      <div className={`aspect-square bg-surface-container rounded-xl flex items-center justify-center ${className}`}>
        <span className="material-symbols-outlined text-6xl text-outline-variant">medication</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="aspect-square bg-surface-container-lowest rounded-xl overflow-hidden relative group">
        <img
          src={selectedImage.src}
          alt={selectedImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex 
                  ? 'border-primary shadow-primary-sm' 
                  : 'border-outline-variant hover:border-primary/50'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Info */}
      <div className="text-xs text-on-surface-variant">
        <p className="line-clamp-2">{selectedImage.alt}</p>
        <span className="text-[10px] text-outline uppercase tracking-wider mt-1 block">
          {selectedImage.category}
        </span>
      </div>
    </div>
  );
}