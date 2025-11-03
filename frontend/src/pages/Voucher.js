import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Grid, Card, CardContent, Paper, Chip } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import { database, ref, get } from '../firebaseConfig';
import { FaPaw } from 'react-icons/fa';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
     
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
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
    }}>
      <Sidebar />
      <Box sx={{ padding: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <FaPaw size={32} color="#ff6b81" />
          <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700 }}>
            🎟️ Quản lý Voucher
          </Typography>
          <FaPaw size={32} color="#ff6b81" />
        </Box>

        {/* Grid container for better spacing */}
        {vouchers.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
            }}
          >
            <LocalOfferIcon sx={{ fontSize: 64, color: '#ff6b81', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 2 }}>
              Chưa có voucher nào
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Hãy thêm voucher để khách hàng sử dụng! 🐾
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {vouchers.map((voucher) => (
              <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                <Card 
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '2px solid rgba(255, 107, 129, 0.2)',
                    boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
                      borderColor: 'rgba(255, 107, 129, 0.4)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FaPaw size={20} color="#ff6b81" />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', flexGrow: 1 }}>
                        {voucher.code}
                      </Typography>
                      <Chip
                        label={voucher.usedCount < voucher.quantity ? "Còn hàng" : "Hết hàng"}
                        sx={{
                          backgroundColor: voucher.usedCount < voucher.quantity ? '#4caf50' : '#f44336',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.8 }}>
                      {voucher.description}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 107, 129, 0.05)',
                      border: '1px solid rgba(255, 107, 129, 0.2)',
                    }}>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                        📊 Số lượng đã sử dụng:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 700 }}>
                        {voucher.usedCount} / {voucher.quantity}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Snackbar for feedback messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              backgroundColor: '#ff6b81',
              borderRadius: '16px',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Voucher;
