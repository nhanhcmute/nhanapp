import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { calculateOrderShippingFee } from '../utils/shippingUtils';

const AvailableOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      // Thêm pagination parameters để lấy nhiều đơn hàng hơn
      const response = await client.get('/api/shipper/orders/available', {
        params: {
          page: 1,
          pageSize: 100
        }
      });
      
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.status === 200 && response.data.data) {
        // Kiểm tra cấu trúc response
        const ordersData = response.data.data.data || response.data.data || [];
        console.log(`Found ${ordersData.length} available orders`);
        setOrders(ordersData);
      } else {
        console.log('Unexpected response structure:', response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to fetch orders: ${error.message || 'Unknown error'}`);
      setOrders([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchOrders();
    }
  }, [isFocused]);

  const acceptOrder = async (orderId) => {
    try {
      const response = await client.post(`/api/shipper/orders/${orderId}/accept?shipperId=${userInfo.id}`);
      if (response.data.status === 200) {
        Alert.alert('Success', 'Order accepted!');
        fetchOrders();
        navigation.navigate('MyOrders');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const renderItem = ({ item }) => {
    // Xử lý cả camelCase và snake_case field names
    const orderId = item.id || item.Id || item._id;
    const orderCode = item.orderCode || item.order_code;
    const createdAt = item.createdAt || item.created_at;
    const addressLine = item.shippingAddressLine || item.shipping_address_line;
    const ward = item.shippingWard || item.shipping_ward;
    const district = item.shippingDistrict || item.shipping_district;
    const city = item.shippingCity || item.shipping_city;
    const totalAmount = item.totalAmount || item.total_amount || 0;
    
    // Tính phí ship cho đơn hàng này (giả sử không có items chi tiết trong list)
    const shippingFee = calculateOrderShippingFee(item, []);
    
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.orderCode}>{orderCode || 'N/A'}</Text>
          <Text style={styles.date}>
            {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <Text style={styles.address}>
          📍 {addressLine || ''}, {ward || ''}, {district || ''}, {city || ''}
        </Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            Tổng đơn: {totalAmount.toLocaleString('vi-VN')} VND
          </Text>
          <Text style={styles.shippingFee}>
            Phí ship: {shippingFee === 0 ? (
              <Text style={styles.freeShipping}>Miễn phí</Text>
            ) : (
              `${shippingFee.toLocaleString('vi-VN')} VND`
            )}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.detailButton]}
            onPress={() => {
              console.log('Navigating to OrderDetail with orderId:', orderId);
              if (!orderId) {
                Alert.alert('Lỗi', 'Không tìm thấy ID đơn hàng');
                return;
              }
              navigation.navigate('OrderDetail', { orderId });
            }}
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]}
            onPress={() => acceptOrder(orderId)}
          >
            <Text style={styles.buttonText}>Chấp nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id || item.Id || item._id || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No available orders</Text>
            <Text style={styles.emptySubtext}>
              Pull down to refresh
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderCode: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#666',
  },
  address: {
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  amountContainer: {
    marginBottom: 10,
  },
  amount: {
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
    fontSize: 15,
  },
  shippingFee: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  freeShipping: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#2196F3',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },
});

export default AvailableOrdersScreen;
