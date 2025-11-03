import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Grid, Card, CardContent, Typography, Button, CardMedia, Pagination, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://petshop-a2ry.onrender.com';

// Import ảnh từ thư mục
const importImages = () => {
  const context = require.context("../assets/images/products", false, /\.(png|jpe?g|svg)$/);
  const images = {};
  context.keys().forEach((key) => {
    const imageName = key.replace("./", "");
    images[imageName] = context(key);
  });
  return images;
};

const images = importImages(); 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); 
  const [productsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/product.ctr/get_all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setAllProducts(result.data);
          setTotalPages(Math.ceil(result.data.length / productsPerPage));
        } else {
          setError('Không thể tải danh sách sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Đã xảy ra lỗi khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productsPerPage]);

  // Update products when page changes
  useEffect(() => {
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    setProducts(allProducts.slice(startIdx, endIdx));
  }, [page, allProducts, productsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleClick = (productId) => {
    window.location.href = `/productdetail/${productId}`;
  };

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FaPaw size={32} color="#ff6b81" />
          <CircularProgress sx={{ color: '#ff6b81' }} />
          <FaPaw size={32} color="#ff6b81" />
        </Box>
        <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600 }}>
          🐾 Đang tải danh sách sản phẩm...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ padding: '40px 20px', minHeight: '100vh' }}>
        <Alert 
          severity="error"
          sx={{
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 71, 87, 0.1)',
            '& .MuiAlert-icon': {
              color: '#ff4757',
            },
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: '40px 20px',
      minHeight: '100vh',
    }}>
      {/* Title with Paw Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
        <FaPaw size={32} color="#ff6b81" />
        <Typography variant="h3" sx={{ color: '#ff6b81', fontWeight: 700, textAlign: 'center' }}>
          🛍️ Danh sách sản phẩm
        </Typography>
        <FaPaw size={32} color="#ff6b81" />
      </Box>

      {/* Decorative Paws */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 5, opacity: 0.3 }}>
        <FaPaw size={16} color="#ff6b81" />
        <FaPaw size={16} color="#ffd93d" />
        <FaPaw size={16} color="#ff6b81" />
        <FaPaw size={16} color="#ffd93d" />
        <FaPaw size={16} color="#ff6b81" />
      </Box>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id || product.id}>
            <Card
              sx={{
                borderRadius: '24px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 107, 129, 0.2)',
                boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 12px 32px rgba(255, 107, 129, 0.3)',
                  borderColor: 'rgba(255, 107, 129, 0.5)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="280"
                image={product.image ? images[product.image] : '/default-product.jpg'}
                alt={product.name}
                onClick={() => handleClick(product._id || product.id)}
                sx={{
                  borderRadius: '24px 24px 0 0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  objectFit: 'cover',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
              <CardContent sx={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 1, fontSize: '18px' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', lineHeight: 1.5, flexGrow: 1 }}>
                  {product.description && product.description.length > 60 
                    ? `${product.description.substring(0, 60)}...` 
                    : product.description || 'Mô tả sản phẩm'}
                </Typography>
                <Typography variant="h5" sx={{ color: '#ff4757', fontWeight: 700, mt: 'auto' }}>
                  💰 {product.price} VNĐ
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', padding: '0 20px 20px' }}>
                <Button
                  component={Link}
                  to={`/productdetail/${product._id || product.id}`}
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
                  🐾 Xem chi tiết
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" sx={{ marginTop: 6, mb: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#ff6b81',
              borderColor: 'rgba(255, 107, 129, 0.5)',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 129, 0.1)',
                borderColor: '#ff6b81',
              },
              '&.Mui-selected': {
                backgroundColor: '#ff6b81',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ff4757',
                },
              },
            },
          }}
        />
      </Box>

      {/* Bottom Decorative Paws */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, opacity: 0.3 }}>
        <FaPaw size={20} color="#ff6b81" />
        <FaPaw size={20} color="#ffd93d" />
        <FaPaw size={20} color="#ff6b81" />
      </Box>
    </Box>
  );
};

export default ProductList;
