import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AccountCircle, Home, CreditCard, Lock, Notifications, PrivacyTip, ShoppingCart, CardGiftcard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';

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
  const [name, setName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Lấy đối tượng user từ localStorage

    if (storedUser) {
      setName(storedUser.name); // Lấy username từ đối tượng user
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
        minWidth: '250px',
        maxWidth: '250px',
        flexShrink: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '2px solid rgba(255, 107, 129, 0.2)',
        boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
        padding: 2,
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
      }}
    >
      
      {/* Thông tin người dùng */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 3,
          padding: 2,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255, 107, 129, 0.1) 0%, rgba(255, 217, 61, 0.1) 100%)',
          border: '1px solid rgba(255, 107, 129, 0.2)',
        }}
      >
        <Avatar
          onClick={() => document.getElementById("avatar-upload").click()} 
          style={{ cursor: "pointer" }}
          sx={{
            width: 50,
            height: 50,
            backgroundColor: "#ff6b81",
            marginRight: 2,
            backgroundImage: avatarImage ? `url(${avatarImage})` : "none", 
            backgroundSize: "cover",
            border: '3px solid rgba(255, 107, 129, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(255, 107, 129, 0.4)',
            },
          }}
        >
          {!avatarImage && <FaPaw size={24} color="white" />}
        </Avatar>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange} 
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', fontSize: '16px' }}>
            {name || 'Tên User'} 🐾
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
            Thành viên
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: 2, borderColor: 'rgba(255, 107, 129, 0.2)' }} />

      {/* Tài khoản của tôi */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FaPaw size={16} color="#ff6b81" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b81' }}>
          Tài khoản của tôi
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {accountMenuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => navigate(item.route)}
            sx={{
              cursor: "pointer",
              borderRadius: '12px',
              marginBottom: '4px',
              padding: '10px 12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 129, 0.1)',
                transform: 'translateX(4px)',
                boxShadow: '0 2px 8px rgba(255, 107, 129, 0.15)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ff6b81', minWidth: '40px' }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: { fontWeight: 600, color: '#666', fontSize: '14px' }
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 2, borderColor: 'rgba(255, 107, 129, 0.2)' }} />

      {/* Các mục khác */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FaPaw size={16} color="#ff6b81" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b81' }}>
          Khác
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {otherMenuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => navigate(item.route)}
            sx={{
              cursor: "pointer",
              borderRadius: '12px',
              marginBottom: '4px',
              padding: '10px 12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 129, 0.1)',
                transform: 'translateX(4px)',
                boxShadow: '0 2px 8px rgba(255, 107, 129, 0.15)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ff6b81', minWidth: '40px' }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: { fontWeight: 600, color: '#666', fontSize: '14px' }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
