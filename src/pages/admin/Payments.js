import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Grid, Card, CardContent, Divider } from '@mui/material';

const Payments = () => {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn hàng khi component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Cập nhật trạng thái thanh toán của đơn hàng
  const handlePaymentStatusChange = async (orderId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/orders/${orderId}`, {
        paymentStatus: status,
      });
      const updatedOrder = response.data;

      // Cập nhật danh sách đơn hàng sau khi thay đổi
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}> 
      <Typography variant="h4" gutterBottom>
        Quản lý thanh toán
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

                <Box sx={{ marginTop: 2 }}>
                  {order.paymentStatus === 'Pending' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePaymentStatusChange(order.id, 'Paid')}
                    >
                      Mark as Paid
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handlePaymentStatusChange(order.id, 'Pending')}
                    >
                      Mark as Pending
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

export default Payments;
