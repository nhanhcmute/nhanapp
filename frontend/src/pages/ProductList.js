import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Grid, Card, CardContent, Typography, Button, CardMedia, Pagination, Alert, ToggleButton, ToggleButtonGroup, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { getProductImageSrc } from '../utils/imageUtils';
import { API_URL } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 'all'];
const ALL_PAGE_SIZE = 100000; // đủ lớn để chắc chắn lấy hết sản phẩm khi chọn "All"

// value là giá trị lưu trong DB; nhãn hiển thị lấy từ shop.petTypes / shop.categoryNames
const PET_TYPE_FILTERS = [
  { value: '' },
  { value: 'Mèo' },
  { value: 'Chó' },
];

const CATEGORY_FILTERS = [
  { value: '' },
  { value: 'Thức ăn' },
  { value: 'Đồ chơi' },
  { value: 'Phụ kiện' },
  { value: 'Vệ sinh' },
  { value: 'Y tế' },
  { value: 'Khác' },
];

const toggleButtonSx = {
  borderRadius: '12px !important',
  border: '2px solid rgba(255, 107, 129, 0.3) !important',
  color: '#ff6b81',
  fontWeight: 600,
  textTransform: 'none',
  px: 2,
  '&.Mui-selected': {
    backgroundColor: '#ff6b81',
    color: 'white',
    '&:hover': {
      backgroundColor: '#ff4757',
    },
  },
};

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

const ProductList = ({ initialPetType = '', initialCategory = '' }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [petTypeFilter, setPetTypeFilter] = useState(initialPetType);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);

  // Fetch products từ API theo trang (tránh tải toàn bộ sản phẩm kèm ảnh gốc
  // base64 cùng lúc - rất nặng, chỉ lấy đúng số sản phẩm của trang hiện tại)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/product.ctr/get_paged`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            page_size: pageSize === 'all' ? ALL_PAGE_SIZE : pageSize,
            pet_type: petTypeFilter || null,
            category: categoryFilter || null,
          }),
        });

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setProducts(result.data.data || []);
          setTotalPages(result.data.totalPages || 1);
          setTotalCount(result.data.totalCount || 0);
        } else {
          setError(t('shop.loadFailed'));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(t('shop.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, petTypeFilter, categoryFilter]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handlePetTypeFilterChange = (event, value) => {
    if (value === null) return; // bỏ qua khi bấm lại nút đang chọn
    setPetTypeFilter(value);
    setPage(1);
  };

  const handleCategoryFilterChange = (event, value) => {
    if (value === null) return;
    setCategoryFilter(value);
    setPage(1);
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
          {`🐾 ${t('shop.loadingList')}`}
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
          {`🛍️ ${t('shop.listTitle')}`}
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

      {/* Bộ lọc theo loài & loại sản phẩm */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <ToggleButtonGroup
          value={petTypeFilter}
          exclusive
          onChange={handlePetTypeFilterChange}
          sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}
        >
          {PET_TYPE_FILTERS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value} sx={toggleButtonSx}>
              {opt.value ? t('shop.petTypes')[opt.value] : t('shop.all')}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={categoryFilter}
          exclusive
          onChange={handleCategoryFilterChange}
          sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}
        >
          {CATEGORY_FILTERS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value} sx={{ ...toggleButtonSx, fontSize: '13px', px: 1.5 }}>
              {opt.value ? t('shop.categoryNames')[opt.value] : t('shop.allCategories')}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {products.length === 0 && (
        <Typography sx={{ textAlign: 'center', color: '#999', mb: 4 }}>
          {`🐾 ${t('shop.noMatch')}`}
        </Typography>
      )}

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
                image={getProductImageSrc(product, images)}
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
                onError={(e) => {
                  e.target.src = '/default-product.jpg';
                }}
              />
              <CardContent sx={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 1, fontSize: '18px' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', lineHeight: 1.5, flexGrow: 1 }}>
                  {product.description && product.description.length > 60 
                    ? `${product.description.substring(0, 60)}...` 
                    : product.description || t('shop.descriptionFallback')}
                </Typography>
                <Typography variant="h5" sx={{ color: '#ff4757', fontWeight: 700, mt: 'auto' }}>
                  {`💰 ${product.price} ${t('shop.currency')}`}
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
                  {`🐾 ${t('shop.viewDetail')}`}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Phân trang + chọn số sản phẩm/trang */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{ marginTop: 6, mb: 4 }}
      >
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

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="page-size-label">{t('shop.show')}</InputLabel>
          <Select
            labelId="page-size-label"
            label={t('shop.show')}
            value={pageSize}
            onChange={handlePageSizeChange}
            sx={{
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 107, 129, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 107, 129, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6b81',
              },
            }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt === 'all' ? t('shop.allCount', { n: totalCount }) : t('shop.perPage', { n: opt })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
