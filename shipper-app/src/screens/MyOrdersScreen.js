import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const response = await client.get(`/api/shipper/orders/my-orders?shipperId=${userInfo.id}`);
      if (response.data.status === 200) {
        setOrders(response.data.data.data);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchOrders();
    }
  }, [isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelOrder = async (orderId) => {
    Alert.prompt(
      'Hủy đơn hàng',
      'Nhập lý do hủy:',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async (reason) => {
            if (!reason) {
              Alert.alert('Lỗi', 'Vui lòng nhập lý do hủy');
              return;
            }
            try {
              const response = await client.post(`/api/shipper/orders/${orderId}/cancel?shipperId=${userInfo.id}`, JSON.stringify(reason), {
                headers: { 'Content-Type': 'application/json' }
              });
              if (response.data.status === 200) {
                Alert.alert('Thành công', 'Đã hủy đơn hàng');
                fetchOrders(); // Refresh list
              } else {
                Alert.alert('Lỗi', response.data.message);
              }
            } catch (error) {
              console.log(error);
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const failOrder = async (orderId) => {
    Alert.prompt(
      'Giao hàng thất bại',
      'Nhập lý do thất bại:',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async (reason) => {
            if (!reason) {
              Alert.alert('Lỗi', 'Vui lòng nhập lý do thất bại');
              return;
            }
            try {
              const response = await client.post(`/api/shipper/orders/${orderId}/fail?shipperId=${userInfo.id}`, JSON.stringify(reason), {
                headers: { 'Content-Type': 'application/json' }
              });
              if (response.data.status === 200) {
                Alert.alert('Thành công', 'Đã đánh dấu đơn hàng thất bại');
                fetchOrders(); // Refresh list
              } else {
                Alert.alert('Lỗi', response.data.message);
              }
            } catch (error) {
              console.log(error);
              Alert.alert('Lỗi', 'Không thể cập nhật đơn hàng');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const completeOrder = async (orderId) => {
    Alert.alert(
      'Hoàn thành đơn hàng',
      'Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã hoàn thành?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              const response = await client.post(`/api/shipper/orders/${orderId}/complete?shipperId=${userInfo.id}`);
              if (response.data.status === 200) {
                Alert.alert('Thành công', 'Đã hoàn thành đơn hàng');
                fetchOrders(); // Refresh list
              } else {
                Alert.alert('Lỗi', response.data.message);
              }
            } catch (error) {
              console.log(error);
              Alert.alert('Lỗi', 'Không thể hoàn thành đơn hàng');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const orderStatus = item.status || item.Status;
    const isShipping = orderStatus === 'SHIPPING' || orderStatus === 4 || orderStatus === '4';
    
    return (
      <View style={styles.card}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <Text style={styles.orderCode}>{item.orderCode}</Text>
          </View>
          <Text style={styles.address}>📍 {item.shippingAddressLine}, {item.shippingWard}, {item.shippingDistrict}, {item.shippingCity}</Text>
          <Text style={styles.amount}>Total: {item.totalAmount.toLocaleString()} VND</Text>
          <Text style={styles.payment}>Payment: {item.paymentMethod} ({item.paymentStatus})</Text>
        </TouchableOpacity>
        
        {isShipping && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => cancelOrder(item.id)}>
              <Text style={styles.buttonText}>Hủy đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.failButton]} onPress={() => failOrder(item.id)}>
              <Text style={styles.buttonText}>Giao thất bại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={() => completeOrder(item.id)}>
              <Text style={styles.buttonText}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No active deliveries</Text>}
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
  status: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  address: {
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  amount: {
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
  },
  payment: {
    color: '#666',
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff9800',
  },
  failButton: {
    backgroundColor: '#f44336',
  },
  completeButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default MyOrdersScreen;
