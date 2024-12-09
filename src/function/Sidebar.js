import React from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AccountCircle, Home, CreditCard, Lock, Notifications, PrivacyTip, ShoppingCart, CardGiftcard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();

  const accountMenuItems = [
    { icon: <AccountCircle />, text: 'Hồ sơ', route: '/profile' },
    { icon: <Home />, text: 'Địa chỉ', route: '/address' },
    { icon: <CreditCard />, text: 'Ngân hàng', route: '/bank' },
    { icon: <Lock />, text: 'Đổi mật khẩu', route: '/change-password' },
    { icon: <Notifications />, text: 'Cài đặt thông báo', route: '/notificationsetting' },
    { icon: <PrivacyTip />, text: 'Thiết lập riêng tư', route: '/privacy' },
  ];

  const otherMenuItems = [
    { icon: <ShoppingCart />, text: 'Đơn mua', route: '/orders' },
    { icon: <Notifications />, text: 'Thông báo', route: '/alerts' },
    { icon: <CardGiftcard />, text: 'Voucher', route: '/voucher' },
  ];

  // State để lưu trữ ảnh
  const [avatarImage, setAvatarImage] = useState(null);

  // Hàm để xử lý upload ảnh
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Lưu ảnh vào LocalStorage
        localStorage.setItem("avatar", reader.result);
        setAvatarImage(reader.result); // Cập nhật avatar ngay lập tức
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Khi load trang, kiểm tra và cập nhật avatar từ LocalStorage
  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) {
      setAvatarImage(storedAvatar);
    }
  }, []);

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
        onClick={() => document.getElementById("avatar-upload").click()} // Mở cửa sổ chọn file khi click vào avatar
        style={{ cursor: "pointer" }}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "primary.main",
          marginRight: 2,
          backgroundImage: avatarImage ? `url(${avatarImage})` : "none", // Nếu có ảnh, set ảnh vào avatar
          backgroundSize: "cover", // Đảm bảo ảnh bao phủ avatar
        }}
      />
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarChange} // Khi chọn ảnh, sẽ cập nhật avatar
      />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            Tên User
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
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'primary.light',
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
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'primary.light',
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
