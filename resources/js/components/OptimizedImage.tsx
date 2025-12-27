import React, { useState, useEffect, useRef } from 'react';

interface ImageMetadata {
    main?: {
        jpg?: { path: string; size: number; width: number; height: number };
        webp?: { path: string; size: number; width: number; height: number };
    };
    thumbnails?: {
        small?: {
            jpg?: { path: string; size: number; width: number; height: number };
            webp?: { path: string; size: number; width: number; height: number };
        };
        medium?: {
            jpg?: { path: string; size: number; width: number; height: number };
            webp?: { path: string; size: number; width: number; height: number };
        };
        large?: {
            jpg?: { path: string; size: number; width: number; height: number };
            webp?: { path: string; size: number; width: number; height: number };
        };
    };
    social?: {
        facebook?: {
            jpg?: { path: string; size: number; width: number; height: number };
            webp?: { path: string; size: number; width: number; height: number };
        };
        twitter?: {
            jpg?: { path: string; size: number; width: number; height: number };
            webp?: { path: string; size: number; width: number; height: number };
        };
        instagram?: {
            jpg?: { path: string; size: number; width: number; height: number };
            webp?: { path: string; size: number; width: number; height: number };
        };
    };
    fallback?: boolean;
}

interface OptimizedImageProps {
    src: string;
    alt: string;
    metadata?: string | ImageMetadata;
    className?: string;
    size?: 'small' | 'medium' | 'large' | 'original';
    lazy?: boolean;
    placeholder?: boolean;
    social?: 'facebook' | 'twitter' | 'instagram';
    onLoad?: () => void;
    onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    metadata,
    className = '',
    size = 'original',
    lazy = true,
    placeholder = true,
    social,
    onLoad,
    onError,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const imgRef = useRef<HTMLImageElement>(null);

    // Parse metadata
    const parsedMetadata: ImageMetadata | null = React.useMemo(() => {
        if (!metadata) return null;
        
        if (typeof metadata === 'string') {
            try {
                return JSON.parse(metadata);
            } catch {
                return null;
            }
        }
        
        return metadata;
    }, [metadata]);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || !imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [lazy]);

    // Generate image sources based on metadata and requirements
    const getImageSources = () => {
        if (!parsedMetadata || parsedMetadata.fallback) {
            return { src: src, srcSet: '' };
        }

        let imageData;
        
        // Select appropriate image based on requirements
        if (social && parsedMetadata.social?.[social]) {
            imageData = parsedMetadata.social[social];
        } else if (size !== 'original' && parsedMetadata.thumbnails?.[size]) {
            imageData = parsedMetadata.thumbnails[size];
        } else if (parsedMetadata.main) {
            imageData = parsedMetadata.main;
        }

        if (!imageData) {
            return { src: src, srcSet: '' };
        }

        // Prefer WebP if supported, fallback to JPG
        const webpPath = imageData.webp?.path;
        const jpgPath = imageData.jpg?.path;
        
        if (webpPath && supportsWebP()) {
            return {
                src: jpgPath || src,
                srcSet: `${webpPath} 1x${jpgPath ? `, ${jpgPath} 1x` : ''}`,
            };
        }

        return {
            src: jpgPath || src,
            srcSet: jpgPath ? `${jpgPath} 1x` : '',
        };
    };

    // Check WebP support
    const supportsWebP = () => {
        try {
            return document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;
        } catch {
            return false;
        }
    };

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const { src: finalSrc, srcSet } = getImageSources();

    // Generate responsive sizes attribute
    const sizes = size === 'small' ? '(max-width: 768px) 150px, 200px'
        : size === 'medium' ? '(max-width: 768px) 300px, 400px'
        : size === 'large' ? '(max-width: 768px) 600px, 800px'
        : '100vw';

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Placeholder */}
            {placeholder && !isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <svg
                            className="w-8 h-8 mx-auto mb-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm">Failed to load image</p>
                    </div>
                </div>
            )}

            {/* Actual image */}
            {isInView && !hasError && (
                <img
                    ref={imgRef}
                    src={finalSrc}
                    srcSet={srcSet || undefined}
                    sizes={srcSet ? sizes : undefined}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={lazy ? 'lazy' : 'eager'}
                />
            )}
        </div>
    );
};

export default OptimizedImage;