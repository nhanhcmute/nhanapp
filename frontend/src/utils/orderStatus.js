// Danh sách trạng thái dùng cho các bộ lọc/dropdown hiển thị đơn hàng
export const ORDER_STATUS_FILTERS = [
  { id: 1, status: 'Tất Cả' },
  { id: 2, status: 'Chờ xác nhận' },
  { id: 3, status: 'Chờ lấy hàng' },
  { id: 4, status: 'Chờ giao hàng' },
  { id: 5, status: 'Hoàn thành' },
  { id: 6, status: 'Đã Hủy' },
  { id: 7, status: 'Trả hàng/Hoàn tiền' },
];

// Map order status từ enum (số hoặc string) sang tiếng Việt
export const mapOrderStatus = (status) => {
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
