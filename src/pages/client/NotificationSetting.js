import React, { useState } from "react";
import { Box, Typography, Switch, Divider, List, ListItem, ListItemText } from "@mui/material";
import Sidebar from "../../function/Sidebar";

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
    <Box display="flex"
    sx={{
      height: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
        <Box sx={{ width: '250px', backgroundColor: '#fff' }}>
        <Sidebar />
      </Box>
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
      {settings.map((setting, index) => (
        <Box key={index} sx={{ marginBottom: "24px" }}>
          {/* Tiêu đề danh mục */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {setting.category}
            </Typography>
            <Switch
              checked={setting.enabled}
              onChange={() => handleCategorySwitch(index)}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "gray", marginBottom: "16px" }}>
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
                    padding: "8px 0",
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {option.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {option.description}
                    </Typography>
                  </Box>
                  <Switch
                    checked={option.enabled}
                    onChange={() => handleOptionSwitch(index, idx)}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* Đường kẻ ngăn cách */}
          {index < settings.length - 1 && <Divider sx={{ margin: "16px 0" }} />}
        </Box>
      ))}
    </Box>
    </Box>
  );
};

export default NotificationSetting;
