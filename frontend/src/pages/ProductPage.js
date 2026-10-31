import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, CardMedia, Button, Snackbar, Alert } from '@mui/material';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useCart } from '../store/CartContext';
import RatingAndReviews from '../components/common/RatingAndReviews';
import { useLanguage } from '../i18n/LanguageContext';

const ProductPage = () => {
  const { t } = useLanguage();
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate(); // Điều hướng trang
  const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm
  const [loading, setLoading] = useState(true);
  const { addToCart, cart, setCart } = useCart();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null); // Để lưu thông tin lỗi nếu có
  const [selectedItems, setSelectedItems] = useState({}); // Trạng thái chọn sản phẩm trong giỏ hàng

  // Lấy thông tin sản phẩm từ Firebase khi component được load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = ref(database, 'products'); // Truy vấn tất cả sản phẩm
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const products = snapshot.val();
          // Chuyển đổi các object thành mảng và sắp xếp theo thứ tự của id
          const currentProduct = Object.keys(products)
            .map(key => ({ id: key, ...products[key] }))
            .find(product => product.id === id); // Lấy sản phẩm theo id

          if (currentProduct) {
            setProduct(currentProduct);
          } else {
            setError(t('shop.notFound'));
          }
        } else {
          setError(t('shop.noProducts'));
        }
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        setError(t('shop.fetchError'));
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Cập nhật trạng thái selectedItems khi sản phẩm được thêm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(product);
    setOpenSnackbar(true);

    // Cập nhật selectedItems để tự động tick vào checkbox của sản phẩm vừa thêm vào giỏ hàng
    setSelectedItems(prev => ({
      ...prev,
      [product.id]: true, // Đánh dấu sản phẩm này là đã chọn
    }));
  };

  // Xử lý khi bấm "Mua ngay"
  const handleBuyNow = async () => {
    try {
      const cartRef = ref(database, 'cart');
      const snapshot = await get(cartRef);
      const cartData = snapshot.exists() ? snapshot.val() : {};
      
      if (!cartData[product.id]) {
        const newProduct = { ...product, quantity: 1 };
        const newProductRef = ref(database, `cart/${product.id}`);
        await set(newProductRef, newProduct);  // Thêm sản phẩm vào giỏ hàng Firebase
      }
      
      // Cập nhật selectedItems để tự động tick vào checkbox
      setSelectedItems(prev => ({
        ...prev,
        [product.id]: true,  // Đánh dấu sản phẩm này là đã chọn
      }));

      // Điều hướng đến trang thanh toán
      navigate('/checkout');
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <Typography variant="h6" align="center">{t('shop.loadingData')}</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  if (!product) {
    return <Typography variant="h6" align="center">{t('shop.notFoundDot')}</Typography>;
  }

  const statusColor =
    product.status === 'Hết hàng' ? 'error' :
    product.status === 'Ngừng kinh doanh' ? 'grey' : 'success';

  return (
    <Container>
      <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
        {t('shop.back')}
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
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
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
              {product.description || t('shop.noDescription')}
            </Typography>

            {/* Trạng thái sản phẩm */}
            <Typography variant="body2" color={statusColor} paragraph>
              <strong>{t('shop.status')}</strong> {(t('shop.statusNames')[product.status] || product.status || t('shop.noStatus'))}
            </Typography>

            {/* Giá sản phẩm */}
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              {product.price} VND
            </Typography>

            {/* Nút thêm vào giỏ hàng và mua ngay */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleAddToCart} variant="contained" color="primary" sx={{ mt: 2 }}>
                {t('shop.addToCart')}
              </Button>
              <Button onClick={handleBuyNow} variant="contained" color="error" sx={{ mt: 2 }}>
                {t('shop.buyNow')}
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Tích hợp RatingAndReviews */}
      <RatingAndReviews productId={id} />

      {/* Thông báo khi thêm sản phẩm vào giỏ hàng */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {t('shop.addedToCart')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
