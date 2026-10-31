import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../store/CartContext';
import { getProductImageSrc } from '../../utils/imageUtils';

const PINK = '#ff6b81';

const images = require
  .context('../../assets/images/products', false, /\.(png|jpe?g|svg)$/)
  .keys()
  .reduce((acc, path) => {
    const name = path.replace('./', '');
    acc[name] = require(`../../assets/images/products/${name}`);
    return acc;
  }, {});

export const formatPrice = (price) => `${Number(price || 0).toLocaleString('vi-VN')}đ`;

// Thẻ sản phẩm nằm ngang: ảnh bên trái, tên / trạng thái / giá / nút thêm giỏ bên phải.
// compact: thẻ nhỏ hơn, nút thêm giỏ nằm cùng hàng với giá (mục "Gợi ý hôm nay").
const HomeProductCard = ({ product, compact = false, onAdded }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const id = product._id || product.id;
  const inStock = product.status === 'Còn hàng';

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart({ ...product, id });
    setAdding(false);
    onAdded?.(product);
  };

  const addButton = (
    <Button
      onClick={handleAdd}
      disabled={adding || !inStock}
      startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: compact ? 14 : 16 }} />}
      sx={{
        bgcolor: PINK,
        color: '#fff',
        borderRadius: '999px',
        textTransform: 'none',
        fontWeight: 700,
        fontSize: compact ? 11 : 12,
        px: compact ? 1.25 : 2,
        py: compact ? 0.4 : 0.75,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
        '&:hover': { bgcolor: '#ff4757' },
        '&.Mui-disabled': { bgcolor: '#ffc2cd', color: '#fff' },
      }}
    >
      {t('home.addToCart')}
    </Button>
  );

  return (
    <Box
      component={Link}
      to={`/productdetail/${id}`}
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.25,
        bgcolor: '#fff',
        borderRadius: '18px',
        border: '1px solid #ffe1e7',
        boxShadow: '0 6px 18px rgba(255, 107, 129, 0.08)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
        minWidth: 0,
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 24px rgba(255, 107, 129, 0.16)' },
      }}
    >
      <Box
        component="img"
        src={getProductImageSrc(product, images)}
        alt={product.name}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = '/default-product.jpg'; }}
        sx={{
          width: compact ? 96 : 116,
          height: compact ? 76 : 116,
          objectFit: 'cover',
          borderRadius: '12px',
          flexShrink: 0,
          bgcolor: '#fff5f7',
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: compact ? 0.5 : 0.75 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: compact ? 13 : 14,
            color: '#2b2d42',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>
        <Box
          component="span"
          sx={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.25,
            fontSize: 11,
            fontWeight: 600,
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            bgcolor: inStock ? '#e7f7ef' : '#fff1f0',
            color: inStock ? '#22a06b' : '#e5484d',
          }}
        >
          {inStock && <CheckIcon sx={{ fontSize: 12 }} />}
          {t('shop.statusNames')[product.status] || product.status}
        </Box>
        {compact ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: PINK }}>{formatPrice(product.price)}</Typography>
            {addButton}
          </Box>
        ) : (
          <>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: PINK }}>{formatPrice(product.price)}</Typography>
            {addButton}
          </>
        )}
      </Box>
    </Box>
  );
};

export default HomeProductCard;
