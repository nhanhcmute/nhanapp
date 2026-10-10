import React, { useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, Box, Button, Checkbox, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../store/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';

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

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, product) => {
      if (selectedItems[product.id || product._id]) {
        const price = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0 
          : product.price || 0;
        return total + price * product.quantity;
      }
      return total;
    }, 0);
  };

  const handleRemoveFromCart = (product) => {
    removeFromCart(product.id || product._id);
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    const newSelectedItems = {};
    cart.forEach((product) => {
      newSelectedItems[product.id || product._id] = isChecked;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItemChange = (product, event) => {
    const isChecked = event.target.checked;
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [product.id || product._id]: isChecked,
    }));
  };

  const handleRemoveAll = async () => {
    if (cart.length === 0) {
      return; 
    }
  
    try {
      await Promise.all(cart.map(product => removeFromCart(product.id || product._id)));
      setSelectAll(false);
      setSelectedItems({});
    } catch (error) {
      console.error("Lỗi khi xóa tất cả sản phẩm:", error);
    }
  };

  const handleCheckout = () => {
    const isSelectedAnyProduct = Object.values(selectedItems).includes(true);

    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống! 🛒');
      return;
    }

    if (!isSelectedAnyProduct) {
      alert('Bạn chưa chọn sản phẩm thanh toán! 🐾');
      return;
    }

    navigate('/checkout', {
      state: {
        cart: cart,
        selectedItems: selectedItems,
      },
    });
  };

  const handleIncrease = (product) => {
    updateCartQuantity(product, product.quantity + 1);
  };

  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      updateCartQuantity(product, product.quantity - 1);
    }
  };

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    return (
      <Container sx={{ 
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 8,
      }}>
        <Box sx={{ 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '2px solid rgba(255, 107, 129, 0.2)',
          boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
          p: 6,
          maxWidth: '500px',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
            <FaPaw size={48} color="#ff6b81" />
            <ShoppingCartIcon sx={{ fontSize: 48, color: '#ff6b81' }} />
            <FaPaw size={48} color="#ff6b81" />
          </Box>
          <Typography variant="h5" sx={{ color: '#ff6b81', fontWeight: 700, mb: 2 }}>
            🛒 Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/productlist')}
            sx={{
              backgroundColor: '#ff6b81',
              color: 'white',
              borderRadius: '20px',
              px: 4,
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
            🐾 Mua ngay
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ 
      paddingTop: 4,
      paddingBottom: 4,
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <FaPaw size={32} color="#ff6b81" />
        <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700 }}>
          🛒 Giỏ hàng của bạn
        </Typography>
        <FaPaw size={32} color="#ff6b81" />
      </Box>

      {/* Select All & Remove All */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 107, 129, 0.2)',
          boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllChange}
              sx={{
                color: '#ff6b81',
                '&.Mui-checked': {
                  color: '#ff6b81',
                },
              }}
            />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff6b81' }}>
              Chọn Tất Cả ({cart.length})
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleRemoveAll}
            sx={{
              borderColor: '#ff4757',
              color: '#ff4757',
              borderRadius: '12px',
              px: 3,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🗑️ Xóa tất cả
          </Button>
        </Box>
      </Paper>

      {/* Cart Items */}
      <Grid container spacing={3}>
        {cart.map((product) => {
          const productId = product.id || product._id;
          const price = typeof product.price === 'string' 
            ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0 
            : product.price || 0;
          const totalPrice = price * product.quantity;
          
          return (
            <Grid item xs={12} key={productId}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '2px solid rgba(255, 107, 129, 0.2)',
                  boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(255, 107, 129, 0.25)',
                    borderColor: 'rgba(255, 107, 129, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Checkbox
                        checked={selectedItems[productId] || false}
                        onChange={(event) => handleSelectItemChange(product, event)}
                        sx={{
                          color: '#ff6b81',
                          '&.Mui-checked': {
                            color: '#ff6b81',
                          },
                        }}
                      />
                      <Box
                        component="img"
                        src={product.image ? (images[product.image] || product.image) : '/default-product.jpg'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/default-product.jpg';
                        }}
                        sx={{
                          width: { xs: 80, sm: 120 },
                          height: { xs: 80, sm: 120 },
                          objectFit: 'cover',
                          borderRadius: '16px',
                          border: '2px solid rgba(255, 107, 129, 0.2)',
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', marginBottom: 1 }}>
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          marginBottom: 1,
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                          lineHeight: 1.6,
                        }}
                      >
                        {product.description || 'Mô tả sản phẩm'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600 }}>
                        💰 {price.toLocaleString()} VNĐ / sản phẩm
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' }, gap: { xs: 1.5, sm: 3 } }}>
                      {/* Quantity Controls */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        border: '2px solid rgba(255, 107, 129, 0.3)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}>
                        <IconButton 
                          onClick={() => handleDecrease(product)} 
                          sx={{ 
                            color: '#ff6b81',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 129, 0.1)',
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Box sx={{ 
                          borderLeft: '1px solid rgba(255, 107, 129, 0.2)',
                          borderRight: '1px solid rgba(255, 107, 129, 0.2)',
                          px: 2,
                          py: 0.5,
                          minWidth: '50px',
                          textAlign: 'center',
                          backgroundColor: 'rgba(255, 107, 129, 0.05)',
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff6b81' }}>
                            {product.quantity}
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => handleIncrease(product)} 
                          sx={{ 
                            color: '#ff6b81',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 129, 0.1)',
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      
                      {/* Total Price */}
                      <Typography sx={{
                        fontWeight: 700,
                        color: '#ff4757',
                        fontSize: '18px',
                        minWidth: { xs: 0, sm: '150px' },
                        textAlign: 'right',
                      }}>
                        {totalPrice.toLocaleString()} VNĐ
                      </Typography>
                      
                      {/* Delete Button */}
                      <IconButton 
                        onClick={() => handleRemoveFromCart(product)}
                        sx={{
                          color: '#ff4757',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 71, 87, 0.1)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Total & Checkout */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 107, 129, 0.2)',
          boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#666', mb: 1 }}>
            Tổng số sản phẩm đã chọn: {Object.values(selectedItems).filter(Boolean).length}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff6b81' }}>
            Tổng cộng: <span style={{ color: '#ff4757' }}>{calculateTotal().toLocaleString()} VNĐ</span>
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleCheckout}
          sx={{
            backgroundColor: '#ff6b81',
            color: 'white',
            borderRadius: '20px',
            px: 5,
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
          🐾 Thanh toán ngay
        </Button>
      </Paper>
    </Container>
  );
};

export default CartPage;
