import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: 'url(/path/to/your/image.jpg)',
          //background: 'linear-gradient(to right, #87CEEB, #FFDAB9)',
          color: '#fff',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <Box sx={{ pt: 6 }}>
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Welcome to <span style={{ color: '#FFD700' }}>Nhân's Pet Haven</span>
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Your one-stop shop for all your pet's needs. Browse our products, meet our team, and explore exclusive offers!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<StorefrontIcon />}
            sx={{ backgroundColor: '#FFD700', color: '#000', px: 4, py: 2 }}
            onClick={() => navigate('/productlist')}
          >
            View Products
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={4}>
            <Box
              onClick={() => navigate('/petsupplies')}
              sx={{
                borderRadius: '10px',
                boxShadow: 3,
                background: '#fff',
                color: '#000',
                p: 4,
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <PetsIcon sx={{ fontSize: 50, color: '#87CEEB' }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                Quality Pet Supplies
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Find the best products for your furry friends, from food to toys and everything in between.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              onClick={() => navigate('/expertadvice')}
              sx={{
                borderRadius: '10px',
                boxShadow: 3,
                background: '#fff',
                color: '#000',
                p: 4,
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <EmojiPeopleIcon sx={{ fontSize: 50, color: '#FFD700' }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                Expert Advice
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Our experts are here to help with all your pet care questions. Connect with us today!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              onClick={() => navigate('/exclusivedeals')}
              sx={{
                borderRadius: '10px',
                boxShadow: 3,
                background: '#fff',
                color: '#000',
                p: 4,
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <StorefrontIcon sx={{ fontSize: 50, color: '#FFA07A' }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                Exclusive Deals
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Explore discounts and offers available only at Nhân's Pet Haven. Don't miss out!
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
