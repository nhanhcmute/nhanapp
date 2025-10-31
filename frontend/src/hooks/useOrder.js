import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebaseConfig';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = ref(database, 'orders'); // Đường dẫn đến danh sách đơn hàng trong Firebase
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const ordersArray = Object.entries(data).map(([id, order]) => ({
            id,
            ...order,
          }));
          setOrders(ordersArray); // Cập nhật đơn hàng
        } else {
          console.log('Không có đơn hàng nào.');
        }
      } catch (error) {
        setError(error);
        console.error('Lỗi khi tải dữ liệu đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export default useOrders;
