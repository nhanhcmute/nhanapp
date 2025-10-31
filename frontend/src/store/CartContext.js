import React, { createContext, useState, useContext, useEffect } from 'react';
import { ref, get, set, remove, onValue } from 'firebase/database';
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
  const [loading, setLoading] = useState(true);

  // Hàm xử lý lỗi chung
  const handleError = (error, message) => {
    console.error(message, error);
    setLoading(false);
  };

  // Lấy giỏ hàng từ Firebase và lắng nghe thay đổi
  const fetchCart = () => {
    const cartRef = ref(database, 'cart');
    onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const cartArray = Object.entries(data).map(([id, product]) => ({
          id, // Lấy id từ key của Firebase
          ...product,
        }));
        setCart(cartArray);
      } else {
        setCart([]);
      }
      setLoading(false);
    }, (error) => handleError(error, 'Lỗi khi lấy giỏ hàng từ Firebase'));
  };

  const addToCart = async (product) => {
    const cartRef = ref(database, 'cart');
    try {
      // Lấy tất cả dữ liệu giỏ hàng hiện tại
      const snapshot = await get(cartRef);
      const cartData = snapshot.exists() ? snapshot.val() : {};
  
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProduct = Object.values(cartData).find(item => item.id === product.id);
  
      if (existingProduct) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        const updatedCartData = { ...cartData };
        updatedCartData[existingProduct.id].quantity += 1;
  
        // Cập nhật lại giỏ hàng trong Firebase
        await set(cartRef, updatedCartData);
      } else {
        // Nếu sản phẩm chưa có, thêm mới với số lượng là 1
        const newProductRef = ref(database, `cart/${product.id}`);
        const newProduct = { ...product, quantity: 1 };
        await set(newProductRef, newProduct);
      }
    } catch (error) {
      handleError(error, 'Lỗi khi thêm sản phẩm vào giỏ hàng');
    }
  };
  

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartQuantity = async (product, quantity) => {
    if (quantity < 1) {
      // Nếu số lượng nhỏ hơn 1, xóa sản phẩm
      await removeFromCart(product.id);
      return;
    }

    const updatedProduct = { ...product, quantity };
    const productRef = ref(database, `cart/${product.id}`);
    try {
      await set(productRef, updatedProduct); // Cập nhật lại sản phẩm
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật số lượng sản phẩm');
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    const productRef = ref(database, `cart/${productId}`);
    try {
      await remove(productRef); // Xóa sản phẩm khỏi Firebase
    } catch (error) {
      handleError(error, 'Lỗi khi xóa sản phẩm khỏi giỏ hàng');
    }
  };

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  const clearCart = async () => {
    const cartRef = ref(database, 'cart');
    try {
      // Lấy tất cả các sản phẩm trong giỏ hàng
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {
        // Nếu có sản phẩm trong giỏ hàng, tiến hành xóa từng sản phẩm
        const products = snapshot.val();

        // Lặp qua tất cả các sản phẩm và xóa từng sản phẩm một
        for (const productId in products) {
          const productRef = ref(database, `cart/${productId}`);
          await remove(productRef); // Xóa sản phẩm khỏi Firebase
        }
      }
    } catch (error) {
      handleError(error, 'Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng');
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
  }, []); // Sẽ chạy 1 lần khi component được load

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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
