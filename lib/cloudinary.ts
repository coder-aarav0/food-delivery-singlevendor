export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low' | string;
  crop?: 'limit' | 'fill' | 'thumb' | 'scale' | 'fit';
  gravity?: 'auto' | 'face' | 'center' | string;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
}

/**
 * Cloudinary & Unsplash responsive image transformer.
 * Idempotently injects WebP/AVIF auto-format and responsive dimensions.
 * Strips previous transformations to prevent duplicate URL injection bugs.
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string | null | undefined,
  options?: ImageOptimizationOptions
): string {
  if (!publicIdOrUrl) {
    return '/images/placeholder-grocery.png';
  }

  const width = options?.width || 600;
  const height = options?.height;
  const quality = options?.quality || 'auto';
  const crop = options?.crop || 'limit';
  const gravity = options?.gravity || (crop === 'fill' || crop === 'thumb' ? 'auto' : undefined);
  const format = options?.format || 'auto';

  // 1. Handle Unsplash image URL optimization
  if (publicIdOrUrl.includes('images.unsplash.com')) {
    try {
      const url = new URL(publicIdOrUrl);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', crop === 'fill' ? 'crop' : 'max');
      url.searchParams.set('q', quality === 'auto' ? '80' : quality);
      if (height) url.searchParams.set('h', height.toString());
      return url.toString();
    } catch {
      return publicIdOrUrl;
    }
  }

  // 2. Handle Cloudinary URLs with Idempotent Transformation Injection
  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    const parts = [`f_${format}`, `q_${quality}`, `c_${crop}`, `w_${width}`];
    if (height) parts.push(`h_${height}`);
    if (gravity) parts.push(`g_${gravity}`);
    const transformString = parts.join(',');

    // Match /upload/ followed by optional existing transformations, then /v[0-9]+/ or directly public ID
    const uploadIndex = publicIdOrUrl.indexOf('/upload/');
    if (uploadIndex === -1) return publicIdOrUrl;

    const prefix = publicIdOrUrl.substring(0, uploadIndex + '/upload/'.length);
    const suffix = publicIdOrUrl.substring(uploadIndex + '/upload/'.length);

    // If suffix already has transformations (does not start with 'v' followed by digits), strip them
    const cleanSuffix = suffix.replace(/^(?:[a-z]_[a-z0-9_]+,?)+\//i, '');

    return `${prefix}${transformString}/${cleanSuffix}`;
  }

  return publicIdOrUrl;
}

/**
 * Generates an HTML5 / Next.js compatible responsive srcSet string.
 */
export function generateImageSrcSet(
  url: string,
  widths: number[] = [320, 480, 640, 800, 1024],
  options?: Omit<ImageOptimizationOptions, 'width'>
): string {
  if (!url) return '';
  return widths
    .map((w) => `${getOptimizedImageUrl(url, { ...options, width: w })} ${w}w`)
    .join(', ');
}
