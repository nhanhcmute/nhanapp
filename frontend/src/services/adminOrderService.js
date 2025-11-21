const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getAdminUserId = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.id;
  }
  return null;
};

export const adminOrderService = {
  // Lấy danh sách đơn hàng (Admin)
  getOrders: async (filters = {}) => {
    const {
      page = 1,
      pageSize = 10,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      keyword,
    } = filters;

    let queryParams = `page=${page}&pageSize=${pageSize}`;
    if (status) queryParams += `&status=${status}`;
    if (paymentStatus) queryParams += `&paymentStatus=${paymentStatus}`;
    if (dateFrom) queryParams += `&dateFrom=${dateFrom}`;
    if (dateTo) queryParams += `&dateTo=${dateTo}`;
    if (keyword) queryParams += `&keyword=${keyword}`;

    const response = await fetch(`${API_URL}/api/admin/orders?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },

  // Lấy chi tiết đơn hàng (Admin)
  getOrderDetail: async (orderId) => {
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },

  // Cập nhật đơn hàng (Admin)
  updateOrder: async (orderId, updateData) => {
    const adminUserId = getAdminUserId();
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}?adminUserId=${adminUserId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    return result;
  },

  // Xác nhận đơn hàng (Admin)
  confirmOrder: async (orderId) => {
    const adminUserId = getAdminUserId();
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/confirm?adminUserId=${adminUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },

  // Cập nhật shipping (Admin)
  shipOrder: async (orderId) => {
    const adminUserId = getAdminUserId();
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/ship?adminUserId=${adminUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },

  // Hoàn tất đơn hàng (Admin)
  completeOrder: async (orderId) => {
    const adminUserId = getAdminUserId();
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/complete?adminUserId=${adminUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },

  // Hoàn trả đơn hàng (Admin)
  refundOrder: async (orderId, note) => {
    const adminUserId = getAdminUserId();
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/refund?adminUserId=${adminUserId}&note=${encodeURIComponent(note || '')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  },
};

