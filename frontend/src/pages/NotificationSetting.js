import React, { useState } from "react";
import { Box, Typography, Switch, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import Sidebar from '../components/layout/Sidebar';
import { FaPaw } from 'react-icons/fa';
import NotificationsIcon from '@mui/icons-material/Notifications';
  
const NotificationSetting = () => {
  // Dữ liệu cấu hình thông báo
  const [settings, setSettings] = useState([
    {
      category: "Email thông báo",
      description: "Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt",
      enabled: true,
      options: [
        { label: "Cập nhật đơn hàng", description: "Cập nhật về tình trạng vận chuyển của tất cả các đơn hàng", enabled: true },
        { label: "Khuyến mãi", description: "Cập nhật các ưu đãi và khuyến mãi sắp tới", enabled: true },
        { label: "Khảo sát", description: "Đồng ý nhận khảo sát để chúng tôi được lắng nghe bạn", enabled: false },
      ],
    },
    {
      category: "Thông báo SMS",
      description: "Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt",
      enabled: true,
      options: [
        { label: "Khuyến mãi", description: "Cập nhật về các ưu đãi và khuyến mãi sắp tới", enabled: true },
      ],
    },
    {
      category: "Thông báo Zalo",
      description: "Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt",
      enabled: true,
      options: [
        { label: "Khuyến mãi (Shopee Việt Nam)", description: "Cập nhật các ưu đãi và khuyến mãi sắp tới", enabled: true },
      ],
    },
  ]);

  // Hàm chuyển đổi trạng thái `enabled` của mục chính
  const handleCategorySwitch = (index) => {
    const updatedSettings = [...settings];
    updatedSettings[index].enabled = !updatedSettings[index].enabled;
    setSettings(updatedSettings);
  };

  // Hàm chuyển đổi trạng thái `enabled` của từng tùy chọn
  const handleOptionSwitch = (categoryIndex, optionIndex) => {
    const updatedSettings = [...settings];
    updatedSettings[categoryIndex].options[optionIndex].enabled =
      !updatedSettings[categoryIndex].options[optionIndex].enabled;
    setSettings(updatedSettings);
  };

  return (
    <Box
      display="flex"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      }}
    >
      <Sidebar />
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <FaPaw size={32} color="#ff6b81" />
          <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700 }}>
            🔔 Cài Đặt Thông Báo
          </Typography>
          <FaPaw size={32} color="#ff6b81" />
        </Box>

        {settings.map((setting, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              marginBottom: 4,
              padding: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
                borderColor: 'rgba(255, 107, 129, 0.4)',
              },
            }}
          >
            {/* Tiêu đề danh mục */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaPaw size={20} color="#ff6b81" />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                  {setting.category}
                </Typography>
              </Box>
              <Switch
                checked={setting.enabled}
                onChange={() => handleCategorySwitch(index)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#ff6b81',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#ff6b81',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: 3, lineHeight: 1.8 }}>
              {setting.description}
            </Typography>

            {/* Các tùy chọn */}
            {setting.enabled && (
              <List>
                {setting.options.map((option, idx) => (
                  <ListItem
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: 2,
                      marginBottom: 2,
                      backgroundColor: 'rgba(255, 107, 129, 0.05)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 107, 129, 0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 129, 0.1)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <FaPaw size={14} color="#ff6b81" />
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff6b81' }}>
                          {option.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                        {option.description}
                      </Typography>
                    </Box>
                    <Switch
                      checked={option.enabled}
                      onChange={() => handleOptionSwitch(index, idx)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b81',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b81',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {/* Đường kẻ ngăn cách */}
            {index < settings.length - 1 && (
              <Divider sx={{ margin: "24px 0", borderColor: 'rgba(255, 107, 129, 0.2)' }} />
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default NotificationSetting;
