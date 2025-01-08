import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database'; 
import { CircularProgress, Box, Grid, Card, CardContent, Typography, Button, CardMedia, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { database } from '../../firebaseConfig'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [productsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Tham chiếu đến nút `products` trong Realtime Database
        const productsRef = ref(database, 'products');
        onValue(productsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const productList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setProducts(productList);
            setTotalPages(Math.ceil(productList.length / productsPerPage));
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    };

    fetchProducts();
  }, [productsPerPage]);

  const currentProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleClick = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ marginTop: 2, color: 'blue' }}>
          Đang tải danh sách sản phẩm...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      <Grid container spacing={3}>
        {currentProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                borderRadius: 0,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                },
              }}
            >
              <CardMedia
                component="img"
                height="350"
                image={product.image || '/default-product.jpg'}
                alt={product.name}
                onClick={() => handleClick(product.id)}
                sx={{
                  borderRadius: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              />
              <CardContent sx={{ borderRadius: 0 }}>
                <Typography variant="h6">{product.name}</Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Xem chi tiết
                </Button>
                <Typography variant="h6">{product.price} VND</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" sx={{ marginTop: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
          sx={{ borderRadius: 0 }}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
