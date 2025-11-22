import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Dùng IP LAN để điện thoại thật có thể kết nối tới Backend trên máy tính
// IP máy tính của bạn là: 192.168.1.11
// Backend đang chạy trên port 5000
// Không thêm /api vì một số controller không dùng prefix này
const BASE_URL = 'http://192.168.1.11:5000'; 

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`; // Nếu backend dùng Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
