import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, List, ListItem, ListItemText, IconButton, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../function/Sidebar';
import axios from 'axios';

const Alerts = () => {
  // State để lưu thông báo
  const [alerts, setAlerts] = useState([]);
  
  // Lấy dữ liệu thông báo từ API
  useEffect(() => {
    // Thay đổi đường dẫn API thành đường dẫn chính thức của bạn
    axios.get('http://localhost:5000/notifications')
      .then((response) => {
        const data = response.data;  // Lấy dữ liệu từ API
        // Thiết lập giá trị mặc định cho trạng thái "isRead"
        const alertsWithReadStatus = data.map(alert => ({
          ...alert,
          isRead: false,  // Mặc định tất cả thông báo là chưa đọc
        }));
        setAlerts(alertsWithReadStatus);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu thông báo', error);
      });
  }, []); // Chỉ chạy 1 lần khi component được mount

  // Xử lý đánh dấu là đã đọc
  const handleMarkAsRead = (id) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  // Xử lý xóa thông báo đã đọc
  const handleDeleteRead = () => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => !alert.isRead));
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ width: '100%', padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Thông Báo
          </Typography>
        </Box>

        {/* Danh sách thông báo */}
        <Paper sx={{ padding: 3, boxShadow: 3 }}>
          <List>
            {alerts.map((alert) => (
              <ListItem
                key={alert.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: alert.isRead ? '#f5f5f5' : '#e8f5e9',
                  marginBottom: 2,
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Checkbox
                  checked={alert.isRead}
                  onChange={() => handleMarkAsRead(alert.id)}
                  sx={{ marginRight: 2 }}
                />
                <ListItemText
                  primary={alert.message}
                  secondary={alert.isRead ? "Đã đọc" : "Chưa đọc"}
                  primaryTypographyProps={{
                    fontWeight: alert.isRead ? 'normal' : 'bold',
                    color: alert.isRead ? 'text.secondary' : 'text.primary',
                  }}
                />
                {!alert.isRead && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleMarkAsRead(alert.id)}
                    sx={{ marginLeft: 'auto' }}
                  >
                    Đánh dấu là đã đọc
                  </Button>
                )}
              </ListItem>
            ))}
          </List>

          {/* Divider */}
          <Divider sx={{ margin: '16px 0' }} />

          {/* Nút xóa thông báo đã đọc */}
          {alerts.some((alert) => alert.isRead) && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton color="error" onClick={handleDeleteRead}>
                <DeleteIcon />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Xóa thông báo đã đọc
                </Typography>
              </IconButton>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Alerts;
