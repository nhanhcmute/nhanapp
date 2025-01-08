import React, { createContext, useState, useContext, useEffect } from 'react';
import { ref, get, set, update, remove } from 'firebase/database';
import { database } from '../firebaseConfig'; 

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Custom hook để sử dụng CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider là component bọc ứng dụng để cung cấp trạng thái giỏ hàng
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Lấy giỏ hàng từ Firebase
  const fetchCart = async () => {
    try {
      const cartRef = ref(database, 'cart');
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Chuyển data từ object thành array và cập nhật giỏ hàng
        const cartArray = Object.entries(data).map(([id, product]) => ({
          id, // Lấy id từ key của Firebase
          ...product,
        }));
        setCart(cartArray);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng từ Firebase:', error);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product) => {
    try {
      const cartRef = ref(database, 'cart');
      const newProductRef = ref(database, `cart/${product.id}`); // Sử dụng product.id làm key
      const snapshot = await get(newProductRef);

      if (snapshot.exists()) {
        // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
        const existingProduct = snapshot.val();
        const updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        await set(newProductRef, updatedProduct); // Cập nhật sản phẩm trong Firebase
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === product.id ? updatedProduct : item
          )
        );
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
        const newProduct = { ...product, quantity: 1 };
        await set(newProductRef, newProduct); // Thêm sản phẩm vào Firebase
        setCart((prevCart) => [...prevCart, newProduct]);
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
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
      const productRef = ref(database, `cart/${product.id}`);
      await set(productRef, updatedProduct); // Cập nhật lại sản phẩm
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id ? updatedProduct : item
        )
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    try {
      const productRef = ref(database, `cart/${productId}`);
      await remove(productRef); // Xóa sản phẩm khỏi Firebase
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    }
  };

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  const clearCart = async () => {
    try {
      const cartRef = ref(database, 'cart');
      await remove(cartRef); // Xóa toàn bộ giỏ hàng
      setCart([]);
    } catch (error) {
      console.error('Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng:', error);
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

  // Lấy giỏ hàng từ Firebase khi component được load
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
        clearCart,
        getTotalQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
