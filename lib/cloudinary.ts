export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low' | string;
  crop?: 'limit' | 'fill' | 'thumb' | 'scale' | 'fit';
}

/**
 * Cloudinary responsive image transformer.
 * Automatically injects WebP/AVIF auto-format and sensible compression.
 * Falls back safely to placeholder or unmodified URL for non-Cloudinary images (e.g. Unsplash, absolute paths).
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string | null | undefined,
  options?: ImageOptimizationOptions
): string {
  if (!publicIdOrUrl) {
    return '/images/placeholder-grocery.png';
  }

  // Handle Unsplash image URL optimization
  if (publicIdOrUrl.includes('images.unsplash.com')) {
    const width = options?.width || 600;
    const url = new URL(publicIdOrUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('q', '80');
    return url.toString();
  }

  // Handle Cloudinary URLs
  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    const width = options?.width || 600;
    const height = options?.height;
    const quality = options?.quality || 'auto';
    const crop = options?.crop || 'limit';

    let transformations = `f_auto,q_${quality},c_${crop},w_${width}`;
    if (height) {
      transformations += `,h_${height}`;
    }

    return publicIdOrUrl.replace('/upload/', `/upload/${transformations}/`);
  }

  return publicIdOrUrl;
}
