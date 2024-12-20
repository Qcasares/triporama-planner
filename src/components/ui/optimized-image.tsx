import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  className,
  ...props 
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return undefined;
    }

    const sizes = [320, 640, 960, 1280];
    return sizes
      .map(size => {
        const url = new URL(src);
        url.searchParams.set('w', size.toString());
        return `${url.toString()} ${size}w`;
      })
      .join(', ');
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        srcSet={generateSrcSet()}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          error ? "hidden" : "block",
          className
        )}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';