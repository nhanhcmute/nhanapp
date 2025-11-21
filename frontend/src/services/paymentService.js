const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const paymentService = {
  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async () => {
    const response = await fetch(`${API_URL}/api/payments/payment-methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },

  // Khởi tạo thanh toán
  initPayment: async (orderId, paymentMethod) => {
    const response = await fetch(`${API_URL}/api/payments/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentMethod,
      }),
    });

    const result = await response.json();
    return result;
  },

  // Lấy trạng thái thanh toán
  getPaymentStatus: async (paymentId) => {
    const response = await fetch(`${API_URL}/api/payments/${paymentId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },
};

