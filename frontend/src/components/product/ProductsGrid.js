import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Card, CardContent, CardMedia, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPaw } from 'react-icons/fa';
import { getProductImageSrc } from '../../utils/imageUtils';
import { API_URL } from '../../config/api';
import { useLanguage } from '../../i18n/LanguageContext';

// Import ảnh từ thư mục
const images = require
  .context("../../assets/images/products", false, /\.(png|jpe?g|svg)$/)
  .keys()
  .reduce((acc, path) => {
    const name = path.replace("./", ""); // Lấy tên ảnh
    acc[name] = require(`../../assets/images/products/${name}`); 
    return acc;
  }, {});

// mode="cheapest": sắp theo giá tăng dần (phù hợp cho "Flash Sale")
// mode="random" (mặc định): trộn ngẫu nhiên (phù hợp cho "Gợi ý hôm nay") - tránh hiển thị
// trùng y hệt danh sách với các ProductsGrid khác trên cùng trang
const ProductsGrid = ({ title, color, mode = 'random' }) => {
  const { t } = useLanguage();
  const statusLabels = t('products.status');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/product.ctr/${mode === 'cheapest' ? 'get_sorted' : 'get_all'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: mode === 'cheapest' ? JSON.stringify('price') : undefined,
          }
        );

        const result = await response.json();

        if (result.status === 200 && result.data) {
          // Chỉ gợi ý sản phẩm còn hàng và có giá hợp lệ (loại các bản ghi dữ liệu cũ
          // thiếu giá/hết hàng để không hiện lên đầu "Flash Sale" khi sort theo giá tăng dần)
          const available = result.data.filter((p) => p.status === 'Còn hàng' && Number(p.price) > 0);
          const data = mode === 'random'
            ? [...available].sort(() => Math.random() - 0.5)
            : available;
          setProducts(data);
        } else {
          setError('loadFailed');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('loadError');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mode]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FaPaw size={32} color={color || '#ff6b81'} />
          <CircularProgress sx={{ color: color || '#ff6b81' }} />
          <FaPaw size={32} color={color || '#ff6b81'} />
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
          {t(`products.${error}`)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      {/* Title with Paw Icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <FaPaw size={24} color={color || '#ff6b81'} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: color || '#ff6b81' }}>
          {title}
        </Typography>
        <FaPaw size={24} color={color || '#ff6b81'} />
      </Box>

      <Grid container spacing={3}>
        {products.slice(0, 8).map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
            <Card
              sx={{
                borderRadius: '24px',
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
                height="220"
                image={getProductImageSrc(product, images)} 
                alt={product.name}
                sx={{
                  borderRadius: '24px 24px 0 0',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  // Fallback nếu image không load được
                  e.target.src = '/default-product.jpg';
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', fontSize: '18px' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>
                  {product.description}
                </Typography>
                
                {/* Status Badge */}
                <Box 
                  sx={{ 
                    mt: 1,
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    backgroundColor: 
                      product.status === 'Còn hàng' ? 'rgba(76, 175, 80, 0.1)' :
                      product.status === 'Hết hàng' ? 'rgba(244, 67, 54, 0.1)' :
                      'rgba(158, 158, 158, 0.1)',
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      color: 
                        product.status === 'Còn hàng' ? '#4caf50' :
                        product.status === 'Hết hàng' ? '#f44336' :
                        '#9e9e9e',
                    }}
                  >
                    {statusLabels[product.status] || product.status}
                  </Typography>
                </Box>

                <Typography variant="h5" sx={{ color: '#ff4757', fontWeight: 700, mt: 'auto' }}>
                  💰 {product.price}
                </Typography>
              </CardContent>
              
              {/* Button */}
              <Box sx={{ p: 2.5, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/productdetail/${product._id || product.id}`}
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: '16px',
                    padding: '10px',
                    backgroundColor: '#ff6b81',
                    color: 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '15px',
                    boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                    '&:hover': {
                      backgroundColor: '#ff4757',
                      boxShadow: '0 6px 16px rgba(255, 107, 129, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  🐾 {t('products.viewDetail')}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsGrid;
