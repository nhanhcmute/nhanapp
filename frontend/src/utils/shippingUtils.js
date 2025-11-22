/**
 * Utility functions for calculating shipping fees
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
 * Lấy tọa độ từ địa chỉ (sử dụng geocoding API)
 * @param {string} address - Địa chỉ đầy đủ
 * @param {number} retries - Số lần thử lại (mặc định: 3)
 * @returns {Promise<{lat: number, lon: number} | null>} Tọa độ hoặc null nếu không tìm thấy
 */
export const getCoordinatesFromAddress = async (address, retries = 3) => {
  if (!address || address.trim() === '') {
    return null;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Thêm delay giữa các request để tránh rate limit (1 giây cho lần đầu, tăng dần)
      if (attempt > 1) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }

      // Sử dụng OpenStreetMap Nominatim API (miễn phí)
      // Thêm viewbox để giới hạn tìm kiếm và tăng độ chính xác
      // viewbox format: minlon,minlat,maxlon,maxlat (Việt Nam: 102.0,8.0,110.0,24.0)
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&addressdetails=1&countrycodes=vn&viewbox=102.0,8.0,110.0,24.0&bounded=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ECommerceApp/1.0', // Required by Nominatim
          'Accept-Language': 'vi,en',
        },
        method: 'GET',
      });

      // Kiểm tra status code
      if (!response.ok) {
        console.warn(`Geocoding attempt ${attempt} failed with status ${response.status}`);
        if (attempt < retries) continue;
        return null;
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Ưu tiên kết quả có type là "house", "building", "residential" hoặc có số nhà
        // Nếu không có, lấy kết quả đầu tiên (có thể là trung tâm phường/xã)
        let bestResult = data[0];
        
        for (const result of data) {
          const type = result.type?.toLowerCase() || '';
          const displayName = result.display_name?.toLowerCase() || '';
          
          // Ưu tiên kết quả có số nhà hoặc là building/house
          if (type.includes('house') || type.includes('building') || type.includes('residential') ||
              displayName.match(/\d+/)) { // Có số trong địa chỉ
            bestResult = result;
            console.log(`Found more accurate result: ${result.display_name} (type: ${result.type})`);
            break;
          }
        }
        
        return {
          lat: parseFloat(bestResult.lat),
          lon: parseFloat(bestResult.lon),
          displayName: bestResult.display_name,
          type: bestResult.type,
          importance: bestResult.importance, // Độ quan trọng/chính xác (0-1)
        };
      }
      
      // Nếu không tìm thấy và còn retry, thử lại
      if (attempt < retries) {
        console.warn(`Geocoding attempt ${attempt}: No results found for "${address}", retrying...`);
        continue;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting coordinates (attempt ${attempt}/${retries}):`, error);
      
      // Nếu là lỗi network và còn retry, thử lại
      if (attempt < retries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        continue;
      }
      
      return null;
    }
  }
  
  return null;
};

/**
 * Tính phí ship với địa chỉ đầy đủ (tự động tính khoảng cách)
 * @param {string} shippingMethod - Phương thức vận chuyển
 * @param {string} deliveryAddress - Địa chỉ giao hàng đầy đủ
 * @param {Object} options - Các tùy chọn bổ sung
 * @returns {Promise<number>} Phí vận chuyển (VND)
 */
export const calculateShippingFeeWithAddress = async (
  shippingMethod = 'standard',
  deliveryAddress = '',
  options = {}
) => {
  const { weight = null, totalAmount = 0, freeShippingThreshold = 500000 } = options;

  // Nếu có địa chỉ, thử tính khoảng cách
  let distance = null;
  if (deliveryAddress) {
    // Tọa độ kho hàng mặc định (có thể lấy từ config)
    const warehouseCoords = {
      lat: 10.762622, // Ví dụ: TP.HCM
      lon: 106.660172,
    };

    const deliveryCoords = await getCoordinatesFromAddress(deliveryAddress);
    
    if (deliveryCoords) {
      distance = calculateDistance(
        warehouseCoords.lat,
        warehouseCoords.lon,
        deliveryCoords.lat,
        deliveryCoords.lon
      );
    }
  }

  return calculateShippingFee(shippingMethod, {
    distance,
    weight,
    totalAmount,
    freeShippingThreshold,
  });
};

