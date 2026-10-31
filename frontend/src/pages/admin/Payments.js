import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { getDatabase, ref, get, update } from 'firebase/database';
import { database } from '../../firebaseConfig';  
import { useLanguage } from '../../i18n/LanguageContext';

const Payments = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn hàng từ Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersRef = ref(database, 'orders'); 
      try {
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          const ordersList = Object.keys(ordersData).map((key) => ({
            id: key,
            ...ordersData[key],
          }));
          setOrders(ordersList);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Cập nhật trạng thái thanh toán của đơn hàng
  const handlePaymentStatusChange = async (orderId, status) => {
    const orderRef = ref(database, `orders/${orderId}`);
    try {
      await update(orderRef, { paymentStatus: status });
      
      // Cập nhật danh sách đơn hàng sau khi thay đổi trạng thái thanh toán
      setOrders(orders.map(order => order.id === orderId ? { ...order, paymentStatus: status } : order));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('admin.payments.title')}
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{order.productName}</Typography>
                <Typography variant="body1">Total: ${order.totalAmount}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {t('admin.payments.status', { v: t('admin.payments.statuses')[order.paymentStatus] || order.paymentStatus })}
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                  {order.paymentStatus === 'Pending' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePaymentStatusChange(order.id, 'Paid')}
                    >
                      {t('admin.payments.markPaid')}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handlePaymentStatusChange(order.id, 'Pending')}
                    >
                      {t('admin.payments.markPending')}
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
