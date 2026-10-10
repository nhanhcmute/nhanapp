import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { cartService } from '../services/cartService';

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Custom hook để sử dụng CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider là component bọc ứng dụng để cung cấp trạng thái giỏ hàng
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm xử lý lỗi chung
  const handleError = useCallback((error, message) => {
    console.error(message, error);
    setLoading(false);
  }, []);

  // Lấy giỏ hàng từ API
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const result = await cartService.getCart();
      if (result.status === 200 && result.data) {
        // Chuyển đổi từ API response sang format cũ để tương thích
        const cartItems = result.data.items || [];
        const formattedCart = cartItems.map(item => ({
          id: item.productId,
          _id: item.productId,
          cartItemId: item.id, // Lưu cartItemId để dùng cho update/delete
          name: item.productName,
          price: item.unitPrice,
          quantity: item.quantity,
          image: item.image || '/default-image.png',
          description: item.description || '',
        }));
        setCart(formattedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      handleError(error, 'Lỗi khi lấy giỏ hàng từ API');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const addToCart = useCallback(async (product) => {
    try {
      if (!product || !product.id) {
        alert('Thông tin sản phẩm không hợp lệ');
        return;
      }

      const result = await cartService.addItem(product.id, product.productVariantId || null, 1);
      if (result.status === 200) {
        await fetchCart(); // Refresh cart
      } else {
        const errorMsg = result.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng';
        console.error('Add to cart error:', errorMsg, result);
        alert(errorMsg);
      }
    } catch (error) {
      handleError(error, 'Lỗi khi thêm sản phẩm vào giỏ hàng');
      console.error('Add to cart exception:', error);
      alert('Lỗi khi thêm sản phẩm vào giỏ hàng: ' + (error.message || 'Không thể kết nối đến server'));
    }
  }, [fetchCart, handleError]);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback(async (productId) => {
    try {
      // Tìm cart item ID từ cart hiện tại
      const cartItem = cart.find(item => (item.id || item._id) === productId);
      if (cartItem && cartItem.cartItemId) {
        const result = await cartService.removeItem(cartItem.cartItemId);
        if (result.status === 200) {
          await fetchCart(); // Refresh cart
        }
      } else {
        // Fallback: remove từ local state
        setCart(cart.filter(item => (item.id || item._id) !== productId));
      }
    } catch (error) {
      handleError(error, 'Lỗi khi xóa sản phẩm khỏi giỏ hàng');
    }
  }, [cart, fetchCart, handleError]);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartQuantity = useCallback(async (product, quantity) => {
    if (quantity < 1) {
      // Nếu số lượng nhỏ hơn 1, xóa sản phẩm
      await removeFromCart(product.id || product._id);
      return;
    }

    try {
      // Tìm cart item ID từ cart hiện tại
      const cartItem = cart.find(item => (item.id || item._id) === (product.id || product._id));
      if (cartItem && cartItem.cartItemId) {
        const result = await cartService.updateItem(cartItem.cartItemId, quantity);
        if (result.status === 200) {
          await fetchCart(); // Refresh cart
        }
      } else {
        // Fallback: refresh cart để lấy cartItemId
        await fetchCart();
        const updatedCart = cart.map(item =>
          (item.id || item._id) === (product.id || product._id)
            ? { ...item, quantity }
            : item
        );
        setCart(updatedCart);
      }
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật số lượng sản phẩm');
    }
  }, [cart, fetchCart, handleError, removeFromCart]);

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  const clearCart = useCallback(async () => {
    try {
      const result = await cartService.clearCart();
      if (result.status === 200) {
        setCart([]);
      }
    } catch (error) {
      handleError(error, 'Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng');
    }
  }, [handleError]);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const getTotalQuantity = useCallback(() => {
    return cart.reduce((total, product) => total + (product.quantity || 0), 0);
  }, [cart]);

  // Tính tổng tiền của giỏ hàng
  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, product) => {
      const price = typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0
        : product.price || 0;
      return total + price * (product.quantity || 0);
    }, 0);
  }, [cart]);

  // Lấy giỏ hàng từ API khi component được load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // fetchCart có identity ổn định (memoized) nên effect này vẫn chỉ chạy 1 lần khi mount

  // Memo hóa value để tránh tạo object/consumer re-render mới mỗi lần CartProvider render
  const value = useMemo(() => ({
    cart,
    loading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getTotalQuantity,
    getTotalPrice,
  }), [cart, loading, addToCart, updateCartQuantity, removeFromCart, clearCart, getTotalQuantity, getTotalPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
