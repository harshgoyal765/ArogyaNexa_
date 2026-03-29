'use client';
import { imageSelectors, getImageById } from '@/lib/images';

interface ProfileCardProps {
  name: string;
  role: string;
  description?: string;
  imageId?: 'female-professional' | 'male-doctor' | 'lab-professional';
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ProfileCard({ 
  name, 
  role, 
  description,
  imageId,
  className = '',
  variant = 'default'
}: ProfileCardProps) {
  // Get profile image
  const getProfileImage = () => {
    if (imageId) {
      return getImageById(imageId);
    }
    // Default to first available profile image
    const profileImages = imageSelectors.getProfileImages();
    return profileImages[0];
  };

  const profileImage = getProfileImage();

  const sizeClasses = {
    default: 'w-20 h-20',
    compact: 'w-12 h-12',
    featured: 'w-32 h-32'
  };

  const cardClasses = {
    default: 'p-6',
    compact: 'p-4',
    featured: 'p-8'
  };

  return (
    <div className={`bg-surface-container-lowest rounded-xl ${cardClasses[variant]} ${className}`}>
      <div className={`flex ${variant === 'featured' ? 'flex-col items-center text-center' : 'items-center gap-4'}`}>
        {/* Profile Image */}
        <div className={`${sizeClasses[variant]} rounded-full overflow-hidden bg-surface-container flex-shrink-0 ${variant === 'featured' ? 'mb-4' : ''}`}>
          {profileImage ? (
            <img
              src={profileImage.src}
              alt={profileImage.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-outline-variant">person</span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className={variant === 'featured' ? 'text-center' : 'flex-1'}>
          <h3 className={`font-medium text-primary ${variant === 'featured' ? 'text-xl' : 'text-base'}`}>
            {name}
          </h3>
          <p className={`text-on-surface-variant ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
            {role}
          </p>
          {description && variant !== 'compact' && (
            <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Verification Badge */}
        <div className={`${variant === 'featured' ? 'mt-4' : 'ml-auto'}`}>
          <span className="badge bg-tertiary-fixed text-on-tertiary-fixed text-[9px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}