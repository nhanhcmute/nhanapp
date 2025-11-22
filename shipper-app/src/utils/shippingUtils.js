/**
 * Utility functions for calculating shipping fees for shipper app
 */

/**
 * Tính phí vận chuyển dựa trên phương thức vận chuyển và các yếu tố khác
 * @param {string} shippingMethod - Phương thức vận chuyển: 'standard' hoặc 'express'
 * @param {Object} options - Các tùy chọn bổ sung
 * @param {number} options.distance - Khoảng cách (km) - tùy chọn
 * @param {number} options.weight - Trọng lượng (kg) - tùy chọn
 * @param {number} options.totalAmount - Tổng giá trị đơn hàng - tùy chọn (để tính miễn phí ship)
 * @param {number} options.freeShippingThreshold - Ngưỡng miễn phí ship (VND) - tùy chọn
 * @returns {number} Phí vận chuyển (VND)
 */
export const calculateShippingFee = (shippingMethod = 'standard', options = {}) => {
  const {
    distance = null,
    weight = null,
    totalAmount = 0,
    freeShippingThreshold = 500000, // Miễn phí ship nếu đơn hàng >= 500,000 VND
  } = options;

  // Kiểm tra miễn phí ship nếu đơn hàng đạt ngưỡng
  if (totalAmount >= freeShippingThreshold) {
    return 0;
  }

  // Phí cơ bản theo phương thức vận chuyển
  const baseFees = {
    standard: 20000, // 20,000 VND cho giao hàng tiêu chuẩn
    express: 50000,  // 50,000 VND cho giao hàng nhanh
  };

  let fee = baseFees[shippingMethod] || baseFees.standard;

  // Tính phí dựa trên khoảng cách (nếu có)
  if (distance !== null && distance > 0) {
    const distanceFee = calculateDistanceFee(distance, shippingMethod);
    fee += distanceFee;
  }

  // Tính phí dựa trên trọng lượng (nếu có)
  if (weight !== null && weight > 0) {
    const weightFee = calculateWeightFee(weight, shippingMethod);
    fee += weightFee;
  }

  return Math.round(fee);
};

/**
 * Tính phí vận chuyển dựa trên khoảng cách
 * @param {number} distance - Khoảng cách (km)
 * @param {string} shippingMethod - Phương thức vận chuyển
 * @returns {number} Phí bổ sung dựa trên khoảng cách (VND)
 */
const calculateDistanceFee = (distance, shippingMethod) => {
  // Phí cho mỗi km
  const feePerKm = {
    standard: 2000,  // 2,000 VND/km cho giao hàng tiêu chuẩn
    express: 5000,   // 5,000 VND/km cho giao hàng nhanh
  };

  const rate = feePerKm[shippingMethod] || feePerKm.standard;
  
  // Miễn phí cho 5km đầu tiên
  const freeDistance = 5;
  if (distance <= freeDistance) {
    return 0;
  }

  // Tính phí cho phần khoảng cách vượt quá 5km
  const extraDistance = distance - freeDistance;
  return extraDistance * rate;
};

/**
 * Tính phí vận chuyển dựa trên trọng lượng
 * @param {number} weight - Trọng lượng (kg)
 * @param {string} shippingMethod - Phương thức vận chuyển
 * @returns {number} Phí bổ sung dựa trên trọng lượng (VND)
 */
const calculateWeightFee = (weight, shippingMethod) => {
  // Phí cho mỗi kg
  const feePerKg = {
    standard: 5000,  // 5,000 VND/kg cho giao hàng tiêu chuẩn
    express: 10000,  // 10,000 VND/kg cho giao hàng nhanh
  };

  const rate = feePerKg[shippingMethod] || feePerKg.standard;
  
  // Miễn phí cho 2kg đầu tiên
  const freeWeight = 2;
  if (weight <= freeWeight) {
    return 0;
  }

  // Tính phí cho phần trọng lượng vượt quá 2kg
  const extraWeight = weight - freeWeight;
  return extraWeight * rate;
};

/**
 * Tính khoảng cách giữa 2 điểm dựa trên tọa độ (Haversine formula)
 * @param {number} lat1 - Vĩ độ điểm 1
 * @param {number} lon1 - Kinh độ điểm 1
 * @param {number} lat2 - Vĩ độ điểm 2
 * @param {number} lon2 - Kinh độ điểm 2
 * @returns {number} Khoảng cách (km)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Làm tròn 2 chữ số thập phân
};

/**
 * Chuyển đổi độ sang radian
 */
const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Tính phí ship cho đơn hàng dựa trên thông tin đơn hàng
 * @param {Object} order - Đối tượng đơn hàng
 * @param {Array} items - Danh sách sản phẩm trong đơn hàng
 * @returns {number} Phí vận chuyển (VND)
 */
export const calculateOrderShippingFee = (order, items = []) => {
  if (!order) return 0;

  // Lấy phương thức vận chuyển từ đơn hàng
  const shippingMethodId = order.shippingMethodId || order.shipping_method_id || 'standard';
  const shippingMethod = shippingMethodId === 'express' ? 'express' : 'standard';

  // Tính tổng trọng lượng từ items
  const totalWeight = items.reduce((sum, item) => {
    const weight = item.weight || 0.5; // Mặc định 0.5kg/sản phẩm
    const quantity = item.quantity || item.Quantity || 1;
    return sum + (weight * quantity);
  }, 0);

  // Lấy tổng giá trị đơn hàng
  const totalAmount = order.totalAmount || order.total_amount || order.subtotalAmount || order.subtotal_amount || 0;

  // Tính phí ship (không tính khoảng cách vì cần tọa độ)
  return calculateShippingFee(shippingMethod, {
    weight: totalWeight,
    totalAmount: totalAmount,
    freeShippingThreshold: 500000,
  });
};

