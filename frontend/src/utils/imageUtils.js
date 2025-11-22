/**
 * Utility function để xử lý image từ nhiều nguồn khác nhau
 * Hỗ trợ: base64, URL, file path từ assets, và default image
 * 
 * @param {string|undefined|null} imageValue - Giá trị image (có thể là base64, URL, hoặc file name)
 * @param {Object} imagesMap - Object chứa các image đã import từ thư mục assets (optional)
 * @param {string} defaultImage - Đường dẫn default image (default: '/default-product.jpg')
 * @returns {string} - URL của image để hiển thị
 */
export const getImageSrc = (imageValue, imagesMap = null, defaultImage = '/default-product.jpg') => {
  // Nếu không có image value, trả về default
  if (!imageValue) {
    return defaultImage;
  }

  // Kiểm tra nếu là string
  if (typeof imageValue !== 'string') {
    return defaultImage;
  }

  // 1. Nếu đã có data:image prefix (base64 với prefix) thì dùng trực tiếp
  if (imageValue.startsWith('data:image/')) {
    return imageValue;
  }

  // 2. Nếu là URL (http/https) thì dùng trực tiếp
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
    return imageValue;
  }

  // 3. Kiểm tra nếu là base64 string thuần (không có prefix)
  // Base64 thường có độ dài > 50 và chỉ chứa các ký tự base64
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  const isBase64String = base64Regex.test(imageValue) && imageValue.length > 50;

  if (isBase64String) {
    // Xác định format dựa trên magic bytes
    let mimeType = 'image/jpeg'; // Default
    
    // JPEG: bắt đầu bằng /9j/ hoặc i/9j/
    if (imageValue.startsWith('/9j/') || imageValue.startsWith('i/9j/')) {
      mimeType = 'image/jpeg';
    }
    // PNG: bắt đầu bằng iVBORw0KGgo hoặc iVBOR
    else if (imageValue.startsWith('iVBORw0KGgo') || imageValue.startsWith('iVBOR')) {
      mimeType = 'image/png';
    }
    // GIF: bắt đầu bằng R0lGOD
    else if (imageValue.startsWith('R0lGOD')) {
      mimeType = 'image/gif';
    }
    // WebP: bắt đầu bằng UklGR
    else if (imageValue.startsWith('UklGR')) {
      mimeType = 'image/webp';
    }
    // SVG: bắt đầu bằng PHN2Zy hoặc <svg
    else if (imageValue.startsWith('PHN2Zy') || imageValue.startsWith('<svg')) {
      mimeType = 'image/svg+xml';
    }
    
    return `data:${mimeType};base64,${imageValue}`;
  }

  // 4. Nếu có imagesMap (từ import assets), tìm trong đó
  if (imagesMap && typeof imagesMap === 'object') {
    if (imagesMap[imageValue]) {
      return imagesMap[imageValue];
    }
  }

  // 5. Nếu là relative path (bắt đầu bằng /)
  if (imageValue.startsWith('/')) {
    return imageValue;
  }

  // 6. Fallback: thử dùng như relative path từ assets
  // (nếu không tìm thấy trong imagesMap)
  const possiblePaths = [
    `/assets/images/products/${imageValue}`,
    `/images/${imageValue}`,
    `/${imageValue}`
  ];

  // Trả về path đầu tiên hoặc default
  return possiblePaths[0] || defaultImage;
};

/**
 * Helper function để lấy image từ product object
 * Tự động kiểm tra cả 'image' và 'Image' field
 * 
 * @param {Object} product - Product object
 * @param {Object} imagesMap - Object chứa các image đã import từ thư mục assets (optional)
 * @param {string} defaultImage - Đường dẫn default image (default: '/default-product.jpg')
 * @returns {string} - URL của image để hiển thị
 */
export const getProductImageSrc = (product, imagesMap = null, defaultImage = '/default-product.jpg') => {
  if (!product) {
    return defaultImage;
  }

  // Thử lấy từ các field có thể có
  const imageValue = product.image || product.Image || product.imageData || product.image_data;
  
  return getImageSrc(imageValue, imagesMap, defaultImage);
};

/**
 * Helper function để lấy image từ pet object (cat/dog)
 * 
 * @param {Object} pet - Pet object (cat hoặc dog)
 * @param {string} defaultImage - Đường dẫn default image
 * @returns {string} - URL của image để hiển thị
 */
export const getPetImageSrc = (pet, defaultImage = '/placeholder-pet.jpg') => {
  if (!pet) {
    return defaultImage;
  }

  // Thử lấy từ các field có thể có
  const imageValue = pet.image || pet.Image || pet.imageData || pet.image_data;
  
  return getImageSrc(imageValue, null, defaultImage);
};

