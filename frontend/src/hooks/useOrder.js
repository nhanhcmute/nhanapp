import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map order status từ enum (số hoặc string) sang tiếng Việt
  const mapOrderStatus = (status) => {
    // Nếu là số (enum value), map từ số sang enum string trước
    let statusKey = status;
    if (typeof status === 'number' || (typeof status === 'string' && /^\d+$/.test(status))) {
      const enumMap = {
        0: 'PENDING_PAYMENT',
        1: 'PENDING_CONFIRM',
        2: 'PAID',
        3: 'PROCESSING',
        4: 'SHIPPING',
        5: 'COMPLETED',
        6: 'CANCELLED',
        7: 'PAYMENT_FAILED',
      };
      statusKey = enumMap[parseInt(status)] || status;
    }
    
    const statusMap = {
      'PENDING_PAYMENT': 'Chờ thanh toán',
      'PENDING_CONFIRM': 'Chờ xác nhận',
      'PAID': 'Chờ lấy hàng',
      'PROCESSING': 'Chờ lấy hàng',
      'SHIPPING': 'Chờ giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã Hủy',
      'PAYMENT_FAILED': 'Thanh toán thất bại',
    };
    return statusMap[statusKey] || status;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await orderService.getOrders(1, 100); // Lấy 100 đơn hàng đầu tiên
      
      if (result.status === 200 && result.data) {
        // Chuyển đổi từ API response sang format cũ để tương thích
        const ordersData = result.data.data || [];
        const formattedOrders = ordersData.map(order => ({
          id: order.id,
          orderCode: order.orderCode,
          status: mapOrderStatus(order.status),
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          products: [], // Sẽ được load từ order items nếu cần
          details: `${order.orderCode} - ${order.shippingFullName}`,
        }));
        setOrders(formattedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err);
      console.error('Lỗi khi tải dữ liệu đơn hàng:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Refresh dữ liệu mỗi 30 giây để cập nhật status mới nhất
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, []);

  return { orders, loading, error, refreshOrders: fetchOrders };
};

export default useOrders;
