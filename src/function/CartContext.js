import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Custom hook để sử dụng CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// URL của API JSON Server
const API_URL = 'http://localhost:5000/cart';

// CartProvider là component bọc ứng dụng để cung cấp trạng thái giỏ hàng
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
    try {
      const response = await axios.get(API_URL);
      setCart(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product) => {
    try {
      const existingProduct = cart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Nếu sản phẩm đã có, cập nhật số lượng
        const updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        await axios.put(`${API_URL}/${existingProduct.id}`, updatedProduct);
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === product.id ? updatedProduct : item
          )
        );
      } else {
        // Nếu sản phẩm chưa có, thêm vào giỏ hàng
        const newProduct = { ...product, quantity: 1 };
        const response = await axios.post(API_URL, newProduct);
        setCart((prevCart) => [...prevCart, response.data]);
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartQuantity = async (product, quantity) => {
    try {
      if (quantity < 1) {
        // Nếu số lượng nhỏ hơn 1, xóa sản phẩm
        await removeFromCart(product.id);
        return;
      }

      const updatedProduct = { ...product, quantity };
      await axios.put(`${API_URL}/${product.id}`, updatedProduct);
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id ? updatedProduct : item
        )
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/${productId}`);
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  const clearCart = async () => {
    try {
      const deleteRequests = cart.map((item) =>
        axios.delete(`${API_URL}/${item.id}`)
      );
      await Promise.all(deleteRequests);
      setCart([]);
    } catch (error) {
      console.error('Lỗi khi xóa tất cả sản phẩm:', error);
    }
  };

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const getTotalQuantity = () => {
    return cart.reduce((total, product) => total + product.quantity, 0);
  };

  // Tính tổng tiền của giỏ hàng
  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.quantity * product.price, 0);
  };

  // Lấy giỏ hàng từ API khi component được load
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart, // Thêm hàm xóa tất cả sản phẩm
        getTotalQuantity,
        getTotalPrice, // Thêm hàm tính tổng tiền
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
