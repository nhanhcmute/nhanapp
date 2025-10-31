import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar,  Grid, Card, CardContent } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import { database, ref, get } from '../firebaseConfig';     

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchVouchersFromDatabase();
  }, []);

  const fetchVouchersFromDatabase = async () => {
    try {
      const promotionsRef = ref(database, 'promotions');
      const snapshot = await get(promotionsRef);
      if (snapshot.exists()) {
        setVouchers(Object.values(snapshot.val()));
      }
    } catch (error) {
      console.error('Error fetching vouchers: ', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa' }}>
      <Sidebar />
      <Box sx={{ padding: 3, flex: 1 }}>
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold' }}>Quản lý Voucher</Typography>

        {/* Grid container for better spacing */}
        <Grid container spacing={3}>
          {vouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={voucher.id}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {voucher.code}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    {voucher.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    Số lượng đã sử dụng: {voucher.usedCount} / {voucher.quantity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Snackbar for feedback messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </Box>
  );
};

export default Voucher;
