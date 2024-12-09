import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, CardMedia, Button, Snackbar, Alert } from '@mui/material';
import { useCart } from '../../function/CartContext';
import RatingAndReviews from '../../function/RatingAndReviews'; // Import RatingAndReviews

const ProductPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate(); // Dùng để quay lại danh sách sản phẩm
  const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Không tìm được sản phẩm!', error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setOpenSnackbar(true); // Thêm sản phẩm vào giỏ hàng
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <Typography variant="h6" align="center">Đang tải dữ liệu...</Typography>;
  }

  if (!product) {
    return <Typography variant="h6" align="center">Sản phẩm không tồn tại.</Typography>;
  }

  return (
    <Container>
      <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
        Trở lại
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            alt={product.name}
            image={product.image || '/default-product.jpg'}
            title={product.name}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            {product.price} VND
          </Typography>
          <Button onClick={handleAddToCart} variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm vào giỏ hàng
          </Button>
        </Grid>
      </Grid>
      
      {/* Tích hợp RatingAndReviews */}
      <RatingAndReviews productId={id} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Tự động đóng sau 3 giây
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Sản phẩm đã được thêm vào giỏ hàng!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
