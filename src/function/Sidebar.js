import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AccountCircle, Home, CreditCard, Lock, Notifications, PrivacyTip, ShoppingCart, CardGiftcard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  // Cấu hình các menu items
  const accountMenuItems = [
    { icon: <AccountCircle />, text: 'Hồ sơ', route: '/profile' },
    { icon: <Home />, text: 'Địa chỉ', route: '/address' },
    { icon: <CreditCard />, text: 'Ngân hàng', route: '/bank' },
    { icon: <Lock />, text: 'Đổi mật khẩu', route: '/changepassword' },
    { icon: <Notifications />, text: 'Cài đặt thông báo', route: '/notificationsetting' },
    { icon: <PrivacyTip />, text: 'Thiết lập riêng tư', route: '/privacy' },
  ];

  const otherMenuItems = [
    { icon: <ShoppingCart />, text: 'Đơn mua', route: '/orders' },
    { icon: <Notifications />, text: 'Thông báo', route: '/alerts' },
    { icon: <CardGiftcard />, text: 'Voucher', route: '/voucher' },
  ];

  // Lấy avatar và username từ LocalStorage
  const [avatarImage, setAvatarImage] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Lấy đối tượng user từ localStorage

    if (storedUser) {
      setUsername(storedUser.username); // Lấy username từ đối tượng user
      setAvatarImage(storedUser.avatar); // Lấy avatar từ đối tượng user (nếu có)
    }
  }, []);

  // Hàm để xử lý upload ảnh
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Lưu avatar vào LocalStorage
        const newAvatar = reader.result;
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        storedUser.avatar = newAvatar; // Thêm avatar mới vào user
        localStorage.setItem('user', JSON.stringify(storedUser)); // Lưu lại đối tượng user với avatar mới

        setAvatarImage(newAvatar); // Cập nhật avatar ngay lập tức
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        width: '250px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
        padding: 2,
      }}
    >
      {/* Thông tin người dùng */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Avatar
          onClick={() => document.getElementById("avatar-upload").click()} 
          style={{ cursor: "pointer" }}
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "primary.main",
            marginRight: 2,
            backgroundImage: avatarImage ? `url(${avatarImage})` : "none", 
            backgroundSize: "cover", 
          }}
        />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange} 
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            {username || 'Tên User'} {/* Hiển thị username nếu có, hoặc 'Tên User' nếu chưa có */}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Tài khoản của tôi
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: 2 }} />

      {/* Tài khoản của tôi */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Tài khoản của tôi
      </Typography>
      <List>
        {accountMenuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => navigate(item.route)}
            sx={{
              cursor: "pointer",
              '&:hover': {
                backgroundColor: '#e2e6ea',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 2 }} />

      {/* Các mục khác */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Khác
      </Typography>
      <List>
        {otherMenuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => navigate(item.route)}
            sx={{
              cursor: "pointer",
              '&:hover': {
                backgroundColor: '#e2e6ea',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
