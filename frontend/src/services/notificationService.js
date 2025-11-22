import client from "../config/api";

const notificationService = {
  // Lấy danh sách thông báo
  getNotifications: async (userId, page = 1, pageSize = 10) => {
    try {
      const response = await client.get(`/notifications`, {
        params: { userId, page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadCount: async (userId) => {
    try {
      const response = await client.get(`/notifications/unread-count`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu đã đọc 1 thông báo
  markAsRead: async (id) => {
    try {
      const response = await client.post(`/notifications/${id}/mark-read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu đã đọc tất cả
  markAllAsRead: async (userId) => {
    try {
      const response = await client.post(`/notifications/mark-all-read`, userId, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationService;
