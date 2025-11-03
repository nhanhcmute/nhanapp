import React from "react";
import Banner from '../components/common/Banner';
import Categories from '../components/common/Categories';
import ProductsGrid from '../components/product/ProductsGrid';
import { Container, Box, Typography } from "@mui/material";
import { FaPaw } from 'react-icons/fa';
import Footer from '../components/layout/Footer';

const Homepage = () => {
  return (
<Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: 'url(/homepage.jpg)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Nội dung trang */}
      <Container
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: 'white',
          padding: 0,
        }}
      >
      </Container>

      {/* Content Section */}
      <Box 
        sx={{ 
          padding: '60px 0',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          {/* Decorative Paws */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4, opacity: 0.3 }}>
            <FaPaw size={24} color="#ff6b81" />
            <FaPaw size={24} color="#ffd93d" />
            <FaPaw size={24} color="#ff6b81" />
            <FaPaw size={24} color="#ffd93d" />
            <FaPaw size={24} color="#ff6b81" />
          </Box>
          
          <Banner />
          
          {/* Categories Section with Title */}
          <Box sx={{ mt: 6, mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
              <FaPaw size={28} color="#ff6b81" />
              <Typography variant="h3" sx={{ color: '#ff6b81', fontWeight: 700, textAlign: 'center' }}>
                🐾 Danh Mục Sản Phẩm
              </Typography>
              <FaPaw size={28} color="#ff6b81" />
            </Box>
            <Categories />
          </Box>
          
          <Box mt={6}>
            <ProductsGrid title="Flash Sale"  />
            <ProductsGrid title="Gợi Ý Hôm Nay"  />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Homepage;
