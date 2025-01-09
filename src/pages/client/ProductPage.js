import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, CardMedia, Button, Snackbar, Alert } from '@mui/material';
import { ref, get } from 'firebase/database'; 
import { database } from '../../firebaseConfig'; 
import { useCart } from '../../function/CartContext';
import RatingAndReviews from '../../function/RatingAndReviews'; 

const ProductPage = () => {
  const { id } = useParams(); // ID sản phẩm từ URL
  const navigate = useNavigate(); // Điều hướng trang
  const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = ref(database, 'products'); // Truy vấn tất cả sản phẩm
        const snapshot = await get(productRef);
  
        if (snapshot.exists()) {
          const products = snapshot.val();
  
          // Chuyển đổi các object thành mảng và sắp xếp theo thứ tự của id
          const sortedProducts = Object.keys(products)
            .map(key => ({ id: key, ...products[key] }))
            .sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Sắp xếp theo id
  
          const currentProduct = sortedProducts.find(product => product.id === id); // Lấy sản phẩm theo id
  
          if (currentProduct) {
            setProduct(currentProduct);
          } else {
            console.error('Sản phẩm không tồn tại!');
          }
        } else {
          console.error('Không có sản phẩm nào trong cơ sở dữ liệu!');
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    addToCart(product);
    setOpenSnackbar(true);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
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

  const statusColor =
    product.status === "Hết hàng" ? "error" :
      product.status === "Ngừng kinh doanh" ? "grey" : "success";

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
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            {/* Tên sản phẩm */}
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            {/* Mô tả sản phẩm */}
            <Typography
              variant="body1"
              paragraph
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'justify',
                wordBreak: 'break-word',
                flexWrap: 'wrap',
              }}
            >
              {product.description || 'Mô tả không có sẵn'}
            </Typography>

            {/* Trạng thái sản phẩm */}
            <Typography
              variant="body2"
              color={statusColor}
              paragraph
            >
              <strong>Trạng thái:</strong> {product.status || 'Chưa có trạng thái'}
            </Typography>

            {/* Giá sản phẩm */}
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              {product.price} VND
            </Typography>

            {/* Nút thêm vào giỏ hàng và mua ngay */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleAddToCart} variant="contained" color="primary" sx={{ mt: 2 }}>
                Thêm vào giỏ hàng
              </Button>
              <Button onClick={handleBuyNow} variant="contained" color="error" sx={{ mt: 2 }}>
                Mua ngay
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Tích hợp RatingAndReviews */}
      <RatingAndReviews productId={id} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
