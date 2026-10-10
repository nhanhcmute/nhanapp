import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Grid, Typography, Snackbar, CardMedia, Alert, Container, Box, CircularProgress, Chip } from '@mui/material'; 
import RatingAndReviews from '../common/RatingAndReviews';
import { FaPaw } from 'react-icons/fa';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useCart } from '../../store/CartContext';
import { getProductImageSrc } from '../../utils/imageUtils';
import { API_URL } from '../../config/api';

// Tự động import tất cả ảnh từ thư mục
const importImages = () => {
  const context = require.context("../../assets/images/products", false, /\.(png|jpe?g|svg)$/);
  const images = {};
  context.keys().forEach((key) => {
    const imageName = key.replace("./", "");
    images[imageName] = context(key);
  });
  return images;
};

const images = importImages();

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch product từ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/product.ctr/get_by_id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setProduct(result.data);
        } else {
          setError(result.message || 'Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Đã xảy ra lỗi khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Container>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaPaw size={32} color="#ff6b81" />
            <CircularProgress sx={{ color: '#ff6b81' }} />
            <FaPaw size={32} color="#ff6b81" />
          </Box>
          <Typography sx={{ color: '#ff6b81', fontWeight: 600 }}>
            Đang tải thông tin sản phẩm...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Button 
            onClick={() => navigate(-1)} 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 3,
              borderColor: '#ff6b81',
              color: '#ff6b81',
              borderRadius: '12px',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 107, 129, 0.1)',
              },
            }}
          >
            Trở lại
          </Button>
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
            {error || 'Không tìm thấy sản phẩm'}
          </Alert>
        </Box>
      </Container>
    );
  }

  // Lấy hình ảnh sản phẩm (hỗ trợ base64, URL, và file path)
  const productImage = getProductImageSrc(product, images);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;
    
    const productToAdd = {
      id: product._id || product.Id || id,
      name: product.name || product.Name,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0 
        : product.price || product.Price || 0,
      image: getProductImageSrc(product, images),
      description: product.description || product.Description || '',
      quantity: 1,
    };
    
    await addToCart(productToAdd);
    setOpenSnackbar(true); 
  };

  // Hàm xử lý mua ngay
  const handleBuyNow = async () => {
    if (!product) return;
    
    // Thêm sản phẩm vào giỏ hàng trước
    const productToAdd = {
      id: product._id || product.Id || id,
      name: product.name || product.Name,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0 
        : product.price || product.Price || 0,
      image: getProductImageSrc(product, images),
      description: product.description || product.Description || '',
      quantity: 1,
    };
    
    await addToCart(productToAdd);
    
    // Đợi một chút để Firebase cập nhật cart
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Chuyển đến trang checkout với sản phẩm đã chọn
    // Sử dụng cart từ context (sẽ được update từ Firebase)
    const productId = productToAdd.id;
    const selectedItems = { [productId]: true };
    
    // Lấy cart mới nhất từ localStorage hoặc từ Firebase context
    // Nếu cart từ context chưa update, vẫn có productToAdd
    const currentCart = cart.length > 0 ? cart : [productToAdd];
    
    navigate('/checkout', {
      state: {
        cart: currentCart,
        selectedItems: selectedItems,
      }
    });
  };

  // Hàm đóng thông báo
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Còn hàng':
        return '#2ed573';
      case 'Hết hàng':
        return '#ff4757';
      case 'Ngừng kinh doanh':
        return '#a4b0be';
      default:
        return '#ff6b81';
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        onClick={() => navigate(-1)} 
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 4,
          borderColor: '#ff6b81',
          color: '#ff6b81',
          borderRadius: '16px',
          px: 3,
          py: 1,
          fontWeight: 600,
          '&:hover': {
            borderColor: '#ff4757',
            backgroundColor: 'rgba(255, 107, 129, 0.1)',
            transform: 'translateX(-4px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Trở lại
      </Button>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
              },
            }}
          >
            <CardMedia
              component="img"
              alt={product.name}
              image={productImage}
              title={product.name}
              sx={{ 
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = '/default-product.jpg';
              }}
            />
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: '24px',
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {/* Product Name with Paw Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaPaw size={28} color="#ff6b81" />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#ff6b81',
                  flexGrow: 1,
                }}
              >
                {product.name}
              </Typography>
            </Box>

            {/* Status Badge */}
            <Box>
              <Chip
                label={product.status || 'Chưa có trạng thái'}
                sx={{
                  backgroundColor: getStatusColor(product.status),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#ff6b81',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FaPaw size={16} color="#ff6b81" />
                Mô tả sản phẩm
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                }}
              >
                {product.description || 'Mô tả không có sẵn'}
              </Typography>
            </Box>

            {/* Quantity */}
            {product.quantity !== undefined && (
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontWeight: 600,
                  }}
                >
                  📦 Số lượng còn lại: <span style={{ color: '#ff6b81', fontSize: '18px' }}>{product.quantity}</span>
                </Typography>
              </Box>
            )}

            {/* Price */}
            <Box
              sx={{
                backgroundColor: 'rgba(255, 107, 129, 0.1)',
                borderRadius: '16px',
                p: 2,
                border: '2px solid rgba(255, 107, 129, 0.3)',
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#ff4757',
                  textAlign: 'center',
                }}
              >
                💰 {product.price} VNĐ
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                onClick={handleAddToCart} 
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                fullWidth
                sx={{
                  borderColor: '#ff6b81',
                  color: '#ff6b81',
                  borderRadius: '16px',
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '16px',
                  '&:hover': {
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 107, 129, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                🛒 Thêm vào giỏ
              </Button>
              <Button 
                onClick={handleBuyNow} 
                variant="contained"
                startIcon={<FlashOnIcon />}
                fullWidth
                sx={{
                  backgroundColor: '#ff6b81',
                  borderRadius: '16px',
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                  '&:hover': {
                    backgroundColor: '#ff4757',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                ⚡ Mua ngay
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Decorative Paws */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          my: 4,
          opacity: 0.3,
        }}
      >
        <FaPaw size={24} color="#ff6b81" />
        <FaPaw size={24} color="#ff6b81" />
        <FaPaw size={24} color="#ff6b81" />
      </Box>

      {/* Tích hợp RatingAndReviews */}
      <RatingAndReviews productId={id} />

      {/* Thông báo khi thêm sản phẩm vào giỏ hàng */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            backgroundColor: '#ff6b81',
            color: 'white',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          🎉 Sản phẩm đã được thêm vào giỏ hàng!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
