const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Lấy session ID từ localStorage hoặc tạo mới
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Lấy customer ID từ localStorage
const getCustomerId = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.id;
  }
  return null;
};

export const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    const queryParam = customerId ? `customerId=${customerId}` : `sessionId=${sessionId}`;
    
    const response = await fetch(`${API_URL}/api/cart?${queryParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    return result;
  },

  // Thêm item vào giỏ hàng
  addItem: async (productId, productVariantId, quantity) => {
    try {
      const customerId = getCustomerId();
      const sessionId = getSessionId();
      const queryParam = customerId ? `customerId=${customerId}` : `sessionId=${sessionId}`;
      
      const response = await fetch(`${API_URL}/api/cart/items?${queryParam}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productVariantId: productVariantId || null,
          quantity,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }));
        return {
          status: response.status,
          message: errorData.message || 'Lỗi khi thêm vào giỏ hàng',
          data: null
        };
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return {
        status: 500,
        message: error.message || 'Không thể kết nối đến server',
        data: null
      };
    }
  },

  // Cập nhật số lượng item
  updateItem: async (itemId, quantity) => {
    const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    
    const result = await response.json();
    return result;
  },

  // Xóa item khỏi giỏ hàng
  removeItem: async (itemId) => {
    const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    return result;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    const queryParam = customerId ? `customerId=${customerId}` : `sessionId=${sessionId}`;
    
    const response = await fetch(`${API_URL}/api/cart?${queryParam}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    return result;
  },
};

