import React, { useState } from 'react';
import { BookOpen, Coffee, UtensilsCrossed } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackType?: 'book' | 'coffee' | 'food';
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackType = 'book',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#ECE3D4] ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      ) : null}

      {/* Styled fallback container satisfying Zero-Broken-Image Policy */}
      {(hasError || !isLoaded) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#EFE8DD] to-[#DFD3C1] text-[#58402F] transition-opacity duration-300 ${
            hasError ? 'opacity-100' : isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#35271F]/5 flex items-center justify-center mb-2">
            {fallbackType === 'coffee' ? (
              <Coffee className="w-5 h-5 text-[#AD7950]" />
            ) : fallbackType === 'food' ? (
              <UtensilsCrossed className="w-5 h-5 text-[#AD7950]" />
            ) : (
              <BookOpen className="w-5 h-5 text-[#AD7950]" />
            )}
          </div>
          <p className="text-xs font-serif italic text-[#58402F]/80 max-w-[180px] line-clamp-2">
            {alt || "The Hedgehog Café"}
          </p>
        </div>
      )}
    </div>
  );
};
