'use client';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  onError?: () => void;
  [key: string]: any;
}

export default function SafeImage({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon = 'image',
  onError,
  ...props 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`bg-surface-container flex items-center justify-center ${className}`} {...props}>
        <span className="material-symbols-outlined text-4xl text-outline-variant">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`bg-surface-container animate-pulse ${className}`} {...props} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}