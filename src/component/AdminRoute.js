import React from 'react';
import { Navigate } from 'react-router-dom';

// Component bảo vệ trang admin
const AdminRoute = ({ element, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Kiểm tra quyền truy cập admin
  if (user && user.username === 'admin' && user.password === 'Xenlulozo1@') {
    return element; // Nếu là admin, cho phép truy cập
  } else {
    return <Navigate to="/homepage" />; // Nếu không phải admin, điều hướng về trang chính
  }
};

export default AdminRoute;
