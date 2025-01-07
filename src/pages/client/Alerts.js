import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, List, ListItem, ListItemText, IconButton, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../function/Sidebar';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  // Lấy dữ liệu thông báo từ API
  useEffect(() => {
    axios.get('http://localhost:5000/notifications')
      .then((response) => {
        const data = response.data;

        // Sắp xếp thông báo theo timestamp từ mới đến cũ
        const sortedAlerts = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setAlerts(sortedAlerts);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu thông báo', error);
      });
  }, []);

  // Xử lý đánh dấu là đã đọc và gửi yêu cầu PATCH tới API
  const handleMarkAsRead = (id) => {
    // Cập nhật giá trị trong state trước khi gửi yêu cầu PATCH
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );

    // Gửi yêu cầu PATCH để cập nhật trạng thái đã đọc trên API
    axios.patch(`http://localhost:5000/notifications/${id}`, { isRead: true })
      .then(() => {
        console.log('Thông báo đã được đánh dấu là đã đọc');
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật thông báo:', error);
      });
  };

  // Xử lý xóa thông báo đã đọc
  const handleDeleteRead = () => {
    const readAlerts = alerts.filter((alert) => alert.isRead);

    // Xóa thông báo đã đọc trong state
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => !alert.isRead));

    // Gửi yêu cầu xóa các thông báo đã đọc trong API
    readAlerts.forEach((alert) => {
      axios.delete(`http://localhost:5000/notifications/${alert.id}`)
        .then(() => {
          console.log(`Thông báo ${alert.id} đã được xóa`);
        })
        .catch((error) => {
          console.error(`Lỗi khi xóa thông báo ${alert.id}:`, error);
        });
    });
  };

  // Tính số lượng thông báo chưa đọc
  const unreadCount = alerts.filter(alert => !alert.isRead).length;

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
                  checked={alert.isRead} // Tự động đánh dấu nếu đã đọc
                  onChange={() => handleMarkAsRead(alert.id)}
                  sx={{ marginRight: 2 }}
                />
                <ListItemText
                  primary={alert.title}
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ color: alert.isRead ? 'text.secondary' : 'text.primary' }}>
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888', marginTop: 1 }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
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
