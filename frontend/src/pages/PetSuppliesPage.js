import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Box } from '@mui/material';
import { FaPaw } from 'react-icons/fa';

const PetSuppliesPage = () => {
  const [petSupplies, setPetSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPetSupplies = async () => {
      try {
        // Lấy dữ liệu từ petsupplies.json trong thư mục public
        const response = await fetch('/petsupplies.json');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu');
        }

        const data = await response.json();
        setPetSupplies(data);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu!');
        setLoading(false);
      }
    };

    fetchPetSupplies();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 6,
    }}>
      <Container maxWidth="lg">
        {/* Title with Paw Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <FaPaw size={36} color="#ff6b81" />
          <Typography variant="h2" align="center" sx={{ color: '#ff6b81', fontWeight: 700 }}>
            Quality Pet Supplies
          </Typography>
          <FaPaw size={36} color="#ff6b81" />
        </Box>

        <Typography variant="h6" align="center" sx={{ color: '#666', mb: 4, lineHeight: 1.8 }}>
          🐾 Explore our premium selection of pet supplies. Our products are designed to keep your pets happy, healthy, and comfortable. 🐶
        </Typography>

        {/* Decorative Paws */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 5, opacity: 0.3 }}>
          <FaPaw size={20} color="#ff6b81" />
          <FaPaw size={20} color="#ffd93d" />
          <FaPaw size={20} color="#ff6b81" />
          <FaPaw size={20} color="#ffd93d" />
          <FaPaw size={20} color="#ff6b81" />
        </Box>

        {loading ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="40vh">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FaPaw size={32} color="#ff6b81" />
              <CircularProgress sx={{ color: '#ff6b81' }} />
              <FaPaw size={32} color="#ff6b81" />
            </Box>
            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600 }}>
              Loading supplies...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '16px',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '2px solid rgba(244, 67, 54, 0.3)',
            }}
          >
            {error}
          </Alert>
        ) : (
          <Grid container spacing={4}>
            {petSupplies.map((supply) => (
              <Grid item xs={12} sm={6} md={4} key={supply.id}>
                <Card sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 107, 129, 0.2)',
                  boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 12px 32px rgba(255, 107, 129, 0.3)',
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={supply.image}
                    alt={supply.name}
                    sx={{ borderRadius: '24px 24px 0 0' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', mb: 2 }}>
                      {supply.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.6 }}>
                      {supply.description}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#ff4757', fontWeight: 700, mb: 2 }}>
                      💰 ${supply.price.toFixed(2)}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        borderRadius: '16px',
                        padding: '12px',
                        backgroundColor: '#ff6b81',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                        '&:hover': {
                          backgroundColor: '#ff4757',
                          boxShadow: '0 6px 16px rgba(255, 107, 129, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      🛒 Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Bottom Decorative Paws */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6, opacity: 0.3 }}>
          <FaPaw size={24} color="#ff6b81" />
          <FaPaw size={24} color="#ffd93d" />
          <FaPaw size={24} color="#ff6b81" />
        </Box>
      </Container>
    </Box>
  );
};

export default PetSuppliesPage;
