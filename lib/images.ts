/**
 * Images Library - Centralized image management for Stitch UI
 * All images are organized by category for easy access across components
 */

import { images } from './dummyData';

// Re-export images for easy access
export { images };

// Image utility functions
export const getImageById = (id: string) => {
  const allImages = Object.values(images).flat();
  return allImages.find(img => img.id === id);
};

export const getImagesByCategory = (category: string) => {
  const categoryKey = `${category}Images` as keyof typeof images;
  return images[categoryKey] || [];
};

export const getRandomImageFromCategory = (category: string) => {
  const categoryImages = getImagesByCategory(category);
  if (categoryImages.length === 0) return null;
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

// Predefined image sets for common use cases
export const imageSelectors = {
  // Hero sections - use weshopify images as primary
  getHeroImage: () => images.heroImages[0], // weshopify-hero
  getLabHeroImage: () => images.heroImages[1], // lab-hero
  
  // Background images
  getWeshopifyBackground: () => getImageById('weshopify-background'),
  getCrystallineBackground: () => getImageById('crystalline'),
  
  // Product displays
  getProductImages: () => images.productImages,
  getMedicineBottle: () => getImageById('medicine-bottle'),
  getMedicineBox: () => getImageById('medicine-box'),
  getInhaler: () => getImageById('inhaler'),
  
  // Research and articles
  getResearchImages: () => images.researchImages,
  getCapsules: () => getImageById('capsules'),
  getMolecular: () => getImageById('molecular'),
  getBeaker: () => getImageById('beaker'),
  
  // Wellness content
  getWellnessImages: () => images.wellnessImages,
  getYoga: () => getImageById('yoga'),
  getHealthyBowl: () => getImageById('healthy-bowl'),
  
  // Supplements
  getSupplementImages: () => images.supplementImages,
  getVitaminD3: () => getImageById('vitamin-d3'),
  getPillOrganizer: () => getImageById('pill-organizer'),
  
  // Professional profiles
  getProfileImages: () => images.profileImages,
  getFemaleDoctor: () => getImageById('female-professional'),
  getMaleDoctor: () => getImageById('male-doctor'),
  getLabProfessional: () => getImageById('lab-professional'),
  
  // Pharmacy and prescriptions
  getPharmacyImage: () => getImageById('pharmacy-interior'),
  getPrescriptionImages: () => images.prescriptionImages,
  getPrescriptionBottle: () => getImageById('prescription-bottle'),
  getOmegaComplex: () => getImageById('omega-complex'),
};

// Image placeholder for loading states
export const imagePlaceholder = {
  src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  alt: 'Loading...'
};
