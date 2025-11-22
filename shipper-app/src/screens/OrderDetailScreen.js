import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking, Image } from 'react-native';
import client from '../api/client';
import { getImageSrc } from '../utils/imageUtils';
import { calculateOrderShippingFee } from '../utils/shippingUtils';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState({}); // Cache product images

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) {
      console.error('OrderDetailScreen: orderId is missing');
      Alert.alert('Lỗi', 'Không tìm thấy ID đơn hàng');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching order detail for orderId:', orderId);
      const response = await client.get(`/api/orders/${orderId}`);
      console.log('Order detail response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.status === 200 && response.data.data) {
        const orderData = response.data.data.Order || response.data.data.order || response.data.data;
        const itemsData = response.data.data.Items || response.data.data.items || [];
        
        console.log('Order data:', JSON.stringify(orderData, null, 2));
        console.log('Items data:', JSON.stringify(itemsData, null, 2));
        
        // Log từng item để debug image
        itemsData.forEach((item, idx) => {
          console.log(`Item ${idx}:`, {
            productName: item.productName || item.ProductName,
            image: item.image || item.Image,
            imageData: item.imageData || item.image_data,
            allKeys: Object.keys(item)
          });
        });
        
        setOrder(orderData);
        setItems(itemsData);
        
        // Fetch product images nếu items có image là file name
        const fetchProductImages = async () => {
          const imageMap = {};
          const promises = [];
          
          for (const item of itemsData) {
            const productId = item.productId || item.ProductId;
            const imageData = item.image || item.Image;
            
            // Nếu image là file name (không phải URL hoặc base64), fetch từ product API
            if (productId && imageData && 
                !imageData.startsWith('http') && 
                !imageData.startsWith('https') &&
                !imageData.startsWith('data:image') && 
                imageData.includes('.')) {
              
              promises.push(
                client.post('/product.ctr/get_by_id', { id: productId })
                  .then(productResponse => {
                    if (productResponse.data.status === 200 && productResponse.data.data) {
                      const productImage = productResponse.data.data.image || productResponse.data.data.Image;
                      if (productImage && (productImage.startsWith('data:image') || productImage.startsWith('http'))) {
                        imageMap[productId] = productImage;
                        console.log(`Fetched image for product ${productId}:`, productImage.substring(0, 50));
                      }
                    }
                  })
                  .catch(error => {
                    console.error(`Error fetching product image for ${productId}:`, error);
                  })
              );
            }
          }
          
          await Promise.all(promises);
          
          if (Object.keys(imageMap).length > 0) {
            console.log('Product images fetched:', Object.keys(imageMap));
            setProductImages(imageMap);
          }
        };
        
        fetchProductImages();
      } else {
        console.log('Unexpected response structure:', response.data);
        Alert.alert('Lỗi', 'Không thể lấy thông tin đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error.response?.data || error.message);
      Alert.alert('Lỗi', `Không thể tải chi tiết đơn hàng: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    } else {
      console.error('OrderDetailScreen: orderId is missing in route.params');
      Alert.alert('Lỗi', 'Không tìm thấy ID đơn hàng');
      setLoading(false);
    }
  }, [orderId, fetchOrderDetail]);

  const callCustomer = () => {
    const phone = order?.shippingPhone || order?.shipping_phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy số điện thoại khách hàng');
    }
  };

  const openMap = () => {
    if (order) {
      const addressLine = order.shippingAddressLine || order.shipping_address_line || '';
      const ward = order.shippingWard || order.shipping_ward || '';
      const district = order.shippingDistrict || order.shipping_district || '';
      const city = order.shippingCity || order.shipping_city || '';
      const address = `${addressLine}, ${ward}, ${district}, ${city}`.trim();
      
      if (address) {
        // Sử dụng Google Maps Directions API để dẫn đường từ vị trí hiện tại
        // Google Maps sẽ tự động lấy vị trí hiện tại nếu có định vị bật
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        Linking.openURL(url).catch(err => {
          console.error('Error opening map:', err);
          Alert.alert('Lỗi', 'Không thể mở Google Maps. Vui lòng kiểm tra ứng dụng Google Maps đã được cài đặt chưa.');
        });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy địa chỉ giao hàng');
      }
    }
  };

  const startDelivery = () => {
    // Mở Google Maps với directions từ vị trí hiện tại đến địa chỉ giao hàng
    openMap();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const orderCode = order.orderCode || order.order_code;
  const orderStatus = order.status || order.Status;
  const shippingFullName = order.shippingFullName || order.shipping_full_name;
  const shippingPhone = order.shippingPhone || order.shipping_phone;
  const shippingAddressLine = order.shippingAddressLine || order.shipping_address_line;
  const shippingWard = order.shippingWard || order.shipping_ward;
  const shippingDistrict = order.shippingDistrict || order.shipping_district;
  const shippingCity = order.shippingCity || order.shipping_city;
  const subtotalAmount = order.subtotalAmount || order.subtotal_amount || 0;
  const discountAmount = order.discountAmount || order.discount_amount || 0;
  const totalAmount = order.totalAmount || order.total_amount || 0;
  const paymentMethod = order.paymentMethod || order.payment_method || 'N/A';
  const paymentStatus = order.paymentStatus || order.payment_status || 'N/A';
  
  // Tính phí ship cho shipper
  const calculatedShippingFee = calculateOrderShippingFee(order, items);
  const shippingFee = order.shippingFee || order.shipping_fee || calculatedShippingFee;
  
  const isShipping = orderStatus === 'SHIPPING' || orderStatus === 4 || orderStatus === '4';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.labelBold}>Mã đơn hàng:</Text>
          <Text style={styles.label}>{orderCode || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.labelBold}>Trạng thái:</Text>
          <Text style={styles.label}>
            {orderStatus === 'PROCESSING' || orderStatus === 3 || orderStatus === '3' ? 'Đang xử lý' :
             orderStatus === 'SHIPPING' || orderStatus === 4 || orderStatus === '4' ? 'Đang giao hàng' :
             orderStatus === 'PAID' || orderStatus === 2 || orderStatus === '2' ? 'Đã thanh toán' :
             orderStatus === 'COMPLETED' || orderStatus === 5 || orderStatus === '5' ? 'Đã hoàn thành' :
             orderStatus || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <View style={styles.infoRow}>
          <Text style={styles.labelBold}>Tên:</Text>
          <Text style={styles.label}>{shippingFullName || 'N/A'}</Text>
        </View>
        <TouchableOpacity onPress={callCustomer} style={styles.infoRow}>
          <Text style={styles.labelBold}>Số điện thoại:</Text>
          <Text style={[styles.label, styles.link]}>{shippingPhone || 'N/A'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMap} style={styles.infoRow}>
          <Text style={styles.labelBold}>Địa chỉ:</Text>
          <Text style={[styles.label, styles.link]}>{shippingAddressLine || ''}, {shippingWard || ''}, {shippingDistrict || ''}, {shippingCity || ''}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        {items.map((item, index) => {
          // API trả về image (chữ i thường) với giá trị là file name như "sp2.jpg"
          const productId = item.productId || item.ProductId;
          let imageData = item.Image || item.image || item.imageData || item.image_data;
          
          // Nếu image là file name và đã fetch được từ product API, dùng image từ product
          if (productId && productImages[productId]) {
            imageData = productImages[productId];
          }
          
          const imageSrc = getImageSrc(imageData, productId);
          
          // Log để debug
          console.log(`Item ${index} - Product: ${item.productName || item.ProductName}`);
          console.log(`  - ProductId:`, productId);
          console.log(`  - imageData:`, imageData ? (typeof imageData === 'string' ? imageData.substring(0, 50) : 'object') : 'null');
          console.log(`  - imageSrc:`, imageSrc ? (typeof imageSrc === 'string' ? imageSrc.substring(0, 50) : 'object') : 'null');
          
          return (
            <View key={index} style={styles.itemContainer}>
              {imageSrc ? (
                <Image 
                  source={{ uri: imageSrc }} 
                  style={styles.itemImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error(`Error loading image for item ${index}:`, error.nativeEvent?.error || error);
                    console.error(`Failed image src:`, imageSrc);
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image for item ${index}`);
                  }}
                />
              ) : (
                <View style={[styles.itemImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>📦</Text>
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName || item.ProductName}</Text>
                <Text style={styles.itemQuantity}>Số lượng: {item.quantity || item.Quantity}</Text>
                <Text style={styles.itemUnitPrice}>
                  Giá: {(item.unitPrice || item.UnitPrice || 0).toLocaleString('vi-VN')} VND
                </Text>
                <Text style={styles.itemPrice}>
                  Tổng: {(item.totalPrice || item.TotalPrice || 0).toLocaleString('vi-VN')} VND
                </Text>
              </View>
            </View>
          );
        })}
        {items.length === 0 && (
          <Text style={styles.emptyItemsText}>Chưa có sản phẩm trong đơn hàng</Text>
        )}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.labelBold}>Tạm tính:</Text>
          <Text style={styles.value}>{subtotalAmount.toLocaleString('vi-VN')} VND</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelBold}>Phí vận chuyển:</Text>
          <View style={styles.shippingFeeContainer}>
            <Text style={styles.value}>
              {shippingFee === 0 ? (
                <Text style={styles.freeShipping}>✅ Miễn phí</Text>
              ) : (
                `${shippingFee.toLocaleString('vi-VN')} VND`
              )}
            </Text>
            {calculatedShippingFee !== shippingFee && (
              <Text style={styles.calculatedFee}>
                (Tính toán: {calculatedShippingFee.toLocaleString('vi-VN')} VND)
              </Text>
            )}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelBold}>Giảm giá:</Text>
          <Text style={styles.value}>-{discountAmount.toLocaleString('vi-VN')} VND</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')} VND</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.labelBold}>Thanh toán:</Text>
          <Text style={styles.label}>{paymentMethod} ({paymentStatus})</Text>
        </View>
      </View>

      {isShipping && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startDelivery}>
            <Text style={styles.buttonText}>🗺️ Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyItemsText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
    flex: 1,
  },
  labelBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 32,
  },
  debugText: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  itemUnitPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    marginTop: 5,
  },
  shippingFeeContainer: {
    alignItems: 'flex-end',
  },
  freeShipping: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  calculatedFee: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  paymentInfo: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  actionContainer: {
    padding: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;
