import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Grid, Card, CardContent, Typography, Button, CardMedia, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);  // Trang hiện tại
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Lấy dữ liệu sản phẩm từ API
        const response = await axios.get('http://localhost:5000/products');
        const fetchedProducts = response.data;

        setProducts(fetchedProducts);
        setTotalPages(Math.ceil(fetchedProducts.length / productsPerPage));
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // Lấy các sản phẩm cho trang hiện tại
  const currentProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
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
                sx={{
                  borderRadius: 0,
                  '&:hover': {
                    opacity: 0.8,
                  }
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
