/**
 * Centralized API Configuration
 * Auto-detects environment and returns appropriate API base URL
 */

// Kiểm tra môi trường
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

/**
 * Lấy API base URL dựa trên môi trường
 * @returns {string} API base URL
 */
export const getApiUrl = () => {
  // 1. Ưu tiên environment variable (nếu có set trong .env)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 2. Nếu đang chạy local
  if (isLocalhost || isDevelopment) {
    return 'http://localhost:5000';
  }

  // 3. Production URL
  return 'https://petshop-a2ry.onrender.com';
};

/**
 * API base URL - Sử dụng biến này trong toàn bộ app
 */
export const API_URL = getApiUrl();

/**
 * API endpoints - Định nghĩa các endpoint thường dùng
 */
export const API_ENDPOINTS = {
  // User/Auth
  LOGIN: '/user.ctr/login',
  SIGNUP: '/user.ctr/signup',
  VERIFY_OTP: '/user.ctr/verify_otp',
  SEND_OTP: '/user.ctr/send_otp',
  RESET_PASSWORD: '/user.ctr/reset_password',

  // Products
  PRODUCTS_GET_ALL: '/product.ctr/get_all',
  PRODUCTS_GET_BY_ID: '/product.ctr/get_by_id',
  PRODUCTS_SEARCH: '/product.ctr/search',
  PRODUCTS_CREATE: '/product.ctr/create',
  PRODUCTS_UPDATE: '/product.ctr/update',
  PRODUCTS_DELETE: '/product.ctr/delete',
  PRODUCTS_GET_PAGED: '/product.ctr/get_paged',

  // Orders
  ORDERS_GET_ALL: '/api/orders',
  ORDERS_GET_BY_ID: (id) => `/api/orders/${id}`,
  ORDERS_CREATE: '/api/orders',
  ORDERS_UPDATE_STATUS: (id) => `/api/orders/${id}/status`,

  // Shipper
  SHIPPER_AVAILABLE_ORDERS: '/api/shipper/orders/available',
  SHIPPER_MY_ORDERS: '/api/shipper/orders/my-orders',
  SHIPPER_ACCEPT_ORDER: (id) => `/api/shipper/orders/${id}/accept`,
  SHIPPER_COMPLETE_ORDER: (id) => `/api/shipper/orders/${id}/complete`,
  SHIPPER_FAIL_ORDER: (id) => `/api/shipper/orders/${id}/fail`,
};

/**
 * Helper function để tạo full URL
 * @param {string} endpoint - API endpoint
 * @returns {string} Full URL
 */
export const getFullUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

/**
 * Log API configuration (chỉ trong development)
 */
if (isDevelopment) {
  console.log('🌐 API Configuration:', {
    environment: process.env.NODE_ENV,
    apiUrl: API_URL,
    isLocalhost,
    isDevelopment
  });
}

export default {
  API_URL,
  API_ENDPOINTS,
  getApiUrl,
  getFullUrl
};
