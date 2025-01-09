import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_TIME = 10 * 60 * 1000; 

const AutoLogout = () => {
  const navigate = useNavigate();
  let timeout;

  const handleUserActivity = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('lastActivity', currentTime);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => handleLogout(), AUTO_LOGOUT_TIME);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng
    localStorage.removeItem('lastActivity'); // Xóa thông tin hoạt động
    alert('Bạn đã bị đăng xuất do không hoạt động.');
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  useEffect(() => {
    // Kiểm tra nếu thời gian không hoạt động vượt quá giới hạn
    const lastActivity = localStorage.getItem('lastActivity');
    const currentTime = new Date().getTime();

    if (lastActivity && currentTime - lastActivity > AUTO_LOGOUT_TIME) {
      handleLogout();
    }

    // Theo dõi các hoạt động của người dùng (di chuột hoặc nhấn phím)
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return null; // Không render bất cứ UI nào
};

export default AutoLogout;
