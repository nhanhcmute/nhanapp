import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await client.post('/user.ctr/login', { username, password });
      if (response.data.status === 200) {
        const user = response.data.data;
        if (user.role !== 3) {
          alert('Tài khoản này không phải là Shipper');
          setIsLoading(false);
          return;
        }
        setUserInfo(user);
        setUserToken(user.id); // Tạm dùng ID làm token hoặc token thật nếu có
        await AsyncStorage.setItem('userToken', user.id);
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        alert('Đăng nhập thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert('Lỗi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      let userInfo = await AsyncStorage.getItem('userInfo');
      
      if (userToken) {
        setUserToken(userToken);
        setUserInfo(JSON.parse(userInfo));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error ${e}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
