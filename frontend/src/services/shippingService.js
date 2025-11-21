const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const shippingService = {
  // Lấy danh sách phương thức vận chuyển
  getShippingMethods: async () => {
    const response = await fetch(`${API_URL}/api/shipping-methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },
};

