import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1580281657524-a6c747719147?auto=format&fit=crop&w=1200&q=80';

export interface FallbackImageProps extends Omit<ImageProps, 'src'> {
  src?: string;
  fallbackSrc?: string;
}

export default function FallbackImage({ src, fallbackSrc = DEFAULT_FALLBACK_IMAGE, alt, ...props }: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src?.trim() ? src : fallbackSrc);
  const [errored, setErrored] = useState(false);

  return (
    <Image
      {...props}
      src={errored ? fallbackSrc : currentSrc}
      alt={alt || 'Image'}
      onError={() => {
        if (!errored) {
          setErrored(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
