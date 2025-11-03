import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Component bảo vệ các route yêu cầu đăng nhập
const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  
  // Kiểm tra xem user có đăng nhập không
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      
      // Kiểm tra xem user object có hợp lệ không
      if (user && (user.id || user.username)) {
        return element; // Nếu đã đăng nhập, cho phép truy cập
      } else {
        // User object không hợp lệ, xóa và redirect
        localStorage.removeItem('user');
        return <Navigate to="/login" state={{ from: location.pathname, message: 'Vui lòng đăng nhập để tiếp tục' }} replace />;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Nếu parse lỗi, xóa localStorage và redirect về login
      localStorage.removeItem('user');
      return <Navigate to="/login" state={{ from: location.pathname, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }} replace />;
    }
  }
  
  // Nếu chưa đăng nhập, redirect về trang login với thông tin trang gốc
  return <Navigate to="/login" state={{ from: location.pathname, message: 'Vui lòng đăng nhập để truy cập trang này' }} replace />;
};

export default ProtectedRoute;

