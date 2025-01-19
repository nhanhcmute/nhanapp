import React from "react";
import Banner from "../../component/Banner";
import Categories from "../../component/Categories";
import ProductsGrid from "../../component/ProductsGrid";
import { Container, Box  } from "@mui/material";
import Footer from "../../Footer";

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

      {/* Về Chúng Tôi */}
      <Box sx={{ backgroundColor: '#f4f4f9', padding: '40px 0' }}>
        <Container maxWidth="xl">
        <Banner />
        <Categories />
        <Box mt={4}>
          <ProductsGrid title="Flash Sale" />
          <ProductsGrid title="Gợi Ý Hôm Nay" />
        </Box>
          </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Homepage;
