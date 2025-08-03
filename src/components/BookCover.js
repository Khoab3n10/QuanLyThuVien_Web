import React, { useState, useEffect } from 'react';
import './BookCover.css';

const BookCover = ({ src, alt, title, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');

  // Validate and process image source
  useEffect(() => {
    if (!src) {
      setImageSrc('');
      setIsLoading(false);
      return;
    }

    const processedSrc = processImageSource(src);
    setImageSrc(processedSrc);
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Process different types of image sources
  const processImageSource = (source) => {
    if (!source) return '';
    
    // Check if it's already a full URL (http/https)
    if (source.startsWith('http://') || source.startsWith('https://')) {
      return source;
    }
    
    // Check if it's a data URL
    if (source.startsWith('data:')) {
      return source;
    }
    
    // Check if it's a blob URL
    if (source.startsWith('blob:')) {
      return source;
    }
    
    // For local files, ensure they start with /
    if (!source.startsWith('/')) {
      return `/${source}`;
    }
    
    return source;
  };

  // Validate if URL is accessible (for external URLs only)
  const isValidImageUrl = (url) => {
    if (!url) return false;
    
    // For local files, assume they're valid
    if (!url.startsWith('http')) return true;
    
    // For external URLs, check if they end with image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    return hasImageExtension;
  };

  const getFallbackImage = () => {
    // Enhanced fallback image generation
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    ];
    
    const titleWords = title ? title.split(' ') : ['Book'];
    const initials = titleWords.map(word => word[0]).join('').toUpperCase().slice(0, 2);
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    // Generate deterministic color based on title for consistency
    const hash = title ? title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) : 0;
    const gradientIndex = Math.abs(hash) % gradients.length;
    const selectedGradient = gradients[gradientIndex];
    
    const svgString = `
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill="url(#grad1)"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="42" font-weight="bold"
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${initials}
        </text>
        <text x="100" y="180" font-family="Arial, sans-serif" font-size="14" 
              fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">
          ${(title || 'Chưa có tên').slice(0, 20)}
        </text>
        <text x="100" y="270" font-family="Arial, sans-serif" font-size="12" 
              fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">
          Ảnh bìa không có
        </text>
      </svg>
    `;
    
    try {
      const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
      return `data:image/svg+xml;base64,${encodedSvg}`;
    } catch (error) {
      console.warn('Failed to generate fallback image:', error);
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzk5OTk5OSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5CPC90ZXh0Pjx0ZXh0IHg9IjEwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Cb29rPC90ZXh0Pjwvc3ZnPg==';
    }
  };

  return (
    <div className={`book-cover ${className} ${isLoading ? 'loading' : ''} ${imageError ? 'error' : ''}`}>
      {isLoading && (
        <div className="book-cover-skeleton">
          <div className="skeleton-animation"></div>
          <div className="skeleton-text">Đang tải ảnh...</div>
        </div>
      )}
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && imageSrc && (
        <div className="debug-info" title={`Image source: ${imageSrc}`}>
          {imageSrc.startsWith('http') ? '🌐' : imageSrc.startsWith('data:') ? '📊' : '📁'}
        </div>
      )}
      
      <img
        src={imageError ? getFallbackImage() : (imageSrc || getFallbackImage())}
        alt={alt || title || 'Book Cover'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`book-cover-image ${imageError ? 'fallback' : ''} ${imageSrc ? 'has-source' : 'no-source'}`}
        style={{ display: isLoading ? 'none' : 'block' }}
        loading="lazy" // Add lazy loading for performance
      />
      
      {/* Error indicator */}
      {imageError && !isLoading && (
        <div className="error-indicator" title="Không thể tải ảnh bìa">
          ⚠️
        </div>
      )}
    </div>
  );
};

export default BookCover; 