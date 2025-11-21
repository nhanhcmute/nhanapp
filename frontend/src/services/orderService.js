const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getCustomerId = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.id;
  }
  return null;
};

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const orderService = {
  // Tạo đơn hàng
  createOrder: async (orderData) => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    const queryParam = customerId ? `customerId=${customerId}` : `sessionId=${sessionId}`;
    
    const response = await fetch(`${API_URL}/api/orders?${queryParam}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    return result;
  },

  // Lấy danh sách đơn hàng của customer
  getOrders: async (page = 1, pageSize = 10) => {
    const customerId = getCustomerId();
    if (!customerId) {
      return { status: 400, message: 'Customer ID is required', data: null };
    }
    
    const response = await fetch(`${API_URL}/api/orders?customerId=${customerId}&page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    return result;
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (orderId) => {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    return result;
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    const customerId = getCustomerId();
    const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel?customerId=${customerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    return result;
  },
};

