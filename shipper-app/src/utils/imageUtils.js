/**
 * Utility functions for handling images in shipper app
 * Supports base64, URLs, and local assets
 */

/**
 * Get image source from various formats (base64, URL, file path)
 * @param {string} imageData - Image data (base64, URL, or file path)
 * @returns {string|null} Image source URI or null
 */
export const getImageSrc = (imageData) => {
  // Handle null, undefined, or empty string
  if (!imageData || (typeof imageData === 'string' && imageData.trim() === '')) {
    return null;
  }

  // If it's an object, try to extract image property
  if (typeof imageData === 'object' && imageData !== null) {
    if (imageData.image && imageData.image !== '') return getImageSrc(imageData.image);
    if (imageData.Image && imageData.Image !== '') return getImageSrc(imageData.Image);
    if (imageData.imageData && imageData.imageData !== '') return getImageSrc(imageData.imageData);
    if (imageData.image_data && imageData.image_data !== '') return getImageSrc(imageData.image_data);
    return null;
  }

  // If it's a string
  if (typeof imageData === 'string') {
    const trimmed = imageData.trim();
    if (!trimmed) return null;

    // 1. If already has data:image prefix, use directly
    if (trimmed.startsWith('data:image/')) {
      return trimmed;
    }

    // 2. If it's a base64 string without prefix (heuristic check)
    // Base64 strings are typically longer and contain only base64 characters
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    const isBase64String = base64Regex.test(trimmed) && trimmed.length > 50;
    
    if (isBase64String) {
      // Detect MIME type from base64 content
      let mimeType = 'image/jpeg'; // Default
      
      // Check for common base64 patterns
      if (trimmed.startsWith('/9j/') || trimmed.startsWith('i/9j/') || trimmed.startsWith('iVBORw0KGgoAAAANSUhEUg')) {
        mimeType = 'image/jpeg';
      } else if (trimmed.startsWith('iVBORw0KGgo') || trimmed.startsWith('iVBOR')) {
        mimeType = 'image/png';
      } else if (trimmed.startsWith('R0lGOD')) {
        mimeType = 'image/gif';
      } else if (trimmed.startsWith('UklGR')) {
        mimeType = 'image/webp';
      } else if (trimmed.startsWith('PHN2Zy') || trimmed.startsWith('PD94bW')) {
        mimeType = 'image/svg+xml';
      }
      
      return `data:${mimeType};base64,${trimmed}`;
    }

    // 3. If it's a URL (http/https)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // 4. If it's a relative path starting with /, convert to full URL
    if (trimmed.startsWith('/')) {
      return `${BASE_URL}${trimmed}`;
    }

    // 5. If it looks like a file name (e.g., "sp2.jpg", "product.png")
    // Try to construct URL from backend
    // Check if it's a file extension
    const fileExtensionPattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (fileExtensionPattern.test(trimmed)) {
      // Try to get from backend static files or product API
      // For now, return null and let the component fetch from product API
      return null; // Will be handled by fetching product detail
    }

    // 6. If it's a relative path, try to construct URL
    return `${BASE_URL}/${trimmed}`;
  }

  return null;
};

/**
 * Get product image source
 * @param {object} product - Product object
 * @returns {string} Image source URI
 */
export const getProductImageSrc = (product) => {
  if (!product) return null;
  
  const imageSource = product.image || product.Image || product.imageData;
  return getImageSrc(imageSource);
};

