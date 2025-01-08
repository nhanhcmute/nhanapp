import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { ref, get, update } from 'firebase/database';
import { database } from '../../firebaseConfig';  // Import cấu hình Firebase

const Shipping = () => {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn hàng từ Firebase khi component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = ref(database, 'orders');
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
          setOrders(Object.values(snapshot.val()));
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders from Firebase:', error);
      }
    };

    fetchOrders();
  }, []);

  // Cập nhật trạng thái vận chuyển của đơn hàng
  const handleShippingStatusChange = async (orderId, status) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, {
        shippingStatus: status,
      });

      // Cập nhật lại danh sách đơn hàng sau khi thay đổi
      setOrders(orders.map(order => order.id === orderId ? { ...order, shippingStatus: status } : order));
    } catch (error) {
      console.error('Error updating shipping status in Firebase:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý vận chuyển
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{order.productName}</Typography>
                <Typography variant="body1">Total: ${order.totalAmount}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Payment Status: {order.paymentStatus}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  Shipping Status: {order.shippingStatus}
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                  {order.shippingStatus === 'Pending' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleShippingStatusChange(order.id, 'Shipped')}
                    >
                      Mark as Shipped
                    </Button>
                  ) : order.shippingStatus === 'Shipped' ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleShippingStatusChange(order.id, 'Delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled
                    >
                      Delivered
                    </Button>
                  )}
                </Box>
              </CardContent>
              <Divider />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Shipping;
